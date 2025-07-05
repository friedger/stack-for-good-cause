
import { Card, CardContent } from "@/components/ui/card";
import { UserStats } from "@/services/stackingService";

interface ImpactSummaryProps {
  userStats: UserStats;
}

const ImpactSummary = ({ userStats }: ImpactSummaryProps) => {
  return (
    <Card className="mt-8 bg-gradient-to-r from-pink-500/10 to-orange-500/10 border-pink-500/20 backdrop-blur-sm">
      <CardContent className="py-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Your Impact Summary</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">8.5%</div>
            <div className="text-gray-300">Average APY Earned</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-400 mb-2">30%</div>
            <div className="text-gray-300">Of Earnings Donated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-400 mb-2">{userStats.supportedProjects}</div>
            <div className="text-gray-300">Projects Supported</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactSummary;
