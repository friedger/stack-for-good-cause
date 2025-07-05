import { useToast } from "@/hooks/use-toast";
import { nostrService } from "@/services/nostrService";
import { Project } from "@/services/projectService";
import { stackingStatsService } from "@/services/stackingStatsService";
import { walletService } from "@/services/walletService";
import { useState } from "react";

type StackingState =
  | "not-stacking"
  | "stacking"
  | "stacking-revoked"
  | "revoked-not-stacking";

export const useStackingLogic = () => {
  const { toast } = useToast();
  const [stackingState, setStackingState] =
    useState<StackingState>("not-stacking");
  const [isProcessingTx, setIsProcessingTx] = useState(false);

  const handleStacking = async (
    stxAmount: string,
    rewardType: "stx" | "sbtc",
    enableDonation: boolean,
    donationPercentage: number[],
    selectedProjects: Project[],
    sharePublicly: boolean
  ) => {
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
        description:
          "Please select at least one project to support with your donation.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingTx(true);

    const projectsForDonation = selectedProjects.map((project) => ({
      addr: project.stxAddress,
      part: Math.floor((donationPercentage[0] / 100) * 1000), // Convert percentage to promille
    }));
    try {
      const stxAmountNumber = parseFloat(stxAmount);
      const txId = await walletService.delegateStx(
        stxAmountNumber,
        rewardType,
        projectsForDonation
      );

      if (txId) {
        // Update stacking stats service
        stackingStatsService.startStacking(stxAmountNumber);
        if (enableDonation) {
          stackingStatsService.updateDonationStats(selectedProjects.length);
        }

        const rewardText = rewardType === "sbtc" ? "sBTC" : "STX";
        const donationText = enableDonation
          ? ` with ${donationPercentage[0]}% donated to ${
              selectedProjects.length
            } project${selectedProjects.length !== 1 ? "s" : ""}`
          : "";

        // Share impact on Nostr if enabled and donating to projects
        if (sharePublicly && enableDonation && selectedProjects.length > 0) {
          try {
            await nostrService.shareStackingImpact(
              stxAmount,
              selectedProjects.map((p) => p.name),
              rewardType
            );
            toast({
              title: "Stacking Started!",
              description: `Transaction broadcast: ${txId.slice(
                0,
                8
              )}...${txId.slice(
                -4
              )}. Rewards in ${rewardText}${donationText}. Impact shared on Nostr!`,
            });
          } catch (error) {
            toast({
              title: "Stacking Started!",
              description: `Transaction broadcast: ${txId.slice(
                0,
                8
              )}...${txId.slice(
                -4
              )}. Rewards in ${rewardText}${donationText}. (Note: Nostr sharing failed)`,
            });
          }
        } else {
          toast({
            title: "Stacking Started!",
            description: `Transaction broadcast: ${txId.slice(
              0,
              8
            )}...${txId.slice(-4)}. Rewards in ${rewardText}${donationText}.`,
          });
        }

        setStackingState("stacking");
      } else {
        toast({
          title: "Transaction Failed",
          description:
            "Failed to broadcast stacking transaction. Please try again.",
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
          description: `Revoke transaction broadcast: ${txId.slice(
            0,
            8
          )}...${txId.slice(-4)}. Your stacking has been stopped.`,
        });
        setStackingState("not-stacking");
      } else {
        toast({
          title: "Transaction Failed",
          description:
            "Failed to broadcast revoke transaction. Please try again.",
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

  const isStacking =
    stackingState === "stacking" || stackingState === "stacking-revoked";

  return {
    stackingState,
    isProcessingTx,
    isStacking,
    handleStacking,
    handleStopStacking,
    getStatusMessage,
  };
};
