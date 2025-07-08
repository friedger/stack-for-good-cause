
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import ProjectCard from "@/components/projects/ProjectCard";
import { Card, CardContent } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { projectService } from "@/services/projectService";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";

const onboardingOpen = true;

const Projects = () => {
  const [projects, setProjects] = useState(projectService.getAllProjects());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleProjectCreated = () => {
    setProjects(projectService.getAllProjects());
    setIsCreateDialogOpen(false);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
            Projects Making a Difference
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {onboardingOpen &&
              <>
                {/* Empty Project Card */}
                <Card
                  className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer border-dashed"

                  onClick={handleOpenCreateDialog}
                >
                  <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-700/20 flex items-center justify-center">
                      <Plus className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Suggest a New Project
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Have an idea for a project that could make a difference? Share it with the community!
                      </p>
                      <PrimaryButton disabled size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </PrimaryButton>
                    </div>
                  </CardContent>
                </Card>
              </>
            }
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6 px-4">Be the first to create a project and make a difference!</p>
              <PrimaryButton
                onClick={handleOpenCreateDialog}
              >
                Create Project
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
};

export default Projects;
