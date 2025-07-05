
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface DonationToggleProps {
  enableDonation: boolean;
  onEnableDonationChange: (enabled: boolean) => void;
  disabled?: boolean;
}

const DonationToggle = ({ enableDonation, onEnableDonationChange, disabled }: DonationToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-foreground">Donate to Projects</Label>
      <Switch
        checked={enableDonation}
        onCheckedChange={onEnableDonationChange}
        disabled={disabled}
      />
    </div>
  );
};

export default DonationToggle;
