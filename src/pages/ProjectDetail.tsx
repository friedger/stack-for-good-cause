
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import Logo from "@/components/Logo";
import ProjectHeader from "@/components/project-detail/ProjectHeader";
import ProjectUpdates from "@/components/project-detail/ProjectUpdates";
import RecentBackers from "@/components/project-detail/RecentBackers";
import ProjectStats from "@/components/project-detail/ProjectStats";
import { projectService, type Project } from "@/services/projectService";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (slug) {
      const foundProject = projectService.getProjectBySlug(slug);
      setProject(foundProject);

      // Update page meta tags for SEO
      if (foundProject) {
        document.title = `${foundProject.name} - FastPool`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', foundProject.description);
        }

        // Update OG tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', `${foundProject.name} - FastPool`);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', foundProject.description);
        }

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', foundProject.image);
        }
      }
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects">
            <SecondaryButton>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </SecondaryButton>
          </Link>
        </div>
      </div>
    );
  }

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
            <Link to="/projects" className="text-white hover:text-orange-400 transition-colors">
              Projects
            </Link>
            <Link to="/dashboard" className="text-white hover:text-orange-400 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link to="/projects" className="inline-flex items-center text-white hover:text-orange-400 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>

          <ProjectHeader project={project} />

          {/* Project Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <ProjectUpdates project={project} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <RecentBackers project={project} />
              <ProjectStats project={project} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
