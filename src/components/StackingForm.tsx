
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/services/projectService";
import { nostrService } from "@/services/nostrService";
import { cartService } from "@/services/cartService";
import { projectService } from "@/services/projectService";
import RewardTypeSelector from "./stacking/RewardTypeSelector";
import StackingAmountInput from "./stacking/StackingAmountInput";
import DonationSettings from "./stacking/DonationSettings";
import StackingActions from "./stacking/StackingActions";
import { walletService } from "@/services/walletService";
import { stackingStatsService } from "@/services/stackingStatsService";

type StackingState = "not-stacking" | "stacking" | "stacking-revoked" | "revoked-not-stacking";

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
  const { toast } = useToast();
  const [stackingState, setStackingState] = useState<StackingState>("not-stacking");
  const [isProcessingTx, setIsProcessingTx] = useState(false);

  // Load projects from cart on component mount
  useEffect(() => {
    const cartProjects = cartService.getCartProjects();
    if (cartProjects.length > 0) {
      // Convert cart projects to Project objects
      const projectsFromCart = cartProjects.map(cartProject => {
        const fullProject = projectService.getAllProjects().find(p => p.id === cartProject.id);
        return fullProject || {
          id: cartProject.id,
          name: cartProject.name,
          description: cartProject.description,
          image: cartProject.image,
          totalRaised: cartProject.totalRaised,
          category: "Unknown",
          backers: 0,
          status: "approved" as const,
          creator: "Unknown",
          slug: cartProject.id
        };
      });
      setSelectedProjects(projectsFromCart);

      // Auto-enable donation if there are projects in cart
      if (!enableDonation) {
        setEnableDonation(true);
      }
    }
  }, [setSelectedProjects, enableDonation, setEnableDonation]);

  const handleStacking = async () => {
    if (!walletService.isWalletConnected()) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!stxAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter STX amount to start stacking.",
        variant: "destructive",
      });
      return;
    }

    if (enableDonation && selectedProjects.length === 0) {
      toast({
        title: "Select Projects",
        description: "Please select at least one project to support with your donation.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingTx(true);

    try {
      // Use Fast Pool address (this would be the actual pool contract address)
      const poolAddress = "SPMPMA1V6P430M8C91QS1G9XJ95S59JS1TZFZ4Q4.pox4-multi-pool-v1";
      const txId = await walletService.delegateStx(stxAmount, poolAddress);

      if (txId) {
        // Update stacking stats service
        stackingStatsService.startStacking(parseFloat(stxAmount));
        if (enableDonation) {
          stackingStatsService.updateDonationStats(selectedProjects.length);
        }

        const rewardText = rewardType === "sbtc" ? "sBTC" : "STX";
        const donationText = enableDonation
          ? ` with ${donationPercentage[0]}% donated to ${selectedProjects.length} project${selectedProjects.length !== 1 ? 's' : ''}`
          : "";

        // Share impact on Nostr if enabled and donating to projects
        if (sharePublicly && enableDonation && selectedProjects.length > 0) {
          try {
            await nostrService.shareStackingImpact(stxAmount, selectedProjects.map(p => p.name), rewardType);
            toast({
              title: "Stacking Started!",
              description: `Transaction broadcast: ${txId.slice(0, 8)}...${txId.slice(-4)}. Rewards in ${rewardText}${donationText}. Impact shared on Nostr!`,
            });
          } catch (error) {
            toast({
              title: "Stacking Started!",
              description: `Transaction broadcast: ${txId.slice(0, 8)}...${txId.slice(-4)}. Rewards in ${rewardText}${donationText}. (Note: Nostr sharing failed)`,
            });
          }
        } else {
          toast({
            title: "Stacking Started!",
            description: `Transaction broadcast: ${txId.slice(0, 8)}...${txId.slice(-4)}. Rewards in ${rewardText}${donationText}.`,
          });
        }

        setStackingState("stacking");
      } else {
        toast({
          title: "Transaction Failed",
          description: "Failed to broadcast stacking transaction. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingTx(false);
    }
  };

  const handleStopStacking = async () => {
    if (!walletService.isWalletConnected()) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingTx(true);

    try {
      const txId = await walletService.revokeStacking();

      if (txId) {
        // Update stacking stats service
        stackingStatsService.stopStacking();

        toast({
          title: "Stacking Revoked",
          description: `Revoke transaction broadcast: ${txId.slice(0, 8)}...${txId.slice(-4)}. Your stacking has been stopped.`,
        });
        setStackingState("not-stacking");
      } else {
        toast({
          title: "Transaction Failed",
          description: "Failed to broadcast revoke transaction. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while revoking stacking.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingTx(false);
    }
  };

  const getStatusMessage = () => {
    switch (stackingState) {
      case "stacking":
        return "🟢 Currently stacking - earning rewards";
      case "stacking-revoked":
        return "🟡 Stacking with revoked delegation";
      case "revoked-not-stacking":
        return "🔴 Delegation revoked - not stacking";
      default:
        return "⚪ Ready to start stacking";
    }
  };

  const isStacking = stackingState === "stacking" || stackingState === "stacking-revoked";

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-purple-400" />
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
          onStartStacking={handleStacking}
          onStopStacking={handleStopStacking}
        />
      </CardContent>
    </Card>
  );
};

export default StackingForm;
