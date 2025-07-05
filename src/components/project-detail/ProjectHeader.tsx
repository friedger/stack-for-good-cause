
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Heart, Share2 } from "lucide-react";
import { Project } from "@/services/projectService";

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-12">
      <div>
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      <div className="space-y-6">
        <div>
          <Badge variant="outline" className="text-gray-300 border-gray-500 mb-2">
            {project.category}
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-4">{project.name}</h1>
          <p className="text-gray-300">{project.fullDescription || project.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {project.totalRaised.toFixed(2)} STX
            </div>
            <div className="text-gray-300 text-sm">Total Raised</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {project.backers}
            </div>
            <div className="text-gray-300 text-sm">Backers</div>
          </div>
        </div>

        <div className="flex gap-4">
          <PrimaryButton className="flex-1 bg-pink-500 hover:bg-pink-600">
            <Heart className="h-4 w-4 mr-2" />
            Support This Project
          </PrimaryButton>
          <SecondaryButton>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </SecondaryButton>
        </div>

        <div className="text-sm text-gray-400">
          Created by <span className="text-orange-400 font-semibold">{project.creator}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
