
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project, projectService } from "@/services/projectService";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../ui/primary-button";
import { SecondaryButton } from "../ui/secondary-button";
import ProjectCardMedium from "../shared/ProjectCardMedium";

interface ProjectSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProjects: Project[];
  onProjectsChange: (projects: Project[]) => void;
}

const ProjectSelectionModal = ({
  open,
  onOpenChange,
  selectedProjects,
  onProjectsChange
}: ProjectSelectionModalProps) => {
  const [tempSelected, setTempSelected] = useState<Project[]>(selectedProjects);

  // Filter out pending projects and Fast Pool (since it's always included)
  const availableProjects = projectService.getAllProjects().filter(
    project => project.status === "approved" && project.name !== "Fast Pool"
  );

  // Update temp selection when modal opens or selectedProjects change
  useEffect(() => {
    if (open) {
      setTempSelected(selectedProjects);
    }
  }, [open, selectedProjects]);

  const toggleProject = (project: Project) => {
    const isSelected = tempSelected.find(p => p.id === project.id);
    if (isSelected) {
      setTempSelected(tempSelected.filter(p => p.id !== project.id));
    } else if (tempSelected.length < 5) {
      setTempSelected([...tempSelected, project]);
    }
  };

  const handleSave = () => {
    // Always ensure Fast Pool is included as the first project
    const fastPoolProject = projectService.getAllProjects().find(p => p.name === "Fast Pool");
    const otherProjects = tempSelected.filter(p => p.name !== "Fast Pool");
    const finalSelection = fastPoolProject ? [fastPoolProject, ...otherProjects] : otherProjects;

    onProjectsChange(finalSelection);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedProjects);
    onOpenChange(false);
  };

  // Count projects excluding Fast Pool for the limit
  const selectedCountExcludingFastPool = tempSelected.filter(p => p.name !== "Fast Pool").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Select Projects to Support (up to 4 additional)
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            {selectedCountExcludingFastPool}/4 additional projects selected (Fast Pool is always included)
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 py-4">
          {availableProjects.map((project) => {
            const isSelected = Boolean(tempSelected.find(p => p.id === project.id));
            const canSelect = selectedCountExcludingFastPool < 4 || isSelected;

            return (
              <ProjectCardMedium key={project.id}
                project={project}
                isSelected={isSelected}
                canSelect={canSelect}
              />
            );
          })}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <SecondaryButton onClick={handleCancel}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleSave} >
            Save Selection
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSelectionModal;
