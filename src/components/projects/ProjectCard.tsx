
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { DollarSign, Users, Eye, Heart, Clock, Check, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Project } from "@/services/projectService";
import { SupportButton } from "../ui/support-button";
import { cartService } from "@/services/cartService";
import { useToast } from "@/hooks/use-toast";

interface ProjectCardProps {
  project: Project;
  contributionPercentage?: number;
  estimatedContribution?: string;
  rewardType?: string;
}

const ProjectCard = ({ project, contributionPercentage, estimatedContribution, rewardType }: ProjectCardProps) => {
  const [isInCart, setIsInCart] = useState(false);
  const { toast } = useToast();
  const isFastPool = project.name === "Fast Pool";

  useEffect(() => {
    setIsInCart(cartService.isProjectInCart(project.id));
  }, [project.id]);

  const handleSupportToggle = () => {
    if (isFastPool) {
      toast({
        title: "Fast Pool Required",
        description: "Fast Pool is a required project and cannot be removed.",
        variant: "destructive",
      });
      return;
    }

    if (isInCart) {
      // Remove from cart
      const success = cartService.removeProject(project.id);
      if (success) {
        setIsInCart(false);
        toast({
          title: "Removed from Cart",
          description: `${project.name} has been removed from your support list.`,
        });
      }
    } else {
      // Add to cart
      const success = cartService.addProject({
        id: project.id,
        name: project.name,
        description: project.description,
        image: project.image,
        totalRaised: project.totalRaised
      });
      if (success) {
        setIsInCart(true);
        toast({
          title: "Added to Cart",
          description: `${project.name} has been added to your support list.`,
        });
      } else {
        toast({
          title: "Already in Cart",
          description: `${project.name} is already in your support list.`,
          variant: "destructive",
        });
      }
    }
  };



  return (
    <Card className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 flex flex-col ${isFastPool ? 'ring-2 ring-orange-500/50' : ''}`}>
      <div className="relative">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge(project)}
        </div>
        {isFastPool && (
          <div className="absolute top-3 left-3">
            <Lock className="h-5 w-5 text-orange-400" />
          </div>
        )}
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="text-white text-lg flex items-center">
          {project.name}
          {isFastPool && <Lock className="h-4 w-4 ml-2 text-orange-400" />}
        </CardTitle>
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

          {/* Show contribution percentage and amount if provided */}
          {contributionPercentage !== undefined && estimatedContribution && (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Your Contribution %</span>
                <span className="text-orange-400 font-semibold">{contributionPercentage.toFixed(1)}%</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Est. Contribution</span>
                <span className="text-orange-400 font-semibold">
                  {estimatedContribution} {rewardType?.toUpperCase() || 'STX'}
                </span>
              </div>
            </>
          )}

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
            <SupportButton
              className={`w-full ${isFastPool ? 'opacity-75 cursor-not-allowed' : ''}`}
              size="sm"
              onClick={handleSupportToggle}
              disabled={isFastPool && isInCart}
            >
              {isFastPool ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Required Project
                </>
              ) : isInCart ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Remove Support
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Support This Project
                </>
              )}
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

export const getStatusBadge = (project: Project) => {
  if (project.id === "1") {
    return <Badge className="bg-orange-500/80 text-white border-orange-500/30">Required</Badge>;
  }

  switch (project.status) {
    case "approved":
      return <Badge className="bg-green-500/80 text-gray-600 border-green-500/30">Approved</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500/80 text-gray-600 border-yellow-500/30">Pending Review</Badge>;
    default:
      return <Badge className="bg-gray-500/80 text-gray-200 border-gray-500/30">Unknown</Badge>;
  }
};