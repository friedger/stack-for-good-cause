
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Lock } from "lucide-react";
import { Project } from "@/services/projectService";

interface ProjectContributionCardProps {
  project: Project;
  shareInPromille?: number;
  estimatedContribution?: string;
  rewardType?: string;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

const ProjectContributionCard = ({
  project,
  shareInPromille,
  estimatedContribution,
  rewardType,
  onRemove,
  showRemoveButton = true
}: ProjectContributionCardProps) => {
  const isFastPool = project.id === "1";
  const shareInPercent = shareInPromille ? (shareInPromille / 10).toFixed(1) : undefined; // Convert promille to percent
  return (
    <Card className={`bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-200 ${isFastPool ? 'ring-1 ring-orange-500/30' : ''}`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Left section: Image and project info */}
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <img
              src={project.image}
              alt={project.name}
              className="w-10 h-10 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white text-sm font-medium truncate">
                  {project.name}
                </h4>
                {isFastPool && <Lock className="h-3 w-3 text-orange-400 flex-shrink-0" />}
              </div>
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-500 mb-2">
                {project.category}
              </Badge>

              {/* Contribution data on mobile - below project info */}
              {shareInPercent !== undefined && estimatedContribution && (
                <div className="lg:hidden space-y-1">
                  <div className="text-xs">
                    <span className="text-gray-400">Contribution: </span>
                    <span className="text-orange-400 font-medium">
                      {shareInPercent}%
                    </span>
                  </div>
                  {/* <div className="text-xs">
                    <span className="text-gray-400">Est. Amount: </span>
                    <span className="text-orange-400 font-medium">
                      {estimatedContribution} {rewardType?.toUpperCase() || 'STX'}
                    </span>
                  </div> */}
                </div>
              )}
            </div>
          </div>

          {/* Right section: Contribution data (desktop) and remove button */}
          <div className="flex items-center gap-3">
            {/* Contribution data on desktop - fixed width for alignment */}
            {shareInPercent !== undefined && estimatedContribution && (
              <div className="hidden lg:block text-right min-w-[100px]">
                <div className="text-xs">
                  <span className="text-gray-400">Contribution: </span>
                  <span className="text-orange-400 font-medium">
                    {shareInPercent}%
                  </span>
                </div>
                {/* <div className="text-xs">
                  <span className="text-gray-400">Est. Amount: </span>
                  <span className="text-orange-400 font-medium">
                    {estimatedContribution} {rewardType?.toUpperCase() || 'STX'}
                  </span>
                </div> */}
              </div>
            )}

            {/* Remove button - fixed width placeholder */}
            <div className="w-6 h-6 flex items-center justify-center">
              {showRemoveButton && !isFastPool && onRemove && (
                <button
                  onClick={onRemove}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded"
                  title="Remove project"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectContributionCard;
