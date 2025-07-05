
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Plus, X, ShoppingCart, Lock } from "lucide-react";
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
    // Don't allow removal of Fast Pool
    const projectToRemove = selectedProjects.find(p => p.id === projectId);
    if (projectToRemove?.name === "Fast Pool") {
      toast({
        title: "Cannot Remove Fast Pool",
        description: "Fast Pool is required for stacking and cannot be removed.",
        variant: "destructive",
      });
      return;
    }

    onSelectedProjectsChange(selectedProjects.filter(p => p.id !== projectId));
    // Also remove from cart
    cartService.removeProject(projectId);
  };

  const loadFromCart = () => {
    const cartProjects = cartService.getCartProjects();
    if (cartProjects.length > 0) {
      const fastPoolProject = projectService.getAllProjects().find(p => p.name === "Fast Pool");
      const projectsFromCart = cartProjects
        .filter(cartProject => cartProject.name !== "Fast Pool") // Exclude Fast Pool from cart items
        .map(cartProject => {
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
      
      // Always include Fast Pool as first project
      const allProjects = fastPoolProject ? [fastPoolProject, ...projectsFromCart] : projectsFromCart;
      onSelectedProjectsChange(allProjects);
      
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
        {cartCount > 0 && selectedProjects.filter(p => p.name !== "Fast Pool").length === 0 && (
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
          {selectedProjects.map((project) => {
            const isFastPool = project.name === "Fast Pool";
            return (
              <div
                key={project.id}
                className={`flex items-center justify-between rounded-lg p-3 border ${
                  isFastPool 
                    ? "bg-orange-500/10 border-orange-500/30" 
                    : "bg-white/5 border-white/10"
                }`}
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
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-medium">{project.name}</p>
                      {isFastPool && (
                        <div className="flex items-center space-x-1">
                          <Lock className="h-3 w-3 text-orange-400" />
                          <span className="text-xs text-orange-400">Required</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {isFastPool ? "4.7% fixed" : `${project.totalRaised.toLocaleString()} STX raised`}
                    </p>
                  </div>
                </div>
                {!isFastPool && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(project.id)}
                    className="text-gray-400 hover:text-red-400"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <SecondaryButton
        onClick={() => setShowProjectModal(true)}
        className="w-full"
        disabled={selectedProjects.length >= 5 || disabled}
      >
        <Plus className="h-4 w-4 mr-2" />
        {selectedProjects.filter(p => p.name !== "Fast Pool").length === 0 ? 'Select Projects' : 'Add More Projects'}
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
