
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stackingService, type UserStats } from "@/services/stackingService";

interface StatsDisplayProps {
  rewardType: string;
}

const StatsDisplay = ({ rewardType }: StatsDisplayProps) => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalStacked: 0,
    totalEarned: 0,
    totalDonated: 0,
    activeStacks: 0,
    supportedProjects: 0
  });

  useEffect(() => {
    setUserStats(stackingService.getUserStats());
  }, []);

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Your Fast Pool Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{userStats.totalStacked} STX</div>
            <div className="text-gray-300">Currently Stacked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{userStats.totalEarned.toFixed(2)} {rewardType.toUpperCase()}</div>
            <div className="text-gray-300">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">{userStats.totalDonated.toFixed(2)} {rewardType.toUpperCase()}</div>
            <div className="text-gray-300">Total Donated</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDisplay;
