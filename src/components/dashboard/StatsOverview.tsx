
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, Heart } from "lucide-react";
import { UserStats } from "@/services/stackingService";

interface StatsOverviewProps {
  userStats: UserStats;
}

const StatsOverview = ({ userStats }: StatsOverviewProps) => {
  return (
    <div className="grid md:grid-cols-5 gap-6 mb-8">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center">
          <Wallet className="h-8 w-8 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{userStats.totalStacked}</div>
          <div className="text-gray-300 text-sm">STX Stacked</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{userStats.totalEarned.toFixed(2)}</div>
          <div className="text-gray-300 text-sm">STX Earned</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center">
          <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{userStats.totalDonated.toFixed(2)}</div>
          <div className="text-gray-300 text-sm">STX Donated</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-white">{userStats.activeStacks}</div>
          <div className="text-gray-300 text-sm">Active Stacks</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-white">{userStats.supportedProjects}</div>
          <div className="text-gray-300 text-sm">Projects Supported</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
