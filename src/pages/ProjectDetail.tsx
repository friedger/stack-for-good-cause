
import ProjectHeader from "@/components/project-detail/ProjectHeader";
import ProjectStats from "@/components/project-detail/ProjectStats";
import ProjectUpdates from "@/components/project-detail/ProjectUpdates";
import RecentBackers from "@/components/project-detail/RecentBackers";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { projectService, type Project } from "@/services/projectService";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
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


    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/projects" className="inline-flex items-center text-white hover:text-purple-400 transition-colors mb-8">
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
  );
};

export default ProjectDetail;
