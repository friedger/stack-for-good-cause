import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RewardData, analyticsService } from "@/services/analyticsService";
import { Bitcoin, DollarSign, Users, TrendingUp } from "lucide-react";

interface RewardAnalyticsProps {
  rewardsData: RewardData[];
}

const RewardAnalytics = ({ rewardsData }: RewardAnalyticsProps) => {
  const latestReward = rewardsData[0];
  const totalRewards = rewardsData.reduce((sum, reward) => sum + (reward.stxDistributed || 0), 0);
  const averageRate = rewardsData.length > 0 ? rewardsData.reduce((sum, reward) => sum + (reward.yieldRate || 0), 0) / rewardsData.length : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Rewards Distributed</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analyticsService.formatSTX(totalRewards)}
            </div>
            <p className="text-xs text-gray-400">Across {rewardsData.length} cycles</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average Yield</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {analyticsService.formatPercentage(averageRate)}
            </div>
            <p className="text-xs text-gray-400">Per cycle average</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Latest BTC Received</CardTitle>
            <Bitcoin className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {latestReward ? analyticsService.formatBTC(latestReward.btcReceived) : '-'}
            </div>
            <p className="text-xs text-gray-400">
              {latestReward ? `Cycle #${latestReward.cycleNumber}` : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pool Members</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {latestReward ? analyticsService.formatNumber(latestReward.participants) : '-'}
            </div>
            <p className="text-xs text-gray-400">Latest cycle participants</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Rewards Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Reward Distribution Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-300 pb-3">Cycle</th>
                  <th className="text-right text-gray-300 pb-3">BTC Received</th>
                  <th className="text-right text-gray-300 pb-3 hidden sm:table-cell">STX Distributed</th>
                  <th className="text-right text-gray-300 pb-3 hidden md:table-cell">Pool Members</th>
                  <th className="text-right text-gray-300 pb-3">Yield Rate</th>
                </tr>
              </thead>
              <tbody>
                 {rewardsData.map((reward, index) => (
                   <tr key={reward.cycleNumber} className={`border-b border-gray-700/50 ${index === 0 ? 'bg-blue-600/10' : ''}`}>
                     <td className="py-4 text-white font-medium">
                       <div className="flex flex-col">
                         <div className="flex items-center gap-2 mb-2 sm:mb-0">
                           <span className="text-base">#{reward.cycleNumber}</span>
                           {index === 0 && <Badge variant="secondary" className="bg-blue-600 text-white text-xs">Latest</Badge>}
                         </div>
                         {/* Mobile-only info */}
                         <div className="sm:hidden space-y-1 text-sm">
                           <div className="flex justify-between">
                             <span className="text-gray-400">BTC Received:</span>
                             <span className="text-orange-400 font-mono">{analyticsService.formatBTC(reward.btcReceived)}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-400">STX Distributed:</span>
                             <span className="text-gray-300">{analyticsService.formatSTX(reward.stxDistributed)}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-400">Members:</span>
                             <span className="text-gray-300">{analyticsService.formatNumber(reward.participants)}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-400">Yield Rate:</span>
                             <span className="text-green-400 font-medium">{analyticsService.formatPercentage(reward.yieldRate || 0)}</span>
                           </div>
                         </div>
                       </div>
                     </td>
                     <td className="text-right text-orange-400 font-mono hidden sm:table-cell py-4">
                       {analyticsService.formatBTC(reward.btcReceived)}
                     </td>
                     <td className="text-right text-gray-300 hidden sm:table-cell py-4">
                       {analyticsService.formatSTX(reward.stxDistributed)}
                     </td>
                     <td className="text-right text-gray-300 hidden md:table-cell py-4">
                       {analyticsService.formatNumber(reward.participants)}
                     </td>
                     <td className="text-right text-green-400 font-medium hidden sm:table-cell py-4">
                       {analyticsService.formatPercentage(reward.yieldRate || 0)}
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Latest Reward Details */}
      {latestReward && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              Cycle #{latestReward.cycleNumber} Detailed Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Rewards Received</h4>
                <div className="text-lg font-semibold text-orange-400">
                  {analyticsService.formatBTC(latestReward.btcReceived)}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Total STX Distributed</h4>
                <div className="text-lg font-semibold text-blue-400">
                  {analyticsService.formatSTX(latestReward.stxDistributed)}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Pool Participants</h4>
                <div className="text-lg font-semibold text-gray-300">
                  {analyticsService.formatNumber(latestReward.participants)} members
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Effective Yield</h4>
                <div className="text-lg font-semibold text-green-400">
                  {analyticsService.formatPercentage(latestReward.yieldRate || 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RewardAnalytics;