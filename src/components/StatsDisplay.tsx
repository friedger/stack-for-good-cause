
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stackingStatsService, type StackingStats } from "@/services/stackingStatsService";

interface StatsDisplayProps {
  rewardType: string;
}

const StatsDisplay = ({ rewardType }: StatsDisplayProps) => {
  const [stackingStats, setStackingStats] = useState<StackingStats>({
    currentlyStacked: 0,
    totalEarned: 0,
    totalDonated: 0,
    activeStacks: 0,
    supportedProjects: 0,
    apr: 8.5
  });

  useEffect(() => {
    const updateStats = () => {
      setStackingStats(stackingStatsService.getCurrentStats());
    };

    updateStats();
    // Update stats every 5 seconds to reflect changes
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Your Fast Pool Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{stackingStats.currentlyStacked} STX</div>
            <div className="text-gray-300">Currently Stacked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stackingStats.totalEarned.toFixed(2)} {rewardType.toUpperCase()}</div>
            <div className="text-gray-300">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">{stackingStats.totalDonated.toFixed(2)} {rewardType.toUpperCase()}</div>
            <div className="text-gray-300">Total Donated</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDisplay;
