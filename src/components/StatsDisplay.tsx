
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsDisplayProps {
  rewardType: string;
}

const StatsDisplay = ({ rewardType }: StatsDisplayProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Your Fast Pool Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">0 STX</div>
            <div className="text-gray-300">Currently Stacked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">0 {rewardType.toUpperCase()}</div>
            <div className="text-gray-300">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">0 {rewardType.toUpperCase()}</div>
            <div className="text-gray-300">Total Donated</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDisplay;
