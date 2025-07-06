import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Project } from "@/services/projectService";
import { Plus, Users } from "lucide-react";
import ProjectSelectionModal from "./ProjectSelectionModal";
import ProjectContributionCard from "./ProjectContributionCard";

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
    
    const updatedProjects = selectedProjects.filter(p => p.id !== projectId);
    onSelectedProjectsChange(updatedProjects);
  };

  const handleProjectsSelected = (projects: Project[]) => {
    onSelectedProjectsChange(projects);
    setIsModalOpen(false);
  };

  // Calculate contribution amounts for each project
  const getProjectContribution = (project: Project) => {
    if (!stxAmount || !contributionPercentage) return { percentage: 0, amount: "0" };
    
    const estimatedYield = parseFloat(stxAmount) * 0.085;
    const fastPoolPercentage = 4.7;
    
    if (project.name === "Fast Pool") {
      const fastPoolAmount = (estimatedYield * fastPoolPercentage) / 100;
      return { percentage: fastPoolPercentage, amount: fastPoolAmount.toFixed(4) };
    }
    
    // Other projects share the remaining percentage equally
    const otherProjects = selectedProjects.filter(p => p.name !== "Fast Pool");
    const remainingPercentage = contributionPercentage - fastPoolPercentage;
    const percentagePerProject = otherProjects.length > 0 ? remainingPercentage / otherProjects.length : 0;
    const amountPerProject = (estimatedYield * percentagePerProject) / 100;
    
    return { percentage: percentagePerProject, amount: amountPerProject.toFixed(4) };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Selected Projects ({selectedProjects.length})
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
            const contribution = getProjectContribution(project);
            return (
              <ProjectContributionCard
                key={project.id}
                project={project}
                contributionPercentage={contribution.percentage}
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
