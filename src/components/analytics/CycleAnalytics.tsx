import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CycleData, analyticsService } from "@/services/analyticsService";
import { TrendingUp, TrendingDown, Users, DollarSign, Table, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CycleAnalyticsProps {
  cycles: CycleData[];
}

const CycleAnalytics = ({ cycles }: CycleAnalyticsProps) => {
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('graph');
  const latestCycles = cycles.slice(-10);
  latestCycles.reverse();
  const currentCycle = cycles[cycles.length - 1];

  // Prepare data for graphs (last 10 cycles in chronological order)
  const graphData = cycles.slice(-10).map(cycle => ({
    cycle: cycle.cycle,
    stackedInPool: cycle.stackedInPool / 1000000, // Convert to millions
    payout: cycle.payout / 1000000, // Convert to millions  
    activeMembers: cycle.activeMembers,
    payoutRate: cycle.stackedInPool > 0 ? (cycle.payout / cycle.stackedInPool) * 100 : 0 // Payout rate as percentage
  }));

  const formatXAxisLabel = (tickItem: any) => `#${tickItem}`;
  const formatTooltipValue = (value: any, name: string) => {
    if (name === 'stackedInPool') return [`${value.toFixed(2)}M STX`, 'Stacked in Pool'];
    if (name === 'payout') return [`${value.toFixed(2)}M STX`, 'Payout'];
    if (name === 'activeMembers') return [`${value}`, 'Active Members'];
    if (name === 'payoutRate') return [`${value.toFixed(2)}%`, 'Payout Rate'];
    return [value, name];
  };

  const TableView = () => (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Cycles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 pb-3">Cycle</th>
                <th className="text-right text-gray-300 pb-3">Stacked in Pool</th>
                <th className="text-right text-gray-300 pb-3 hidden sm:table-cell">Payout</th>
                <th className="text-right text-gray-300 pb-3 hidden md:table-cell">Active Members</th>
              </tr>
            </thead>
            <tbody>
              {latestCycles.map((cycle, index) => (
                <tr key={cycle.cycle} className={`border-b border-gray-700/50 ${index === 0 ? 'bg-blue-600/10' : ''}`}>
                  <td className="py-4 text-white font-medium">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2 sm:mb-0">
                        <span className="text-base">#{cycle.cycle}</span>
                        {index === 0 && <Badge variant="secondary" className="bg-blue-600 text-white text-xs">Current</Badge>}
                      </div>
                      {/* Mobile-only info */}
                      <div className="sm:hidden space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Stacked:</span>
                          <span className="text-gray-300">{analyticsService.formatSTX(cycle.stackedInPool / 1000000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payout:</span>
                          <span className="text-gray-300">{index === 0 ? `~${analyticsService.formatSTX(cycle.payout / 1000000)}` : analyticsService.formatSTX(cycle.payout / 1000000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Members:</span>
                          <span className="text-gray-300">{analyticsService.formatNumber(cycle.activeMembers)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right text-gray-300 py-4">
                    {analyticsService.formatSTX(cycle.stackedInPool / 1000000)}
                  </td>
                  <td className="text-right text-blue-400 font-medium hidden sm:table-cell py-4">
                    {index === 0 ? `~${analyticsService.formatSTX(cycle.payout / 1000000)}` : analyticsService.formatSTX(cycle.payout / 1000000)}
                  </td>
                  <td className="text-right text-gray-300 hidden md:table-cell py-4">
                    {analyticsService.formatNumber(cycle.activeMembers)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const GraphView = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Stacked in Pool Graph */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Stacked in Pool</CardTitle>
          <p className="text-sm text-gray-400">Last 10 Cycles</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="cycle" 
                  stroke="#9CA3AF"
                  tickFormatter={formatXAxisLabel}
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `${value}M`}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={(label) => `Cycle #${label}`}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="stackedInPool" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Graph */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Payouts</CardTitle>
          <p className="text-sm text-gray-400">Last 10 Cycles</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="cycle" 
                  stroke="#9CA3AF"
                  tickFormatter={formatXAxisLabel}
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `${value}M`}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={(label) => `Cycle #${label}`}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="payout" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Members Graph */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Active Members</CardTitle>
          <p className="text-sm text-gray-400">Last 10 Cycles</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="cycle" 
                  stroke="#9CA3AF"
                  tickFormatter={formatXAxisLabel}
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={(label) => `Cycle #${label}`}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="activeMembers" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payout Rate Graph */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Payout Rate</CardTitle>
          <p className="text-sm text-gray-400">Payout / Stacked Pool (%)</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="cycle" 
                  stroke="#9CA3AF"
                  tickFormatter={formatXAxisLabel}
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `${value}%`}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={(label) => `Cycle #${label}`}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="payoutRate" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* BTC Rewards Card - Keep this one */}
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

      {/* View Toggle */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Cycle Analytics</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="text-sm"
            >
              <Table className="h-4 w-4 mr-2" />
              Table View
            </Button>
            <Button
              variant={viewMode === 'graph' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('graph')}
              className="text-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Graph View
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Conditional Rendering */}
      {viewMode === 'table' ? <TableView /> : <GraphView />}
    </div>
  );
};

export default CycleAnalytics;