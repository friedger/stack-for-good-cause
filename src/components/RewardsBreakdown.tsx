
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Bitcoin, Share2 } from "lucide-react";

interface RewardsBreakdownProps {
  stxAmount: string;
  rewardType: string;
  enableDonation: boolean;
  donationPercentage: number[];
  sharePublicly: boolean;
}

const RewardsBreakdown = ({
  stxAmount,
  rewardType,
  enableDonation,
  donationPercentage,
  sharePublicly
}: RewardsBreakdownProps) => {
  const estimatedYield = stxAmount ? (parseFloat(stxAmount) * 0.085).toFixed(2) : "0";
  const donationAmount = enableDonation && estimatedYield ? ((parseFloat(estimatedYield) * donationPercentage[0]) / 100).toFixed(4) : "0";
  const yourEarnings = estimatedYield ? (parseFloat(estimatedYield) - parseFloat(donationAmount)).toFixed(4) : "0";

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          {rewardType === "sbtc" ? <Bitcoin className="h-6 w-6 mr-2 text-orange-400" /> : <TrendingUp className="h-6 w-6 mr-2 text-orange-400" />}
          Your Rewards Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <span className="text-gray-300">Estimated Annual Yield</span>
            <span className="text-white font-semibold">{estimatedYield} {rewardType.toUpperCase()}</span>
          </div>
          
          {enableDonation && (
            <div className="flex justify-between items-center p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <span className="text-gray-300">Donation Amount ({donationPercentage[0]}%)</span>
              <span className="text-pink-400 font-semibold">{donationAmount} {rewardType.toUpperCase()}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <span className="text-gray-300">Your Net Earnings</span>
            <span className="text-green-400 font-semibold">{yourEarnings} {rewardType.toUpperCase()}</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h4 className="text-white font-semibold mb-2">Fast Pool Benefits</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
              No lock-up period
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
              Daily reward distribution
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
              Choose STX or sBTC rewards
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
              Optional social impact
            </li>
          </ul>
        </div>

        {enableDonation && sharePublicly && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center">
                <Share2 className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-400 text-sm font-medium">Public Impact Sharing Enabled</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RewardsBreakdown;
