
import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { PrimaryButton } from "@/components/ui/primary-button";
import Logo from "@/components/Logo";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import { projectService } from "@/services/projectService";

const Projects = () => {
  const [projects, setProjects] = useState(projectService.getAllProjects());

  const handleProjectCreated = () => {
    setProjects(projectService.getAllProjects());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-6">
            <Link to="/app" className="text-white hover:text-orange-400 transition-colors">
              App
            </Link>
            <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
              Dashboard
            </Link>
            <CreateProjectDialog onProjectCreated={handleProjectCreated} />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Projects Making a Difference
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to create a project and make a difference!</p>
              <CreateProjectDialog onProjectCreated={handleProjectCreated} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
