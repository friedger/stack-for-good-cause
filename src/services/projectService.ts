import { nostrService } from "./nostrService";
import { Project, CreateProjectData } from "./projectCore";
import { curatedProjects } from "./projectData";

class ProjectService {
  private projects: Project[] = [...curatedProjects];

  getAllProjects(): Project[] {
    return [...this.projects];
  }

  getProjectBySlug(slug: string): Project | null {
    return this.projects.find((project) => project.slug === slug) || null;
  }

  async createProject(projectData: CreateProjectData): Promise<Project> {
    const slug = projectData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name,
      description: projectData.description,
      category: projectData.category,
      totalRaised: 0,
      backers: 0,
      status: "pending",
      creator: "You",
      stxAddress: "SP1HJBQZK2FKSC9W8JZX6VXNW3KDF2GDG5GR6XQG1", // Default STX address for new projects
      image: projectData.image
        ? URL.createObjectURL(projectData.image)
        : "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop",
      slug: slug,
    };

    this.projects.push(newProject);

    // Announce the project on Nostr
    try {
      await nostrService.announceProject(
        newProject.name,
        newProject.description,
        newProject.id
      );
      console.log("Project announced on Nostr successfully");
    } catch (error) {
      console.error("Failed to announce project on Nostr:", error);
    }

    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projectIndex = this.projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) return null;

    this.projects[projectIndex] = {
      ...this.projects[projectIndex],
      ...updates,
    };
    return this.projects[projectIndex];
  }

  async addProjectUpdate(
    projectId: string,
    title: string,
    content: string
  ): Promise<boolean> {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return false;

    try {
      // Publish update to Nostr
      const nostrUpdate = await nostrService.publishUpdate({
        title,
        content,
        projectId,
        author: project.creator,
        tags: ["project-update", project.category.toLowerCase()],
      });

      // Add update to project
      if (!project.updates) {
        project.updates = [];
      }

      project.updates.unshift({
        id: nostrUpdate.id,
        title: nostrUpdate.title,
        content: nostrUpdate.content,
        date: nostrUpdate.date,
        nostrEventId: nostrUpdate.nostrEventId,
      });

      console.log("Project update published to Nostr and added to project");
      return true;
    } catch (error) {
      console.error("Failed to publish project update:", error);
      return false;
    }
  }

  getUserProjects(creator: string): Project[] {
    return this.projects.filter((project) => project.creator === creator);
  }
}

export const projectService = new ProjectService();
export type { Project, CreateProjectData } from "./projectCore";
