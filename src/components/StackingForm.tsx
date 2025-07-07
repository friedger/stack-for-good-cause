
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStackingLogic } from "@/hooks/useStackingLogic";
import { Project } from "@/services/projectService";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import RewardTypeSelector from "./stacking/RewardTypeSelector";
import StackingActions from "./stacking/StackingActions";
import StackingAmountInput from "./stacking/StackingAmountInput";
import StackingConditions from "./stacking/StackingConditions";
import UserDataVerificationModal from "./stacking/UserDataVerificationModal";

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
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const {
    isProcessingTx,
    isStacking,
    allowFastPool,
    handleStacking,
    handleStopStacking,
  } = useStackingLogic();

  const onStartStacking = () => {
    if (!conditionsAccepted) {
      return; // Don't proceed if conditions not accepted
    }

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
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-400" />
              Configure Your Stacking
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StackingAmountInput
            value={stxAmount}
            onChange={setStxAmount}
            disabled={isStacking}
            rewardType={rewardType}
          />

          <RewardTypeSelector value={rewardType} onChange={setRewardType} disabled={isStacking} />

          <StackingConditions
            accepted={conditionsAccepted}
            onAcceptedChange={setConditionsAccepted}
            disabled={isStacking}
          />

          <StackingActions
            isStacking={isStacking}
            isProcessing={isProcessingTx}
            onAllowFastPool={allowFastPool}
            onStartStacking={onStartStacking}
            onStopStacking={handleStopStacking}
            conditionsAccepted={conditionsAccepted}
            setShowVerificationModal={setShowVerificationModal}
          />
        </CardContent>
      </Card>

      <UserDataVerificationModal
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
      />
    </>
  );
};

export default StackingForm;
