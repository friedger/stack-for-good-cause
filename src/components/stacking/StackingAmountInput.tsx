
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import { useStackingService } from "@/hooks/useStackingService";
import { ustxToLocalString } from "@/lib/format";
import { priceService } from "@/services/priceService";
import { walletService } from "@/services/walletService";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

interface StackingAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rewardType: "stx" | "sbtc";
}

const StackingAmountInput = ({ value, onChange, disabled, rewardType }: StackingAmountInputProps) => {
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const { estimatedApy } = useStackingService();
  const { loading, stxBalance } = useUser();

  useEffect(() => {
    onChange(stxBalance.toString());
  }, [stxBalance, onChange]);

  // Load Bitcoin price for sBTC calculations
  useEffect(() => {
    const loadBtcPrice = async () => {
      try {
        const priceData = await priceService.getBtcStxPrice();
        setBtcPrice(priceData.price);
      } catch (error) {
        console.error('Failed to load Bitcoin price:', error);
        setBtcPrice(100000); // Fallback price
      }
    };

    if (rewardType === "sbtc") {
      loadBtcPrice();
    }
  }, [rewardType]);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
  };

  const handleMaxClick = () => {
    if (stxBalance > 0) {
      const maxAmount = Math.floor(stxBalance);
      onChange(maxAmount.toString());
    }
  };

  const getEstimatedRewards = () => {
    if (!value || parseFloat(value) < 40) return null;

    const baseRewards = parseFloat(value) * estimatedApy;

    if (rewardType === "sbtc" && btcPrice > 0) {
      console.log("Calculating sBTC rewards with baseRewards:", baseRewards, "and btcPrice:", btcPrice);
      // For sBTC, multiply by Bitcoin price
      const sbtcRewards = baseRewards * btcPrice / 1e6;
      return {
        amount: sbtcRewards.toLocaleString("en-US", {
          style: "decimal",
          minimumFractionDigits: 8,
          maximumFractionDigits: 8,
        }),
        currency: "sBTC",
      };
    } else {
      // For STX, use the API value directly
      return {
        amount: ustxToLocalString(baseRewards),
        currency: "STX",
      }
    };
  };

  const estimatedRewards = getEstimatedRewards();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="stx-amount" className="text-white flex items-center">
          Stacking Amount
        </Label>
        {stxBalance || loading ? (
          <div className="flex items-center text-sm text-gray-400">
            <Wallet className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">
              Balance:
            </span>
            {loading ? "Loading..." : `${ustxToLocalString(stxBalance)} STX`}
          </div>
        ) :
          <div className="flex items-center text-sm text-blue-400 hover:text-blue-700 hover:cursor-pointer"
            onClick={() => walletService.connectWallet()}>
            <Wallet className="h-4 w-4 mr-1" />
            Connect Wallet
          </div>
        }
      </div>

      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input
            id="stx-amount"
            type="number"
            placeholder="Enter STX amount"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 disabled:cursor-default"
            disabled={disabled || loading || stxBalance === 0}
            min="40"
          />
          {stxBalance > 0 && (<Button
            type="button"
            variant="outline"
            onClick={handleMaxClick}
            disabled={disabled || loading || stxBalance === 0}
            className="px-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Max
          </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-sm text-gray-400">
        <span>Minimum Stacking: 40 STX</span>

        <span className="text-green-400">
          {estimatedRewards ? (<>
            Est. Rewards: ~{estimatedRewards.amount} {estimatedRewards.currency}/year
          </>) : <>&nbsp;</>}
        </span>
      </div>
    </div>
  );
};

export default StackingAmountInput;

