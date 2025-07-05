
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectInitialization } from "@/hooks/useProjectInitialization";
import { useStackingLogic } from "@/hooks/useStackingLogic";
import { Project } from "@/services/projectCore";
import { TrendingUp } from "lucide-react";
import DonationSettings from "./stacking/DonationSettings";

interface RewardsBreakdownProps {
  stxAmount: string;
  rewardType: string;
  sharePublicly: boolean;
  setSharePublicly: (value: boolean) => void;
  enableDonation: boolean;
  setEnableDonation: (value: boolean) => void;
  donationPercentage: number[];
  setDonationPercentage: (value: number[]) => void;
  selectedProjects: Project[];
  setSelectedProjects: (value: Project[]) => void;
}

const RewardsBreakdown = ({
  stxAmount,
  rewardType,
  sharePublicly,
  setSharePublicly,
  enableDonation,
  setEnableDonation,
  donationPercentage,
  setDonationPercentage,
  selectedProjects,
  setSelectedProjects,
}: RewardsBreakdownProps) => {
  const estimatedYield = stxAmount ? (parseFloat(stxAmount) * 0.085).toFixed(2) : "0";
  const donationAmount = enableDonation && estimatedYield ? ((parseFloat(estimatedYield) * donationPercentage[0]) / 100).toFixed(4) : "0";
  const yourEarnings = estimatedYield ? (parseFloat(estimatedYield) - parseFloat(donationAmount)).toFixed(4) : "0";

  const { isStacking } = useStackingLogic();
  // Initialize projects from cart
  useProjectInitialization(setSelectedProjects, enableDonation, setEnableDonation);

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-orange-400" />
          Your Rewards Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        <DonationSettings
          enableDonation={enableDonation}
          onEnableDonationChange={setEnableDonation}
          donationPercentage={donationPercentage}
          onDonationPercentageChange={setDonationPercentage}
          selectedProjects={selectedProjects}
          onSelectedProjectsChange={setSelectedProjects}
          sharePublicly={sharePublicly}
          onSharePubliclyChange={setSharePublicly}
          disabled={isStacking}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <span className="text-gray-300">Estimated Annual Yield</span>
            <span className="text-white font-semibold">{estimatedYield} {rewardType.toUpperCase()}</span>
          </div>

          {enableDonation && (
            <div className="flex justify-between items-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <span className="text-gray-300">Donation Amount ({donationPercentage[0]}%)</span>
              <span className="text-blue-400 font-semibold">{donationAmount} {rewardType.toUpperCase()}</span>
            </div>
          )}

          <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <span className="text-gray-300">Your Net Earnings</span>
            <span className="text-green-400 font-semibold">{yourEarnings} {rewardType.toUpperCase()}</span>
          </div>
        </div>

        {/* {enableDonation && sharePublicly && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center">
                <Share2 className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-400 text-sm font-medium">Public Impact Sharing Enabled</span>
              </div>
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default RewardsBreakdown;
