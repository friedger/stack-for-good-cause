import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CycleData, analyticsService } from "@/services/analyticsService";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";

interface CycleAnalyticsProps {
  cycles: CycleData[];
}

const CycleAnalytics = ({ cycles }: CycleAnalyticsProps) => {
  const latestCycles = cycles.slice(-10);
  latestCycles.reverse();
  const currentCycle = cycles[cycles.length - 1];
  const previousCycle = cycles[cycles.length - 2];

  const getStackedSTXsTrend = () => {
    if (!currentCycle || !previousCycle) return null;
    const currentStacked = parseFloat(currentCycle.totalStacked);
    const previousStacked = parseFloat(previousCycle.totalStacked);
    const change = currentStacked - previousStacked;
    const isPositive = change > 0;
    return {
      change: Math.abs(change),
      isPositive,
      percentage: ((Math.abs(change) / previousStacked) * 100).toFixed(2)
    };
  };

  const getAPYTrend = () => {
    if (!currentCycle || !previousCycle) return null;
    const change = currentCycle.apy - previousCycle.apy;
    const isPositive = change > 0;
    return {
      change: Math.abs(change),
      isPositive,
      percentage: ((Math.abs(change) / previousCycle.apy) * 100).toFixed(2)
    };
  };

  const stackedTrend = getStackedSTXsTrend();
  const apyTrend = getAPYTrend();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Current Cycle</CardTitle>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              #{currentCycle?.cycle}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {currentCycle ? analyticsService.formatNumber(parseInt(currentCycle.totalStacked) / 1000000) + 'M' : '-'}
            </div>
            <p className="text-xs text-gray-400">STX Stacked</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Current APY</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {currentCycle ? analyticsService.formatPercentage(currentCycle.apy * 100) : '-'}
            </div>
            {apyTrend && (
              <p className={`text-xs flex items-center ${apyTrend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {apyTrend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {(apyTrend.change * 100).toFixed(2)}% ({apyTrend.percentage}%)
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">BTC Rewards</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {currentCycle ? analyticsService.formatBTC(currentCycle.btcRewards) : '-'}
            </div>
            <p className="text-xs text-gray-400">
              ${currentCycle ? analyticsService.formatNumber(currentCycle.rewardsUsd) : '-'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Stacked Value</CardTitle>
            {stackedTrend?.isPositive ? <TrendingUp className="h-4 w-4 text-green-400" /> : <TrendingDown className="h-4 w-4 text-red-400" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${currentCycle ? analyticsService.formatNumber(currentCycle.stackedUsd / 1000000) + 'M' : '-'}
            </div>
            <p className="text-xs text-gray-400">
              {stackedTrend ? `${stackedTrend.percentage}% change` : 'Total USD value'}
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
                  <th className="text-right text-gray-300 pb-2">BTC Rewards</th>
                  <th className="text-right text-gray-300 pb-2">APY</th>
                  <th className="text-right text-gray-300 pb-2">Yield</th>
                </tr>
              </thead>
              <tbody>
                {latestCycles.map((cycle, index) => (
                  <tr key={cycle.cycle} className={`border-b border-gray-700/50 ${index === 0 ? 'bg-blue-600/10' : ''}`}>
                    <td className="py-2 text-white font-medium">
                      #{cycle.cycle}
                      {index === 0 && <Badge variant="secondary" className="ml-2 bg-blue-600 text-white text-xs">Current</Badge>}
                    </td>
                    <td className="text-right text-gray-300">
                      {analyticsService.formatNumber(parseInt(cycle.totalStacked) / 1000000)}M
                    </td>
                    <td className="text-right text-gray-300">
                      {analyticsService.formatBTC(cycle.btcRewards)}
                    </td>
                    <td className="text-right text-gray-300">
                      {analyticsService.formatPercentage(cycle.apy * 100)}
                    </td>
                    <td className="text-right text-gray-300">
                      {analyticsService.formatPercentage(cycle.cycleYield * 100)}
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