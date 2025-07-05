
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Gift } from "lucide-react";
import { Project } from "@/services/projectService";
import ProjectManager from "./ProjectManager";

interface DonationSettingsProps {
  enableDonation: boolean;
  onEnableDonationChange: (enabled: boolean) => void;
  donationPercentage: number[];
  onDonationPercentageChange: (percentage: number[]) => void;
  selectedProjects: Project[];
  onSelectedProjectsChange: (projects: Project[]) => void;
  sharePublicly: boolean;
  onSharePubliclyChange: (share: boolean) => void;
  disabled?: boolean;
}

const DonationSettings = ({
  enableDonation,
  onEnableDonationChange,
  donationPercentage,
  onDonationPercentageChange,
  selectedProjects,
  onSelectedProjectsChange,
  sharePublicly,
  onSharePubliclyChange,
  disabled
}: DonationSettingsProps) => {
  return (
    <div className={`space-y-4 transition-all duration-300 ${!enableDonation ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <Label className="text-white">Donate to Projects</Label>
        <Switch
          checked={enableDonation}
          onCheckedChange={onEnableDonationChange}
          disabled={disabled}
        />
      </div>

      {enableDonation ? (
        <>
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

          <ProjectManager
            selectedProjects={selectedProjects}
            onSelectedProjectsChange={onSelectedProjectsChange}
            disabled={disabled}
          />

          <div className="flex items-center justify-between">
            <Label className="text-white">Share Impact Publicly</Label>
            <Switch
              checked={sharePublicly}
              onCheckedChange={onSharePubliclyChange}
              disabled={disabled}
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
  );
};

export default DonationSettings;
