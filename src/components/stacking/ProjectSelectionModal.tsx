
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project, projectService } from "@/services/projectService";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../ui/primary-button";
import { SecondaryButton } from "../ui/secondary-button";

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
            const isSelected = tempSelected.find(p => p.id === project.id);
            const canSelect = selectedCountExcludingFastPool < 4 || isSelected;

            return (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all ${isSelected
                  ? "bg-orange-500/20 border-orange-500"
                  : canSelect
                    ? "bg-white/5 border-white/20 hover:bg-white/10"
                    : "bg-gray-800/50 border-gray-600 opacity-50 cursor-not-allowed"
                  }`}
                onClick={() => canSelect && toggleProject(project)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{project.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-orange-400 ml-2 flex-shrink-0" />
                    )}
                  </div>

                  {project.image && (
                    <div className="mb-3">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {project.status}
                    </Badge>
                    {/* <span className="text-gray-400">
                      {project.totalRaised.toLocaleString()} STX raised
                    </span> */}
                  </div>
                </CardContent>
              </Card>
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
