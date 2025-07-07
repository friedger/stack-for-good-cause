
import { Button } from "@/components/ui/button";
import { HelpCircle, StopCircle } from "lucide-react";
import { PrimaryButton } from "../ui/primary-button";
import { SecondaryButton } from "../ui/secondary-button";

interface StackingActionsProps {
  isStacking: boolean;
  isProcessing: boolean;
  onAllowFastPool: () => void;
  onStartStacking: () => void;
  onStopStacking: () => void;
  conditionsAccepted?: boolean;
  setShowVerificationModal: (show: boolean) => void;
}

const StackingActions = ({ isStacking, isProcessing, onAllowFastPool, onStartStacking, onStopStacking, conditionsAccepted, setShowVerificationModal }: StackingActionsProps) => {
  return (
    <>
      {!isStacking ? (
        <>
          <PrimaryButton
            onClick={onAllowFastPool}
            className="w-full"
            size="lg"
            disabled={isProcessing || !conditionsAccepted}
          >
            {isProcessing ? "Processing..." : "Allow Fast Pool"}
          </PrimaryButton>

          <div className="space-y-1">
            <PrimaryButton
              onClick={onStartStacking}
              className="w-full"
              size="lg"
              disabled={isProcessing || !conditionsAccepted}
            >
              {isProcessing ? "Processing..." : "Start Stacking"}
            </PrimaryButton>
            <div className="flex justify-end">
              <div className="flex items-center text-sm text-blue-400 cursor-help"
                onClick={() => setShowVerificationModal(true)}>
                <HelpCircle className="h-4 w-4 mr-1" />
                What is "user-data"?
              </div>
            </div>
          </div>
        </>
      ) : (
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
      )}
    </>
  );
};

export default StackingActions;
