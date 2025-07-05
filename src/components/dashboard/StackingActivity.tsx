
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { StackingData } from "@/services/stackingService";

interface StackingActivityProps {
  stackingHistory: StackingData[];
}

const StackingActivity = ({ stackingHistory }: StackingActivityProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-orange-400" />
          Your Stacking Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stackingHistory.map((stack) => (
          <div key={stack.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-white font-semibold">{stack.amount} STX</h4>
                <p className="text-gray-400 text-sm">Supporting {stack.project}</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {stack.status}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Donation %:</span>
                <span className="text-pink-400">{stack.donationPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Earned:</span>
                <span className="text-green-400">{stack.earned.toFixed(2)} STX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Donated:</span>
                <span className="text-pink-400">{stack.donated.toFixed(2)} STX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Started:</span>
                <span className="text-gray-300">{stack.startDate}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Donation Progress</span>
                <span>{stack.donationPercentage}%</span>
              </div>
              <Progress value={stack.donationPercentage} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StackingActivity;
