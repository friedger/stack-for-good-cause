
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsService, CycleData, RewardData, UserData } from "@/services/analyticsService";
import CycleAnalytics from "@/components/analytics/CycleAnalytics";
import RewardAnalytics from "@/components/analytics/RewardAnalytics";
import { BarChart3, TrendingUp, Users, Award, Coins, Lock, Percent } from "lucide-react";

const Analytics = () => {
  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [rewardsData, setRewardsData] = useState<RewardData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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

        // Fetch reward data
        const rewards = await analyticsService.fetchRewardData();
        setRewardsData(rewards);
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
    const totalDistributedStx = cycleData.reduce((total, cycle) => {
      // Convert fastPoolV1 and fastPoolV2 BTC to STX equivalent
      // Using a rough conversion rate based on recent cycles
      const stxFromBTC = (cycle.fastPoolV1 + cycle.fastPoolV2) * cycle.btcPriceAtEnd / cycle.stxPriceAtEnd;
      console.log(`Cycle ${cycle.cycle}: BTC to STX conversion = ${stxFromBTC}`);
      console.log(cycle.btcPriceAtEnd, cycle.stxPriceAtEnd);
      return total + stxFromBTC;
    }, 0);
    const firstCycle = cycleData[0].cycle

    // Get current and previous cycle data
    const currentCycle = cycleData[cycleData.length - 1];
    const previousCycle = cycleData[cycleData.length - 2];
    const currentLockedSTX = currentCycle ? parseInt(currentCycle.totalStacked) : 0;
    const lastCycleAPY = previousCycle ? previousCycle.apy * 100 : 0;
    const currentCycleAPY = currentCycle ? currentCycle.apy * 100 : 0;

    // Get member data
    const activeMembers = userData.activeUsers || userData.totalUsers;
    const totalMembers = userData.totalUsers;

    return {
      firstCycle,
      totalDistributedStx,
      activeMembers,
      totalMembers,
      currentLockedSTX,
      lastCycleAPY,
      currentCycleAPY,
      previousCycle,
      currentCycle
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
                {analyticsService.formatSTX(metrics.totalDistributedStx)}
              </div>
              <p className="text-xs text-blue-300 mt-1">Since cycle {metrics.firstCycle}</p>
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
                {analyticsService.formatNumber(Math.round(metrics.currentLockedSTX / 1000000))}M
              </div>
              <p className="text-xs text-purple-300 mt-1">STX currently stacked</p>
            </CardContent>
          </Card>

          {/* Current Estimated APY */}
          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-200">Current APY</CardTitle>
              <Percent className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {metrics.lastCycleAPY.toFixed(2)}%
              </div>
              <p className="text-xs text-yellow-300 mt-1">
                Cycle #{metrics.previousCycle?.cycle} • Est. #{metrics.currentCycle?.cycle}: {metrics.currentCycleAPY.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
            >
              Cycle Overview
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
            >
              Rewards Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CycleAnalytics cycles={cycleData} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <RewardAnalytics rewardsData={rewardsData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
