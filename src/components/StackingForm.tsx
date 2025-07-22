
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStackingLogic } from "@/hooks/useStackingLogic";
import { Project } from "@/services/projectService";
import { TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import RewardTypeSelector from "./stacking/RewardTypeSelector";
import StackingActions from "./stacking/StackingActions";
import StackingAmountInput from "./stacking/StackingAmountInput";
import StackingConditions from "./stacking/StackingConditions";
import UserDataVerificationModal from "./stacking/UserDataVerificationModal";
import { useUser } from "@/hooks/useUser";
import { walletService } from "@/services/walletService";
import { useUserStackingService } from "@/hooks/useStackingInfo";

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
    allowFastPool,
    handleStacking,
    handleStopStacking,
  } = useStackingLogic();

  const { stxAddress } = useUser();
  const { multiPoolAllowed, stackingStatus, delegationStatus } = useUserStackingService();
  console.log({ multiPoolAllowed, stackingStatus, delegationStatus });

  const isStacking = stackingStatus?.stacked || false;
  const canStopStacking = delegationStatus?.delegated

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
