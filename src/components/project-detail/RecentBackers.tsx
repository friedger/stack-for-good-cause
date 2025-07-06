
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Project } from "@/services/projectService";

interface RecentBackersProps {
  project: Project;
}
const enabled = false; // enabled when backend is ready

const RecentBackers = ({ project }: RecentBackersProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Recent Backers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabled ?
          (<>
            {project.backersList?.slice(0, 5).map((backer) => (
              <div key={backer.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-white">{backer.name}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(backer.date).toLocaleDateString()}
                  </div>
                  {backer.message && (
                    <div className="text-sm text-gray-300 mt-1 italic">
                      "{backer.message}"
                    </div>
                  )}
                </div>
                <div className="text-green-400 font-semibold">
                  {backer.amount} STX
                </div>
              </div>
            ))}
            {(!project.backersList || project.backersList.length === 0) && (
              <p className="text-gray-400 text-center py-4">Be the first to support this project!</p>
            )}
          </>
          ) :
          (
            <p className="text-gray-400 text-center py-4">Coming soon!</p>
          )}

      </CardContent>
    </Card>
  );
};

export default RecentBackers;
