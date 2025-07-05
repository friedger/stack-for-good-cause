
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StackingFormProps {
  stxAmount: string;
  setStxAmount: (value: string) => void;
  rewardType: string;
  setRewardType: (value: string) => void;
  enableDonation: boolean;
  setEnableDonation: (value: boolean) => void;
  donationPercentage: number[];
  setDonationPercentage: (value: number[]) => void;
  selectedProject: string;
  setSelectedProject: (value: string) => void;
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
  selectedProject,
  setSelectedProject,
  sharePublicly,
  setSharePublicly
}: StackingFormProps) => {
  const { toast } = useToast();

  const mockProjects = [
    { id: "1", name: "Clean Water Initiative", description: "Bringing clean water to communities" },
    { id: "2", name: "Education for All", description: "Supporting education in underserved areas" },
    { id: "3", name: "Renewable Energy", description: "Funding solar panel installations" },
  ];

  const handleStack = () => {
    if (!stxAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter STX amount to start stacking.",
        variant: "destructive",
      });
      return;
    }

    if (enableDonation && !selectedProject) {
      toast({
        title: "Select Project",
        description: "Please select a project to support with your donation.",
        variant: "destructive",
      });
      return;
    }

    const rewardText = rewardType === "sbtc" ? "sBTC" : "STX";
    const donationText = enableDonation ? ` with ${donationPercentage[0]}% donated to charity` : "";
    
    toast({
      title: "Stacking Started!",
      description: `Successfully stacked ${stxAmount} STX. Rewards in ${rewardText}${donationText}.`,
    });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-orange-400" />
          Configure Your Stack
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
          />
          <p className="text-sm text-gray-400 mt-1">Minimum: 1,000 STX</p>
        </div>

        <div>
          <Label className="text-white">Receive Rewards In</Label>
          <Select value={rewardType} onValueChange={setRewardType}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stx">STX (Stacks Token)</SelectItem>
              <SelectItem value="sbtc">sBTC (Synthetic Bitcoin)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white">Donate to Project</Label>
            <Switch
              checked={enableDonation}
              onCheckedChange={setEnableDonation}
            />
          </div>

          {enableDonation && (
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
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>1% (Minimum)</span>
                  <span>50% (Maximum)</span>
                </div>
              </div>

              <div>
                <Label className="text-white">Select Project to Support</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Share Impact Publicly</Label>
                <Switch
                  checked={sharePublicly}
                  onCheckedChange={setSharePublicly}
                />
              </div>
            </>
          )}
        </div>

        <Button 
          onClick={handleStack}
          className="w-full bg-orange-500 hover:bg-orange-600"
          size="lg"
        >
          Start Stacking
        </Button>
      </CardContent>
    </Card>
  );
};

export default StackingForm;
