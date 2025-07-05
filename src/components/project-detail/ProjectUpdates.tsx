
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Calendar } from "lucide-react";
import { Project } from "@/services/projectService";

interface ProjectUpdatesProps {
  project: Project;
}

const ProjectUpdates = ({ project }: ProjectUpdatesProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Project Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {project.updates?.map((update) => (
          <div key={update.id} className="border-b border-white/10 pb-6 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">{update.title}</h3>
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(update.date).toLocaleDateString()}
              </div>
            </div>
            <p className="text-gray-300">{update.content}</p>
          </div>
        ))}
        {(!project.updates || project.updates.length === 0) && (
          <p className="text-gray-400 text-center py-8">No updates yet. Check back soon!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectUpdates;
