
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar } from "lucide-react";
import { SupportedProject, UserStats } from "@/services/stackingService";

interface SupportedProjectsListProps {
  supportedProjects: SupportedProject[];
  userStats: UserStats;
}

const SupportedProjectsList = ({ supportedProjects, userStats }: SupportedProjectsListProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Heart className="h-6 w-6 mr-2 text-pink-400" />
          Projects You Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {supportedProjects.map((project, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-semibold mb-2">{project.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Donated:</span>
                <span className="text-pink-400 font-semibold">{project.totalDonated.toFixed(2)} STX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Last Donation:
                </span>
                <span className="text-gray-300">{project.lastDonation}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center py-6">
          <p className="text-gray-400 text-sm mb-3">
            Your donations are making a real impact!
          </p>
          <div className="text-2xl font-bold text-pink-400">
            {userStats.totalDonated.toFixed(2)} STX
          </div>
          <div className="text-gray-300 text-sm">Total Impact</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportedProjectsList;
