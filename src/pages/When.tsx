import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { analyticsService, CycleData } from "@/services/analyticsService";
import { Clock, Calendar, TrendingUp, Activity, Timer, AlertCircle } from "lucide-react";

const When = () => {
  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cycles = await analyticsService.fetchCycleData();
        setCycleData(cycles);
      } catch (error) {
        console.error('Error fetching cycle data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate detailed cycle timing information
  const calculateCycleTimingData = () => {
    if (!cycleData.length) return null;

    const currentCycle = cycleData[cycleData.length - 1];
    const CYCLE_LENGTH = 2100; // blocks
    const PREPARE_PHASE_BLOCKS = 100;
    const EXTENSION_PHASE_BLOCKS = 200;
    const OPEN_PHASE_BLOCKS = CYCLE_LENGTH - PREPARE_PHASE_BLOCKS - EXTENSION_PHASE_BLOCKS;

    // Mock current position (would be real-time in production)
    const currentBlockInCycle = Math.floor(Math.random() * CYCLE_LENGTH);
    
    const phases = [
      {
        name: "Fast Pool Open",
        startBlock: 0,
        endBlock: OPEN_PHASE_BLOCKS - 1,
        duration: OPEN_PHASE_BLOCKS,
        color: "#22c55e",
        lightColor: "#d1fae5",
        description: "Pool is open for new members to join",
        status: currentBlockInCycle < OPEN_PHASE_BLOCKS ? "active" : "completed"
      },
      {
        name: "Fast Pool Extending", 
        startBlock: OPEN_PHASE_BLOCKS,
        endBlock: OPEN_PHASE_BLOCKS + EXTENSION_PHASE_BLOCKS - 1,
        duration: EXTENSION_PHASE_BLOCKS,
        color: "#eab308",
        lightColor: "#fef3c7",
        description: "Pool may extend based on participation",
        status: currentBlockInCycle >= OPEN_PHASE_BLOCKS && currentBlockInCycle < OPEN_PHASE_BLOCKS + EXTENSION_PHASE_BLOCKS ? "active" : 
               currentBlockInCycle < OPEN_PHASE_BLOCKS ? "upcoming" : "completed"
      },
      {
        name: "Prepare Phase",
        startBlock: OPEN_PHASE_BLOCKS + EXTENSION_PHASE_BLOCKS,
        endBlock: CYCLE_LENGTH - 1,
        duration: PREPARE_PHASE_BLOCKS,
        color: "#ea580c",
        lightColor: "#fed7aa", 
        description: "Final preparations for stacking cycle",
        status: currentBlockInCycle >= OPEN_PHASE_BLOCKS + EXTENSION_PHASE_BLOCKS ? "active" : "upcoming"
      }
    ];

    const currentPhase = phases.find(phase => 
      currentBlockInCycle >= phase.startBlock && currentBlockInCycle <= phase.endBlock
    );

    const progressInCurrentPhase = currentPhase ? 
      ((currentBlockInCycle - currentPhase.startBlock) / currentPhase.duration) * 100 : 0;

    const overallProgress = (currentBlockInCycle / CYCLE_LENGTH) * 100;

    return {
      currentCycle,
      phases,
      currentPhase,
      currentBlockInCycle,
      cycleLength: CYCLE_LENGTH,
      progressInCurrentPhase,
      overallProgress,
      blocksRemaining: CYCLE_LENGTH - currentBlockInCycle
    };
  };

  const timingData = calculateCycleTimingData();

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

  if (!timingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-400 mb-4">No Data Available</h1>
            <p className="text-gray-300">Unable to load cycle timing information.</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300">{data.duration} blocks</p>
          <p className="text-gray-400 text-sm">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Cycle Timing
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Detailed breakdown of Fast Pool cycle phases and timing
          </p>
        </div>

        {/* Current Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Current Cycle</CardTitle>
              <Calendar className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">#{timingData.currentCycle.cycle}</div>
              <p className="text-xs text-purple-300 mt-1">Block {timingData.currentBlockInCycle} of {timingData.cycleLength}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Current Phase</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400 mb-1">{timingData.currentPhase?.name}</div>
              <Progress value={timingData.progressInCurrentPhase} className="h-2 mb-2" />
              <p className="text-xs text-blue-300">{timingData.progressInCurrentPhase.toFixed(1)}% complete</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Blocks Remaining</CardTitle>
              <Timer className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{timingData.blocksRemaining}</div>
              <p className="text-xs text-green-300 mt-1">≈ {Math.ceil(timingData.blocksRemaining / 144)} days</p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Cycle Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={timingData.overallProgress} className="h-4" />
              <div className="text-center text-gray-300">
                {timingData.overallProgress.toFixed(1)}% Complete
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phase Timeline */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Phase Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timingData.phases.map((phase, index) => (
                  <div key={phase.name} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Badge 
                        variant={phase.status === 'active' ? 'default' : 
                               phase.status === 'completed' ? 'secondary' : 'outline'}
                        className={`${
                          phase.status === 'active' ? 'bg-green-600 hover:bg-green-700' :
                          phase.status === 'completed' ? 'bg-gray-600' : 'border-gray-500'
                        }`}
                      >
                        {phase.status === 'active' && <Activity className="h-3 w-3 mr-1" />}
                        {phase.status === 'completed' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {phase.status === 'upcoming' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {phase.status}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{phase.name}</div>
                      <div className="text-sm text-gray-400">{phase.description}</div>
                      <div className="text-xs text-gray-500">
                        Blocks {phase.startBlock}-{phase.endBlock} • {phase.duration} blocks
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Phase Distribution Chart */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Phase Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timingData.phases}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="duration"
                    >
                      {timingData.phases.map((phase, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={phase.status === 'active' ? phase.color : phase.lightColor}
                          stroke={phase.status === 'active' ? phase.color : "transparent"}
                          strokeWidth={phase.status === 'active' ? 3 : 0}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ color: '#9ca3af' }}
                      formatter={(value: string, entry: any) => (
                        <span style={{ color: entry.payload.color }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Block Timeline Visualization */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Block Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timingData.phases} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="duration" 
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default When;