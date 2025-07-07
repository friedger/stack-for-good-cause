import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Project } from "@/services/projectService";
import { Plus, Users } from "lucide-react";
import ProjectSelectionModal from "./ProjectSelectionModal";
import ProjectContributionCard from "./ProjectContributionCard";
import { cartService } from "@/services/cartService";

interface ProjectManagerProps {
  selectedProjects: Project[];
  onSelectedProjectsChange: (projects: Project[]) => void;
  disabled?: boolean;
  stxAmount?: string;
  contributionPercentage?: number;
  rewardType?: string;
}

const ProjectManager = ({
  selectedProjects,
  onSelectedProjectsChange,
  disabled,
  stxAmount,
  contributionPercentage,
  rewardType
}: ProjectManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const removeProject = (projectId: string) => {
    const fastPoolProject = selectedProjects.find(p => p.name === "Fast Pool");
    if (fastPoolProject && fastPoolProject.id === projectId) {
      return; // Don't allow removing Fast Pool
    }

    // Remove from cart service (localStorage)
    cartService.removeProject(projectId);

    // Update local state
    const updatedProjects = selectedProjects.filter(p => p.id !== projectId);
    onSelectedProjectsChange(updatedProjects);
  };

  const handleProjectsSelected = (projects: Project[]) => {
    // Sync with cart service - add new projects and remove deselected ones
    const currentProjectIds = selectedProjects.map(p => p.id);
    const newProjectIds = projects.map(p => p.id);

    // Remove projects that were deselected (excluding Fast Pool)
    currentProjectIds.forEach(projectId => {
      const project = selectedProjects.find(p => p.id === projectId);
      if (project && project.name !== "Fast Pool" && !newProjectIds.includes(projectId)) {
        cartService.removeProject(projectId);
      }
    });

    // Add newly selected projects (excluding Fast Pool)
    projects.forEach(project => {
      if (project.name !== "Fast Pool" && !currentProjectIds.includes(project.id)) {
        cartService.addProject({
          id: project.id,
          name: project.name,
          description: project.description,
          image: project.image,
          totalRaised: project.totalRaised
        });
      }
    });

    onSelectedProjectsChange(projects);
    setIsModalOpen(false);
  };

  // Calculate contribution amounts for each project
  const getProjectContribution = () => {
    if (!stxAmount || !contributionPercentage) return { shareInPromille: 0, amount: "0" };

    const estimatedYield = parseFloat(stxAmount) * 0.095; // TODO use yield service

    const promillePerProject = selectedProjects.length > 0 ? Math.floor(contributionPercentage * 10 / selectedProjects.length) : 0;
    const amountPerProject = (estimatedYield * promillePerProject) / 1000;

    return { shareInPromille: promillePerProject, amount: amountPerProject.toFixed(4) };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Projects ({selectedProjects.length})
        </h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Projects
        </Button>
      </div>

      {selectedProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No projects selected</p>
          <p className="text-sm">Add projects to support with your contributions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {selectedProjects.map((project) => {
            const contribution = getProjectContribution();
            return (
              <ProjectContributionCard
                key={project.id}
                project={project}
                shareInPromille={contribution.shareInPromille}
                estimatedContribution={contribution.amount}
                rewardType={rewardType}
                onRemove={() => removeProject(project.id)}
                showRemoveButton={true}
              />
            );
          })}
        </div>
      )}

      <ProjectSelectionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedProjects={selectedProjects}
        onProjectsChange={handleProjectsSelected}
      />
    </div>
  );
};

export default ProjectManager;
