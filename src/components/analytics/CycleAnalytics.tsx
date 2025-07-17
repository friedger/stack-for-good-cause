import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CycleData, analyticsService } from "@/services/analyticsService";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";

interface CycleAnalyticsProps {
  cycles: CycleData[];
}

const CycleAnalytics = ({ cycles }: CycleAnalyticsProps) => {
  const latestCycles = cycles.slice(0, 10);
  const currentCycle = cycles[0];
  const previousCycle = cycles[1];

  const getStackedSTXsTrend = () => {
    if (!currentCycle || !previousCycle) return null;
    const change = currentCycle.totalStacked - previousCycle.totalStacked;
    const isPositive = change > 0;
    return {
      change: Math.abs(change),
      isPositive,
      percentage: ((Math.abs(change) / previousCycle.totalStacked) * 100).toFixed(2)
    };
  };

  const getStackersTrend = () => {
    if (!currentCycle || !previousCycle) return null;
    const change = currentCycle.activeStackers - previousCycle.activeStackers;
    const isPositive = change > 0;
    return {
      change: Math.abs(change),
      isPositive,
      percentage: ((Math.abs(change) / previousCycle.activeStackers) * 100).toFixed(2)
    };
  };

  const stackedTrend = getStackedSTXsTrend();
  const stackersTrend = getStackersTrend();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Current Cycle</CardTitle>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              #{currentCycle?.cycleNumber}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {currentCycle ? analyticsService.formatSTX(currentCycle.totalStacked) : '-'}
            </div>
            <p className="text-xs text-gray-400">Total Stacked</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Stackers</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {currentCycle ? analyticsService.formatNumber(currentCycle.activeStackers) : '-'}
            </div>
            {stackersTrend && (
              <p className={`text-xs flex items-center ${stackersTrend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {stackersTrend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {stackersTrend.change} ({stackersTrend.percentage}%)
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Latest Payout</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {previousCycle?.totalRewards ? analyticsService.formatSTX(previousCycle.totalRewards) : '-'}
            </div>
            <p className="text-xs text-gray-400">
              Cycle completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Growth Trend</CardTitle>
            {stackedTrend?.isPositive ? <TrendingUp className="h-4 w-4 text-green-400" /> : <TrendingDown className="h-4 w-4 text-red-400" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stackedTrend?.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {stackedTrend ? `${stackedTrend.isPositive ? '+' : '-'}${analyticsService.formatNumber(stackedTrend.change)}` : '-'}
            </div>
            <p className="text-xs text-gray-400">
              {stackedTrend ? `${stackedTrend.percentage}% change` : 'STX stacked change'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cycles Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-300 pb-2">Cycle</th>
                  <th className="text-right text-gray-300 pb-2">Stacked STX</th>
                  <th className="text-right text-gray-300 pb-2">Stackers</th>
                  <th className="text-right text-gray-300 pb-2">Payout</th>
                  <th className="text-right text-gray-300 pb-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                {latestCycles.map((cycle, index) => (
                  <tr key={cycle.cycleNumber} className={`border-b border-gray-700/50 ${index === 0 ? 'bg-blue-600/10' : ''}`}>
                    <td className="py-2 text-white font-medium">
                      #{cycle.cycleNumber}
                      {index === 0 && <Badge variant="secondary" className="ml-2 bg-blue-600 text-white text-xs">Current</Badge>}
                    </td>
                    <td className="text-right text-gray-300">
                      {analyticsService.formatNumber(cycle.totalStacked)}
                    </td>
                    <td className="text-right text-gray-300">
                      {analyticsService.formatNumber(cycle.activeStackers)}
                    </td>
                    <td className="text-right text-gray-300">
                      {cycle.totalRewards ? analyticsService.formatNumber(cycle.totalRewards) : '-'}
                    </td>
                    <td className="text-right text-gray-300">
                      -
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CycleAnalytics;