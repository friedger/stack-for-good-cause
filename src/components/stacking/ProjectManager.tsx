
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Plus, X, ShoppingCart } from "lucide-react";
import { Project } from "@/services/projectService";
import { cartService } from "@/services/cartService";
import { projectService } from "@/services/projectService";
import ProjectSelectionModal from "./ProjectSelectionModal";
import { useToast } from "@/hooks/use-toast";

interface ProjectManagerProps {
  selectedProjects: Project[];
  onSelectedProjectsChange: (projects: Project[]) => void;
  disabled?: boolean;
}

const ProjectManager = ({ selectedProjects, onSelectedProjectsChange, disabled }: ProjectManagerProps) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const { toast } = useToast();
  const cartCount = cartService.getCartCount();

  const removeProject = (projectId: string) => {
    onSelectedProjectsChange(selectedProjects.filter(p => p.id !== projectId));
    // Also remove from cart
    cartService.removeProject(projectId);
  };

  const loadFromCart = () => {
    const cartProjects = cartService.getCartProjects();
    if (cartProjects.length > 0) {
      const projectsFromCart = cartProjects.map(cartProject => {
        const fullProject = projectService.getAllProjects().find(p => p.id === cartProject.id);
        return fullProject || {
          id: cartProject.id,
          name: cartProject.name,
          description: cartProject.description,
          image: cartProject.image,
          totalRaised: cartProject.totalRaised,
          category: "Unknown",
          backers: 0,
          status: "approved" as const,
          creator: "Unknown",
          slug: cartProject.id
        };
      });
      onSelectedProjectsChange(projectsFromCart);
      
      toast({
        title: "Projects Loaded",
        description: `Loaded ${cartProjects.length} project${cartProjects.length !== 1 ? 's' : ''} from your support cart.`,
      });
    } else {
      toast({
        title: "Cart is Empty",
        description: "Visit the Projects page to add projects to your support cart.",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-white">Selected Projects ({selectedProjects.length}/5)</Label>
        {cartCount > 0 && selectedProjects.length === 0 && (
          <SecondaryButton
            onClick={loadFromCart}
            size="sm"
            disabled={disabled}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Load Cart ({cartCount})
          </SecondaryButton>
        )}
      </div>

      {selectedProjects.length > 0 && (
        <div className="space-y-2 mb-3">
          {selectedProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10"
            >
              <div className="flex items-center space-x-3">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div>
                  <p className="text-white font-medium">{project.name}</p>
                  <p className="text-gray-400 text-sm">{project.totalRaised.toLocaleString()} STX raised</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="text-gray-400 hover:text-red-400"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <SecondaryButton
        onClick={() => setShowProjectModal(true)}
        className="w-full"
        disabled={selectedProjects.length >= 5 || disabled}
      >
        <Plus className="h-4 w-4 mr-2" />
        {selectedProjects.length === 0 ? 'Select Projects' : 'Add More Projects'}
      </SecondaryButton>

      <ProjectSelectionModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
        selectedProjects={selectedProjects}
        onProjectsChange={onSelectedProjectsChange}
      />
    </div>
  );
};

export default ProjectManager;
