import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/services/projectService";
import { PieChart } from "lucide-react";

interface RewardDistributionProps {
  selectedProjects: Project[];
  donationPercentage: number;
  enableDonation: boolean;
}

const RewardDistribution = ({ selectedProjects, donationPercentage, enableDonation }: RewardDistributionProps) => {
  if (!enableDonation || selectedProjects.length === 0) {
    return null;
  }

  // Fast Pool always gets 4.7%
  const fastPoolPercentage = 4.7;
  // Remaining donation percentage is distributed among other projects
  const remainingDonation = donationPercentage - fastPoolPercentage;
  const otherProjects = selectedProjects.filter(p => p.name !== "Fast Pool");
  const percentagePerOtherProject = otherProjects.length > 0 ? remainingDonation / otherProjects.length : 0;

  // Your rewards percentage
  const yourRewardsPercentage = 100 - donationPercentage;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-blue-400" />
          Reward Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Your rewards */}
        <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-white font-medium">Your Rewards</span>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {yourRewardsPercentage.toFixed(1)}%
          </Badge>
        </div>

        {/* Fast Pool - always 4.7% */}
        <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <div>
              <span className="text-white font-medium">Fast Pool</span>
              <div className="text-xs text-gray-400">Pool Operation</div>
            </div>
          </div>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            {fastPoolPercentage}%
          </Badge>
        </div>

        {/* Other selected projects */}
        {otherProjects.map((project, index) => (
          <div key={project.id} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <span className="text-white font-medium">{project.name}</span>
                <div className="text-xs text-gray-400">Project Support</div>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {percentagePerOtherProject.toFixed(1)}%
            </Badge>
          </div>
        ))}

        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Total Donation:</span>
            <span>{donationPercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardDistribution;
