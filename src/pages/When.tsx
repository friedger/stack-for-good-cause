import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { stacksNodeService } from "@/services/stacksNodeService";
import { Clock, Calendar, Activity, Timer, AlertCircle, TrendingUp } from "lucide-react";
import { FastPoolEvent, fastPoolEvents } from "@/lib/fastpoolPhases";
import { useCycleBlockHeights } from "@/hooks/useCycleBlockHeights";


const When = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cycleData, loading: cycleLoading, error: cycleError } = useCycleBlockHeights();

  // Calculate time remaining for upcoming events
  const events = fastPoolEvents(cycleData).map(event => {
    if (event.status === 'upcoming') {
      const blocksRemaining = stacksNodeService.getBlocksUntil(event.blockHeight, cycleData.currentBlockHeight);
      const timeRemaining = stacksNodeService.calculateTimeFromBlocks(blocksRemaining);
      return {
        ...event,
        blocksRemaining,
        timeRemaining
      };
    }
    return event;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-gray-700" />
            <Skeleton className="h-4 w-96 bg-gray-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Skeleton className="h-4 w-32 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-400 mb-4">Error</h1>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentCycleEvent = events.find(e => e.name === "Current block height");
  const cycleNumber = events.find(e => e.name === "Miners start PoX Cycle")?.blockHeight ?
    Math.floor((events.find(e => e.name === "Miners start PoX Cycle")!.blockHeight - 666050) / 2100) + 1 : 114;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Fast Pool Cycle Events
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Timeline of Fast Pool events during the current stacking cycle
          </p>
        </div>

        {/* Current Cycle Info */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-purple-200">Current Cycle</CardTitle>
            <Calendar className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-400 mb-2">{cycleNumber}</div>
            <div className="text-sm text-purple-300">
              Current block height: {currentCycleEvent?.blockHeight.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Events Timeline */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Fast Pool Events Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {events.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <Badge
                      variant={event.status === 'active' ? 'default' :
                        event.status === 'completed' ? 'secondary' : 'outline'}
                      className={`${event.status === 'active' ? 'bg-green-600 hover:bg-green-700' :
                        event.status === 'completed' ? 'bg-gray-600' : 'border-gray-500'
                        }`}
                    >
                      {event.status === 'active' && <Activity className="h-3 w-3 mr-1" />}
                      {event.status === 'completed' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {event.status === 'upcoming' && <Timer className="h-3 w-3 mr-1" />}
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-lg">{event.name}</div>
                    <div className="text-sm text-gray-400 mb-2">{event.description}</div>
                    <div className="text-lg font-mono text-blue-400 mb-2">
                      {event.blockHeight.toLocaleString()}
                    </div>
                    {event.status === 'upcoming' && event.blocksRemaining && event.timeRemaining && (
                      <div className="text-sm text-yellow-400">
                        <div className="mb-1">in {event.blocksRemaining} blocks or {event.timeRemaining}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default When;