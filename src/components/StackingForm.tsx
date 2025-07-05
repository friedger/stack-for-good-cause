
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Project } from "@/services/projectService";
import RewardTypeSelector from "./stacking/RewardTypeSelector";
import StackingAmountInput from "./stacking/StackingAmountInput";
import DonationSettings from "./stacking/DonationSettings";
import StackingActions from "./stacking/StackingActions";
import { useStackingLogic } from "@/hooks/useStackingLogic";
import { useProjectInitialization } from "@/hooks/useProjectInitialization";

interface StackingFormProps {
  stxAmount: string;
  setStxAmount: (value: string) => void;
  rewardType: string;
  setRewardType: (value: string) => void;
  enableDonation: boolean;
  setEnableDonation: (value: boolean) => void;
  donationPercentage: number[];
  setDonationPercentage: (value: number[]) => void;
  selectedProjects: Project[];
  setSelectedProjects: (value: Project[]) => void;
  sharePublicly: boolean;
  setSharePublicly: (value: boolean) => void;
}

const StackingForm = ({
  stxAmount,
  setStxAmount,
  rewardType,
  setRewardType,
  enableDonation,
  setEnableDonation,
  donationPercentage,
  setDonationPercentage,
  selectedProjects,
  setSelectedProjects,
  sharePublicly,
  setSharePublicly
}: StackingFormProps) => {
  const {
    isProcessingTx,
    isStacking,
    handleStacking,
    handleStopStacking,
    getStatusMessage,
  } = useStackingLogic();

  // Initialize projects from cart
  useProjectInitialization(setSelectedProjects, enableDonation, setEnableDonation);

  const onStartStacking = () => {
    handleStacking(
      stxAmount,
      rewardType,
      enableDonation,
      donationPercentage,
      selectedProjects,
      sharePublicly
    );
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-400" />
            Configure Your Stack
          </div>
          <div className="text-sm font-normal text-gray-300">
            {getStatusMessage()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <StackingAmountInput
          value={stxAmount}
          onChange={setStxAmount}
          disabled={isStacking}
        />

        <RewardTypeSelector value={rewardType} onChange={setRewardType} disabled={isStacking} />

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

        <StackingActions
          isStacking={isStacking}
          isProcessing={isProcessingTx}
          onStartStacking={onStartStacking}
          onStopStacking={handleStopStacking}
        />
      </CardContent>
    </Card>
  );
};

export default StackingForm;
