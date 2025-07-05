
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Calendar, Zap } from "lucide-react";
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
          <Zap className="h-4 w-4 ml-2 text-purple-400" />
        </CardTitle>
        <p className="text-sm text-gray-400">Updates are published to the Nostr network for transparency and decentralization</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {project.updates?.map((update) => (
          <div key={update.id} className="border-b border-white/10 pb-6 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">{update.title}</h3>
              <div className="flex items-center text-gray-400 text-sm space-x-3">
                {update.nostrEventId && (
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-purple-400" />
                    <span className="text-xs text-purple-400">Nostr</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(update.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <p className="text-gray-300">{update.content}</p>
            {update.nostrEventId && (
              <p className="text-xs text-gray-500 mt-2 font-mono">
                Nostr Event: {update.nostrEventId}
              </p>
            )}
          </div>
        ))}
        {(!project.updates || project.updates.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-2">No updates yet. Check back soon!</p>
            <p className="text-xs text-gray-500">All updates will be published to Nostr for transparency</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectUpdates;
