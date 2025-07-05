import { useEffect } from "react";
import { Project } from "@/services/projectService";
import { cartService } from "@/services/cartService";
import { projectService } from "@/services/projectService";

export const useProjectInitialization = (
  setSelectedProjects: (projects: Project[]) => void,
  enableDonation: boolean,
  setEnableDonation: (enabled: boolean) => void
) => {
  useEffect(() => {
    const cartProjects = cartService.getCartProjects();
    const fastPoolProject = projectService
      .getAllProjects()
      .find((p) => p.name === "Fast Pool");

    let projectsToSet: Project[] = [];

    // Always add Fast Pool as the first project
    if (fastPoolProject) {
      projectsToSet.push(fastPoolProject);
    }

    if (cartProjects.length > 0) {
      // Convert cart projects to Project objects, excluding Fast Pool (already added)
      const projectsFromCart = cartProjects
        .filter((cartProject) => cartProject.name !== "Fast Pool")
        .map((cartProject) => {
          const fullProject = projectService
            .getAllProjects()
            .find((p) => p.id === cartProject.id);
          return (
            fullProject || {
              id: cartProject.id,
              name: cartProject.name,
              description: cartProject.description,
              image: cartProject.image,
              totalRaised: cartProject.totalRaised,
              category: "Unknown",
              backers: 0,
              status: "approved" as const,
              creator: "Unknown",
              stxAddress: "Unknown",
              slug: cartProject.id,
            }
          );
        });
      projectsToSet.push(...projectsFromCart);
    }

    if (projectsToSet.length > 0) {
      setSelectedProjects(projectsToSet);
    }
  }, [setSelectedProjects, enableDonation, setEnableDonation]);
};
