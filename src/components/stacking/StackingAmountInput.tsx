
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { walletService } from "@/services/walletService";
import { Wallet, TrendingUp } from "lucide-react";
import { useStackingService } from "@/hooks/useStackingService";

interface StackingAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const StackingAmountInput = ({ value, onChange, disabled }: StackingAmountInputProps) => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [sliderValue, setSliderValue] = useState([parseFloat(value) || 40]);
  const { estimatedApy } = useStackingService();

  // Mock balance loading - in real app this would fetch from blockchain
  useEffect(() => {
    const loadBalance = async () => {
      if (walletService.isWalletConnected()) {
        setIsLoadingBalance(true);
        // Simulate API call
        setTimeout(() => {
          setBalance(12500.75); // Mock balance
          setIsLoadingBalance(false);
        }, 1000);
      }
    };
    loadBalance();
  }, []);

  // Update slider when input value changes
  useEffect(() => {
    const numValue = parseFloat(value) || 40;
    if (numValue !== sliderValue[0]) {
      setSliderValue([Math.min(Math.max(numValue, 40), balance || 50000)]);
    }
  }, [value, balance, sliderValue]);

  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue);
    onChange(newValue[0].toString());
  };

  const handleInputChange = (inputValue: string) => {
    const numValue = parseFloat(inputValue) || 0;
    if (numValue >= 40) {
      setSliderValue([Math.min(numValue, balance || 50000)]);
    }
    onChange(inputValue);
  };

  const handleMaxClick = () => {
    if (balance > 0) {
      const maxAmount = Math.floor(balance);
      setSliderValue([maxAmount]);
      onChange(maxAmount.toString());
    }
  };

  const maxSliderValue = balance > 0 ? 2 * balance : 50_000_000;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="stx-amount" className="text-white flex items-center">
          Stacking Amount
        </Label>
        {walletService.isWalletConnected() && (
          <div className="flex items-center text-sm text-gray-400">
            <Wallet className="h-4 w-4 mr-1" />
            Balance: {isLoadingBalance ? "Loading..." : `${balance.toLocaleString()} STX`}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input
            id="stx-amount"
            type="number"
            placeholder="Enter STX amount"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={disabled}
            min="40"
          />
          {balance > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleMaxClick}
              disabled={disabled}
              className="px-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Max
            </Button>
          )}
        </div>

        {/* Amount Slider */}
        <div className="space-y-2">
          <Slider
            value={sliderValue}
            onValueChange={handleSliderChange}
            max={maxSliderValue}
            min={40}
            step={1}
            className="w-full"
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>40 STX (Min)</span>
            <span className="text-blue-400">{sliderValue[0].toLocaleString()} STX</span>
            <span>{maxSliderValue.toLocaleString()} STX</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-400">
        <span>Minimum: 40 STX</span>
        {value && parseFloat(value) >= 40 && (
          <span className="text-green-400">
            Est. Rewards: ~{(parseFloat(value) * estimatedApy).toFixed(2)} STX/year
          </span>
        )}
      </div>
    </div>
  );
};

export default StackingAmountInput;

