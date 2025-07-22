
import { HelpCircle, StopCircle } from "lucide-react";
import { PrimaryButton } from "../ui/primary-button";
import { SecondaryButton } from "../ui/secondary-button";
import { useState } from "react";

interface StackingActionsProps {
  isStacking: boolean;
  canStopStacking: boolean;
  isProcessing: boolean;
  isMultiPoolAllowed: boolean;
  onAllowFastPool: () => void;
  onStartStacking: () => void;
  onStopStacking: () => void;
  conditionsAccepted?: boolean;
  setShowVerificationModal: (show: boolean) => void;
  canUpdateStacking?: boolean;
}

const StackingActions = ({ 
  isStacking, 
  canStopStacking, 
  isProcessing, 
  isMultiPoolAllowed, 
  onAllowFastPool, 
  onStartStacking, 
  onStopStacking, 
  conditionsAccepted, 
  setShowVerificationModal,
  canUpdateStacking = false
}: StackingActionsProps) => {
  const [allowFastPoolCalled, setAllowFastPoolCalled] = useState<boolean>(false);
  const [delegateCalled, setDelegateCalled] = useState<boolean>(false);

  return (
    <>
      <PrimaryButton
        onClick={() => {
          onAllowFastPool();
          setAllowFastPoolCalled(true);
        }}
        className="w-full"
        size="lg"
        disabled={isProcessing || !conditionsAccepted || isMultiPoolAllowed}
      >
        {isMultiPoolAllowed ? "Fast Pool already allowed" : isProcessing ? "Processing..." : "Allow Fast Pool"}
      </PrimaryButton>

      <div className="space-y-1">
        <PrimaryButton
          onClick={() => {
            onStartStacking();
            setDelegateCalled(true);
          }}
          className="w-full"
          size="lg"
          disabled={isProcessing || !conditionsAccepted || delegateCalled}
        >
          {isProcessing ? "Processing..." : (isStacking ? "Update Stacking" : "Start Stacking")}
        </PrimaryButton>
        <div className="flex justify-end">
          <div className="flex items-center text-sm text-blue-400 cursor-help"
            onClick={() => setShowVerificationModal(true)}>
            <HelpCircle className="h-4 w-4 mr-1" />
            What is "user-data"?
          </div>
        </div>
      </div>

      {canStopStacking &&
        <SecondaryButton
          onClick={onStopStacking}
          className="w-full"
          size="lg"
          variant="destructive"
          disabled={isProcessing}
        >
          <StopCircle className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : "Stop Stacking"}
        </SecondaryButton>
      }
    </>
  );
};

export default StackingActions;
