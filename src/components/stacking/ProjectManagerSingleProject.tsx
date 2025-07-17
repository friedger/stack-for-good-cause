import { configService } from "@/services/configService";
import { projectService } from "@/services/projectService";
import { useNavigate } from "react-router-dom";
import ProjectCardMedium from "../shared/ProjectCardMedium";

interface ProjectManagerSingleProjectProps {
  selectedProjects?: any[];
  onSelectedProjectsChange?: (projects: any[]) => void;
  disabled?: boolean;
  stxAmount?: string;
  contributionPercentage?: number;
  rewardType?: string;
}

const ProjectManagerSingleProject = ({
  selectedProjects,
  onSelectedProjectsChange,
  disabled,
  stxAmount,
  contributionPercentage,
  rewardType
}: ProjectManagerSingleProjectProps) => {
  const navigate = useNavigate();

  const project = projectService.getProjectBySlug(configService.getDefaultProjectSlug());

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 gap-3">
        <ProjectCardMedium
          key={project.id}
          project={project}
          isSelected={false}
          canSelect={true}
          toggleProject={() => { navigate(`/projects/${project.slug}`) }}
          readOnly={true}
        />
      </div>
    </div>
  );
};

export default ProjectManagerSingleProject;
