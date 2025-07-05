
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PublicSharingToggleProps {
  sharePublicly: boolean;
  onSharePubliclyChange: (share: boolean) => void;
  disabled?: boolean;
}

const PublicSharingToggle = ({ sharePublicly, onSharePubliclyChange, disabled }: PublicSharingToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-white">Share Impact Publicly</Label>
      <Switch
        checked={sharePublicly}
        onCheckedChange={onSharePubliclyChange}
        disabled={disabled}
      />
    </div>
  );
};

export default PublicSharingToggle;
