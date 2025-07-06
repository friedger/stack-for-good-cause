
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/services/projectService";
import { getStatusBadge } from "../projects/ProjectCard";

interface ProjectStatsProps {
  project: Project;
}

const enabled = false; // enabled when backend is ready
const ProjectStats = ({ project }: ProjectStatsProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Project Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabled && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">Average Contribution</span>
              <span className="text-white font-semibold">
                {project.backers > 0 ? (project.totalRaised / project.backers).toFixed(2) : '0'} STX
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Backers</span>
              <span className="text-white font-semibold">{project.backers}</span>
            </div>
          </>)}
        < div className="flex justify-between">
          <span className="text-gray-400">Project Status</span>
          {getStatusBadge(project)}
        </div>
      </CardContent>
    </Card >
  );
};

export default ProjectStats;
