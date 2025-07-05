
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStackingLogic } from "@/hooks/useStackingLogic";
import { Project } from "@/services/projectService";
import { TrendingUp } from "lucide-react";
import RewardTypeSelector from "./stacking/RewardTypeSelector";
import StackingActions from "./stacking/StackingActions";
import StackingAmountInput from "./stacking/StackingAmountInput";

interface StackingFormProps {
  stxAmount: string;
  setStxAmount: (value: string) => void;
  rewardType: "stx" | "sbtc";
  setRewardType: (value: "stx" | "sbtc") => void;
  enableDonation: boolean;
  donationPercentage: number[];

  selectedProjects: Project[];
  sharePublicly: boolean;
}

const StackingForm = ({
  stxAmount,
  setStxAmount,
  rewardType,
  setRewardType,
  enableDonation,
  donationPercentage,
  selectedProjects,
  sharePublicly,
}: StackingFormProps) => {
  const {
    isProcessingTx,
    isStacking,
    handleStacking,
    handleStopStacking,
    getStatusMessage,
  } = useStackingLogic();

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
            Configure Your Stacking
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
