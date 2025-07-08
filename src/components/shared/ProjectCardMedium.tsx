
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project, projectService } from "@/services/projectService";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../ui/primary-button";
import { SecondaryButton } from "../ui/secondary-button";

export interface ProjectCardMediumProps {
    project: Project;
    isSelected: boolean;
    canSelect: boolean;
    readOnly: boolean;
    toggleProject: (project: Project) => void;
}

const ProjectCardMedium = ({
    project,
    isSelected,
    canSelect,
    readOnly = false,
    toggleProject
}: ProjectCardMediumProps) => {
    return <Card
        key={project.id}
        className={`
            ${readOnly ?
                "cursor-pointer bg-blue-500/20 border-blue-500"
                : isSelected
                    ? "cursor-pointer bg-orange-500/20 border-orange-500"
                    : canSelect
                        ? "cursor-pointer bg-white/5 border-white/20 hover:bg-white/10"
                        : "cursor-not-allowed bg-gray-800/50 border-gray-600 opacity-50"
            }`}
        onClick={() => canSelect && toggleProject(project)}
    >
        <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{project.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                </div>
                {isSelected && (
                    <Check className="h-5 w-5 text-orange-400 ml-2 flex-shrink-0" />
                )}
            </div>

            {project.image && (
                <div className="mb-3">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-24 object-cover rounded"
                    />
                </div>
            )}

            {!readOnly &&
                <div className="flex items-center justify-between text-sm">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {project.status}
                    </Badge>
                    {/* <span className="text-gray-400">
                      {project.totalRaised.toLocaleString()} STX raised
                    </span> */}
                </div>
            }
        </CardContent>
    </Card>
}

export default ProjectCardMedium;