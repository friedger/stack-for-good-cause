
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { DollarSign, Users, Eye, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Project } from "@/services/projectService";
import { SupportButton } from "../ui/support-button";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending Review</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unknown</Badge>;
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col">
      <div className="relative">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge(project.status)}
        </div>
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="text-white text-lg">{project.name}</CardTitle>
        <Badge variant="outline" className="text-gray-300 border-gray-500 w-fit">
          {project.category}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col">
        <p className="text-gray-300 text-sm flex-grow">{project.description}</p>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Raised
            </span>
            <span className="text-green-400 font-semibold">
              {project.totalRaised.toFixed(2)} STX
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Backers
            </span>
            <span className="text-blue-400 font-semibold">{project.backers}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Creator</span>
            <span className="text-orange-400 font-semibold">{project.creator}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 space-y-2">
          <Link to={`/projects/${project.slug}`}>
            <SecondaryButton className="w-full" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </SecondaryButton>
          </Link>

          {project.status === "approved" && (
            <SupportButton className="w-full" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Support This Project
            </SupportButton>
          )}

          {project.status === "pending" && (
            <div className="flex items-center justify-center py-2 text-yellow-400 text-sm">
              <Clock className="h-4 w-4 mr-2" />
              Awaiting Admin Approval
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
