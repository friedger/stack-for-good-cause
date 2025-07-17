
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsService, CycleData, Metadata, UserData } from "@/services/analyticsService";
import CycleAnalytics from "@/components/analytics/CycleAnalytics";
import { BarChart3, Coins, Lock, Percent, Users } from "lucide-react";

const Analytics = () => {
  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [metaData, setMetaData] = useState<Metadata>({ totalMembers: 0, totalCycles: 0 });
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch cycle data
        const cycles = await analyticsService.fetchCycleData();
        setCycleData(cycles);

        // Fetch user data
        const users = await analyticsService.fetchUserData();
        setUserData(users);

        // Fetch metadata
        const meta = await analyticsService.fetchMetadata();
        setMetaData(meta || { totalMembers: 0, totalCycles: 0 });

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics for the top cards
  const calculateMetrics = () => {
    if (!cycleData.length || !userData) {
      return {
        totalDistributedSinceCycle3: 0,
        activeMembers: 0,
        totalMembers: 0,
        currentLockedSTX: 0,
        currentAPY: 0
      };
    }

    // Calculate total STX distributed
    const totalPayoutUpto85 = 4962796229626;
    const totalDistributedStx = cycleData.reduce((total, cycle) => {
      // Convert fastPoolV1 and fastPoolV2 BTC to STX equivalent
      // Using a rough conversion rate based on recent cycles
      // const stxFromBTC = (cycle.fastPoolV1 + cycle.fastPoolV2) * cycle.btcPriceAtEnd / cycle.stxPriceAtEnd;
      // console.log(`Cycle ${cycle.cycle}: BTC to STX conversion = ${stxFromBTC}`);
      // console.log(cycle.btcPriceAtEnd, cycle.stxPriceAtEnd);
      // return total + stxFromBTC;
      console.log(`Cycle ${cycle.cycle}: Payout = ${cycle.payout}`);
      return total + (cycle.payout || 0);
    }, totalPayoutUpto85);
    const firstCycle = 3;

    // Get current cycle data
    const currentCycle = cycleData[cycleData.length - 1];
    const currentLockedSTX = currentCycle ? BigInt(currentCycle.totalStacked) : 0n;
    const currentAPY = (cycleData.slice(-27, -1).reduce((sum, cycle) => sum * (1 + (cycle.payout / cycle.stackedInPool)), 1)
      - 1) * 100
    // Get member data
    const activeMembers = currentCycle ? currentCycle.activeMembers : 0;
    const totalMembers = metaData.totalMembers;

    return {
      firstCycle,
      totalDistributedStx,
      activeMembers,
      totalMembers,
      currentLockedSTX,
      currentAPY,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-gray-700" />
            <Skeleton className="h-4 w-96 bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Skeleton className="h-4 w-24 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metrics = calculateMetrics();
  const currentCycle = cycleData[cycleData.length - 1];
  const previousCycle = cycleData[cycleData.length - 2];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FastPool Analytics
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Comprehensive insights into stacking performance, rewards distribution, and pool metrics
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* STX Distributed Since Cycle 3 */}
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">STX Distributed</CardTitle>
              <Coins className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {analyticsService.formatNumber(metrics.totalDistributedStx / 1e12)}M
              </div>
              <p className="text-xs text-blue-300 mt-1">since Feb 2021 (cycle #{metrics.firstCycle})</p>
            </CardContent>
          </Card>

          {/* Active Members */}
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Active Members</CardTitle>
              <Users className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {analyticsService.formatNumber(metrics.activeMembers)}
              </div>
              <p className="text-xs text-green-300 mt-1">
                of {analyticsService.formatNumber(metrics.totalMembers)} total
              </p>
            </CardContent>
          </Card>

          {/* Currently Locked STX */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Locked</CardTitle>
              <Lock className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {analyticsService.formatNumber(Math.round(currentCycle.stackedInPool / 1e10) / 100)}M
              </div>
              <p className="text-xs text-purple-300 mt-1">STX currently stacked in #{currentCycle.cycle}</p>
            </CardContent>
          </Card>

          {/* Current Estimated APY */}
          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-200">APY</CardTitle>
              <Percent className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {metrics.currentAPY.toFixed(2)}%
              </div>
              <p className="text-xs text-yellow-300 mt-1">
                Compound over last 26 cycles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <CycleAnalytics cycles={cycleData} />
      </div>
    </div>
  );
};

export default Analytics;
