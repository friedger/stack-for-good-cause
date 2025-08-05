import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStackingOperations } from "@/hooks/useStackingOperations";
import { useSourceTracking } from "@/hooks/useSourceTracking";
import { Project } from "@/services/projectService";
import { TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import RewardTypeSelector from "./stacking/RewardTypeSelector";
import StackingActions from "./stacking/StackingActions";
import StackingAmountInput from "./stacking/StackingAmountInput";
import StackingConditions from "./stacking/StackingConditions";
import ReferralSource from "./stacking/ReferralSource";
import UserDataVerificationModal from "./stacking/UserDataVerificationModal";
import { useUser } from "@/hooks/useUser";
import { useUserStackingService } from "@/hooks/useStackingInfo";
import { walletService } from "@/services/walletService";

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

  // Use the source tracking hook
  const { currentSource } = useSourceTracking();

  const {
    isProcessingTx,
    allowFastPool,
    handleStacking,
    handleStopStacking,
    resetTransactionState,
  } = useStackingOperations();

  const { stxAddress, lockedStx } = useUser();
  const { multiPoolAllowed, stackingStatus, delegationStatus } = useUserStackingService();

  const isStacking = stackingStatus?.stacked || false;
  const canStopStacking = delegationStatus?.delegated;
  const isUpdating = isStacking && lockedStx > 0;

  // Validate stacking amount
  const validateStackingAmount = () => {
    const numAmount = parseFloat(stxAmount);
    if (isNaN(numAmount) || !stxAmount) return false;

    if (isUpdating) {
      return numAmount >= Math.floor(lockedStx) + 1;
    }
    return numAmount >= 40;
  };

  const onStartStacking = () => {
    if (!conditionsAccepted) {
      return;
    }

    if (!validateStackingAmount()) {
      return;
    }

    handleStacking(
      stxAmount,
      rewardType,
      currentSource,
      enableDonation,
      donationPercentage,
      selectedProjects,
      sharePublicly,
      isUpdating
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
            disabled={false}
            rewardType={rewardType}
          />

          <RewardTypeSelector value={rewardType} onChange={setRewardType} disabled={false} />

          <StackingConditions
            accepted={conditionsAccepted}
            onAcceptedChange={setConditionsAccepted}
            disabled={false}
          />

          <ReferralSource />

          {stxAddress ?
            <StackingActions
              isStacking={isStacking}
              canStopStacking={canStopStacking}
              isProcessing={isProcessingTx}
              isMultiPoolAllowed={multiPoolAllowed}
              onAllowFastPool={allowFastPool}
              onStartStacking={onStartStacking}
              onStopStacking={handleStopStacking}
              conditionsAccepted={conditionsAccepted}
              setShowVerificationModal={setShowVerificationModal}
              canUpdateStacking={validateStackingAmount()}
            /> :
            <div className="flex items-center text-sm text-blue-400 hover:text-blue-700 hover:cursor-pointer"
              onClick={() => walletService.connectWallet()}>
              <Wallet className="h-4 w-4 mr-1" />
              Connect Wallet
            </div>
          }
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
