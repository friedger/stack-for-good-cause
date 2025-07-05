
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Project, projectService } from "@/services/projectService";

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
  const allProjects = projectService.getAllProjects();

  const toggleProject = (project: Project) => {
    const isSelected = tempSelected.find(p => p.id === project.id);
    if (isSelected) {
      setTempSelected(tempSelected.filter(p => p.id !== project.id));
    } else if (tempSelected.length < 5) {
      setTempSelected([...tempSelected, project]);
    }
  };

  const handleSave = () => {
    onProjectsChange(tempSelected);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedProjects);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Select Projects to Support (up to 5)
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            {tempSelected.length}/5 projects selected
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 py-4">
          {allProjects.map((project) => {
            const isSelected = tempSelected.find(p => p.id === project.id);
            const canSelect = tempSelected.length < 5 || isSelected;

            return (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all ${
                  isSelected
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

                  {project.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {project.status}
                    </Badge>
                    <span className="text-gray-400">
                      {project.totalRaised.toLocaleString()} STX raised
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            Save Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSelectionModal;
