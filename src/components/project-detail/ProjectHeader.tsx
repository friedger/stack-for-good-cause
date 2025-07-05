
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Heart, Share2, Check, Lock } from "lucide-react";
import { Project } from "@/services/projectService";
import { cartService } from "@/services/cartService";
import { useToast } from "@/hooks/use-toast";

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
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
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-gray-300 border-gray-500">
              {project.category}
            </Badge>
            {isFastPool && (
              <Badge className="bg-orange-500/80 text-white border-orange-500/30">
                Required
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
            {project.name}
            {isFastPool && <Lock className="h-6 w-6 ml-3 text-orange-400" />}
          </h1>
          <p className="text-gray-300">{project.fullDescription || project.description}</p>
          {isFastPool && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-orange-300 text-sm">
                <Lock className="h-4 w-4 inline mr-2" />
                This is a required project that supports the Fast Pool infrastructure.
              </p>
            </div>
          )}
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
          <PrimaryButton 
            className={`flex-1 ${isFastPool ? 'bg-orange-500 hover:bg-orange-600 opacity-75 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
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
