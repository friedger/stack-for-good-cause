
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectInitialization } from "@/hooks/useProjectInitialization";
import { useStackingLogic } from "@/hooks/useStackingLogic";
import { Project } from "@/lib/projectCore";
import { Heart, TrendingUp } from "lucide-react";
import DonationSettings from "./stacking/DonationSettings";
import { configService } from "@/services/configService";

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
  const { isStacking } = useStackingLogic();
  // Initialize projects from cart
  useProjectInitialization(setSelectedProjects, enableDonation, setEnableDonation);

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Heart className="h-6 w-6 mr-2 text-orange-400" />
          {configService.getMultiProjectsAllowed() ? "Configure Your Contributions" : "Your Contribution"}
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
          disabled={isStacking}
          stxAmount={stxAmount}
          rewardType={rewardType}
        />
      </CardContent>
    </Card>
  );
};

export default RewardsBreakdown;
