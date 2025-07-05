
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { projectService, type CreateProjectData } from "@/services/projectService";

interface CreateProjectDialogProps {
  onProjectCreated: () => void;
}

const CreateProjectDialog = ({ onProjectCreated }: CreateProjectDialogProps) => {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    category: "",
    image: null as File | null
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.description || !newProject.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all project details.",
        variant: "destructive",
      });
      return;
    }

    const createData: CreateProjectData = {
      name: newProject.name,
      description: newProject.description,
      category: newProject.category,
      image: newProject.image
    };

    projectService.createProject(createData);
    onProjectCreated();
    setNewProject({ name: "", description: "", category: "", image: null });
    setIsDialogOpen(false);

    toast({
      title: "Project Submitted!",
      description: "Your project has been submitted for admin approval.",
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <PrimaryButton>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </PrimaryButton>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <Label htmlFor="project-category">Category</Label>
            <Input
              id="project-category"
              value={newProject.category}
              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="e.g., Education, Environment, Technology"
            />
          </div>
          <div>
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Describe your project and its impact"
              rows={4}
            />
          </div>
          <ImageUpload
            onImageSelect={(file) => setNewProject({ ...newProject, image: file })}
          />
          <PrimaryButton onClick={handleCreateProject} className="w-full">
            Submit for Approval
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
