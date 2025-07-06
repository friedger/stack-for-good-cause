
import { Button } from "@/components/ui/button";
import { StopCircle } from "lucide-react";
import { PrimaryButton } from "../ui/primary-button";
import { SecondaryButton } from "../ui/secondary-button";

interface StackingActionsProps {
  isStacking: boolean;
  isProcessing: boolean;
  onAllowFastPool: () => void;
  onStartStacking: () => void;
  onStopStacking: () => void;
  conditionsAccepted?: boolean;
}

const StackingActions = ({ isStacking, isProcessing, onAllowFastPool, onStartStacking, onStopStacking, conditionsAccepted = true }: StackingActionsProps) => {
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

          <PrimaryButton
            onClick={onStartStacking}
            className="w-full"
            size="lg"
            disabled={isProcessing || !conditionsAccepted}
          >
            {isProcessing ? "Processing..." : "Start Stacking"}
          </PrimaryButton>
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
