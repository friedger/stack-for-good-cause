import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsService, CycleData, RewardData, UserData } from "@/services/analyticsService";
import CycleAnalytics from "@/components/analytics/CycleAnalytics";
import RewardAnalytics from "@/components/analytics/RewardAnalytics";
import { BarChart3, TrendingUp, Users, Award } from "lucide-react";

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

  const totalDistributed = 9934023; // From the cycles page
  const currentCycle = cycleData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold">FastPool Analytics</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Comprehensive insights into stacking performance, rewards distribution, and pool metrics
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Distributed</CardTitle>
              <Award className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {analyticsService.formatSTX(totalDistributed)}
              </div>
              <p className="text-xs text-gray-400">All-time rewards</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Current Cycle</CardTitle>
              <Badge variant="secondary" className="bg-blue-600 text-white">
                #{currentCycle?.cycle}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {currentCycle ? analyticsService.formatNumber(parseInt(currentCycle.totalStacked) / 1000000) + 'M STX' : '-'}
              </div>
              <p className="text-xs text-gray-400">Total stacked</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Stackers</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {userData ? analyticsService.formatNumber(userData.totalUsers) : '-'}
              </div>
              <p className="text-xs text-gray-400">Current participants</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Recent Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                8.5%
              </div>
              <p className="text-xs text-gray-400">Latest cycle yield</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Cycle Overview
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
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