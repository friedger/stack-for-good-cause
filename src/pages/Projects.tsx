
import { useState } from "react";
import { Heart } from "lucide-react";
import Header from "@/components/Header";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import { projectService } from "@/services/projectService";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header showCreateProject onCreateProject={handleOpenCreateDialog} />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
            Projects Making a Difference
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6 px-4">Be the first to create a project and make a difference!</p>
              <button
                onClick={handleOpenCreateDialog}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
              >
                Create Project
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateProjectDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onProjectCreated={handleProjectCreated} 
      />
    </div>
  );
};

export default Projects;
