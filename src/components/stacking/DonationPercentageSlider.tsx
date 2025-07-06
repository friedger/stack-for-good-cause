
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
      <Label className="text-white">Contribution Percentage: {donationPercentage[0]}%</Label>
      <Slider
        value={donationPercentage}
        onValueChange={onDonationPercentageChange}
        max={100}
        min={4.7}
        step={0.1}
        className="mt-2"
        disabled={disabled}
      />
      <div className="flex justify-between text-sm text-gray-400 mt-1">
        <span>4.7% (Fast Pool Required)</span>
        <span>100% </span>
      </div>
    </div>
  );
};

export default DonationPercentageSlider;
