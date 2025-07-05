
import { Button } from "@/components/ui/button";
import { StopCircle } from "lucide-react";
import { PrimaryButton } from "../ui/primary-button";
import { SecondaryButton } from "../ui/secondary-button";

interface StackingActionsProps {
  isStacking: boolean;
  isProcessing: boolean;
  onStartStacking: () => void;
  onStopStacking: () => void;
}

const StackingActions = ({ isStacking, isProcessing, onStartStacking, onStopStacking }: StackingActionsProps) => {
  return (
    <>
      {!isStacking ? (
        <PrimaryButton
          onClick={onStartStacking}
          className="w-full"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Start Stacking"}
        </PrimaryButton>
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
