
import { Button } from "@/components/ui/button";
import { StopCircle } from "lucide-react";

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
        <Button
          onClick={onStartStacking}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Start Stacking"}
        </Button>
      ) : (
        <Button
          onClick={onStopStacking}
          className="w-full bg-red-500 hover:bg-red-600"
          size="lg"
          variant="destructive"
          disabled={isProcessing}
        >
          <StopCircle className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : "Stop Stacking"}
        </Button>
      )}
    </>
  );
};

export default StackingActions;
