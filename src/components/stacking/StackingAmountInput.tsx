
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StackingAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const StackingAmountInput = ({ value, onChange, disabled }: StackingAmountInputProps) => {
  return (
    <div>
      <Label htmlFor="stx-amount" className="text-white">STX Amount</Label>
      <Input
        id="stx-amount"
        type="number"
        placeholder="Enter STX amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        disabled={disabled}
      />
      <p className="text-sm text-gray-400 mt-1">Minimum: 1,000 STX</p>
    </div>
  );
};

export default StackingAmountInput;
