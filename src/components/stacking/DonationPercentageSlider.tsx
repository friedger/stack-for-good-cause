
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DonationPercentageSliderProps {
  donationPercentage: number[];
  onDonationPercentageChange: (percentage: number[]) => void;
  disabled?: boolean;
}

const DonationPercentageSlider = ({ 
  donationPercentage, 
  onDonationPercentageChange, 
  disabled 
}: DonationPercentageSliderProps) => {
  return (
    <div>
      <Label className="text-white">Donation Percentage: {donationPercentage[0]}%</Label>
      <Slider
        value={donationPercentage}
        onValueChange={onDonationPercentageChange}
        max={50}
        min={1}
        step={1}
        className="mt-2"
        disabled={disabled}
      />
      <div className="flex justify-between text-sm text-gray-400 mt-1">
        <span>1% (Minimum)</span>
        <span>50% (Maximum)</span>
      </div>
    </div>
  );
};

export default DonationPercentageSlider;
