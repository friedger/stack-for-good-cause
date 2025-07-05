import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, Plus, X, Heart, Gift, StopCircle, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Project, projectService } from "@/services/projectService";
import { nostrService } from "@/services/nostrService";
import { cartService } from "@/services/cartService";
import RewardTypeSelector from "./stacking/RewardTypeSelector";
import ProjectSelectionModal from "./stacking/ProjectSelectionModal";
import { SecondaryButton } from "./ui/secondary-button";
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
  const [showProjectModal, setShowProjectModal] = useState(false);
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

  const handleStack = async () => {
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
      const poolAddress = "SP2H8PY27SEZ03MWRK5XABF2CVZDE6HQMGHCCRX9P";
      const txId = await walletService.stackStx(stxAmount, poolAddress);

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

  const removeProject = (projectId: string) => {
    setSelectedProjects(selectedProjects.filter(p => p.id !== projectId));
    // Also remove from cart
    cartService.removeProject(projectId);
  };

  const loadFromCart = () => {
    const cartProjects = cartService.getCartProjects();
    if (cartProjects.length > 0) {
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
      setEnableDonation(true);
      
      toast({
        title: "Projects Loaded",
        description: `Loaded ${cartProjects.length} project${cartProjects.length !== 1 ? 's' : ''} from your support cart.`,
      });
    } else {
      toast({
        title: "Cart is Empty",
        description: "Visit the Projects page to add projects to your support cart.",
      });
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
  const cartCount = cartService.getCartCount();

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-orange-400" />
            Configure Your Stack
          </div>
          <div className="text-sm font-normal text-gray-300">
            {getStatusMessage()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="stx-amount" className="text-white">STX Amount</Label>
          <Input
            id="stx-amount"
            type="number"
            placeholder="Enter STX amount"
            value={stxAmount}
            onChange={(e) => setStxAmount(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={isStacking}
          />
          <p className="text-sm text-gray-400 mt-1">Minimum: 1,000 STX</p>
        </div>

        <RewardTypeSelector value={rewardType} onChange={setRewardType} disabled={isStacking} />

        <div className={`space-y-4 transition-all duration-300 ${!enableDonation ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between">
            <Label className="text-white">Donate to Projects</Label>
            <Switch
              checked={enableDonation}
              onCheckedChange={setEnableDonation}
              disabled={isStacking}
            />
          </div>

          {enableDonation ? (
            <>
              <div>
                <Label className="text-white">Donation Percentage: {donationPercentage[0]}%</Label>
                <Slider
                  value={donationPercentage}
                  onValueChange={setDonationPercentage}
                  max={50}
                  min={1}
                  step={1}
                  className="mt-2"
                  disabled={isStacking}
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>1% (Minimum)</span>
                  <span>50% (Maximum)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white">Selected Projects ({selectedProjects.length}/5)</Label>
                  {cartCount > 0 && selectedProjects.length === 0 && (
                    <SecondaryButton
                      onClick={loadFromCart}
                      size="sm"
                      disabled={isStacking}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Load Cart ({cartCount})
                    </SecondaryButton>
                  )}
                </div>

                {selectedProjects.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {selectedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10"
                      >
                        <div className="flex items-center space-x-3">
                          {project.image && (
                            <img
                              src={project.image}
                              alt={project.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="text-white font-medium">{project.name}</p>
                            <p className="text-gray-400 text-sm">{project.totalRaised.toLocaleString()} STX raised</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                          className="text-gray-400 hover:text-red-400"
                          disabled={isStacking}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <SecondaryButton
                  onClick={() => setShowProjectModal(true)}
                  className="w-full"
                  disabled={selectedProjects.length >= 5 || isStacking}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {selectedProjects.length === 0 ? 'Select Projects' : 'Add More Projects'}
                </SecondaryButton>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Share Impact Publicly</Label>
                <Switch
                  checked={sharePublicly}
                  onCheckedChange={setSharePublicly}
                  disabled={isStacking}
                />
              </div>
            </>
          ) : (
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-full bg-purple-500/20">
                    <Heart className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-gray-700 font-semibold mb-2">Keep All Your Rewards</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      You've chosen to keep 100% of your stacking rewards. You can always change this later!
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-purple-400">
                      <Gift className="h-4 w-4" />
                      <span>Maximum earnings mode</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {!isStacking ? (
          <Button
            onClick={handleStack}
            className="w-full bg-orange-500 hover:bg-orange-600"
            size="lg"
            disabled={isProcessingTx}
          >
            {isProcessingTx ? "Processing..." : "Start Stacking"}
          </Button>
        ) : (
          <Button
            onClick={handleStopStacking}
            className="w-full bg-red-500 hover:bg-red-600"
            size="lg"
            variant="destructive"
            disabled={isProcessingTx}
          >
            <StopCircle className="h-4 w-4 mr-2" />
            {isProcessingTx ? "Processing..." : "Stop Stacking"}
          </Button>
        )}
      </CardContent>

      <ProjectSelectionModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
        selectedProjects={selectedProjects}
        onProjectsChange={setSelectedProjects}
      />
    </Card>
  );
};

export default StackingForm;
