import { nostrService, NostrUpdate } from "./nostrService";

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  totalRaised: number;
  backers: number;
  status: "approved" | "pending";
  creator: string;
  image: string;
  slug: string;
  fullDescription?: string;
  updates?: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    nostrEventId?: string;
  }>;
  backersList?: Array<{
    id: string;
    name: string;
    amount: number;
    date: string;
    message?: string;
  }>;
}

export interface CreateProjectData {
  name: string;
  description: string;
  category: string;
  image: File | null;
}

class ProjectService {
  private projects: Project[] = [
    {
      id: "1",
      name: "Fast Pool",
      description: "Your contribution keeps the Fast Pool signer running.",
      fullDescription:
        "Fast Pool is the oldest and most trustless Stacking pool. ",
      category: "Infrastructure",
      totalRaised: 2450.75,
      backers: 23,
      status: "approved",
      creator: "FastPool",
      image:
        "https://images.unsplash.com/photo-1563209304-83decde702ce?w=400&h=250&fit=crop",
      slug: "fast-pool",
      updates: [
        {
          id: "1",
          title: "First Well Completed!",
          content:
            "We're excited to announce that our first well has been completed in Rural Village A. The community now has access to clean water for the first time in decades!",
          date: "2024-01-15",
          nostrEventId: "nostr_1704902400000_abc123def",
        },
        {
          id: "2",
          title: "Community Training Program Launched",
          content:
            "We've started training local community members on well maintenance and water conservation practices to ensure long-term sustainability.",
          date: "2024-01-10",
          nostrEventId: "nostr_1704470400000_xyz789ghi",
        },
      ],
      backersList: [
        {
          id: "1",
          name: "Alice Chen",
          amount: 500,
          date: "2024-01-20",
          message: "Amazing work! Keep it up!",
        },
        {
          id: "2",
          name: "Bob Smith",
          amount: 250,
          date: "2024-01-19",
          message: "Proud to support this cause.",
        },
        { id: "3", name: "Carol Davis", amount: 100, date: "2024-01-18" },
        {
          id: "4",
          name: "David Wilson",
          amount: 75,
          date: "2024-01-17",
          message: "Every drop counts!",
        },
      ],
    },
    {
      id: "2",
      name: "Smart Wallet",
      description:
        "Personal Wallets as Smart Contracts for more security and less worries.",
      fullDescription:
        "Smart Wallets are smart contracts that hold your assets. You controll them with your hot account and define your spending limits, inheritance, and subscriptions.",
      category: "Infrastructure",
      totalRaised: 1825.3,
      backers: 18,
      status: "approved",
      creator: "EduGlobal",
      image:
        "https://images.unsplash.com/photo-1578912084730-23a3182cdf27?w=400&h=250&fit=crop",
      slug: "smart-wallet",
      updates: [
        {
          id: "1",
          title: "New School Building Progress",
          content:
            "Construction of our third school building is 60% complete. We're on track to open by the end of next month!",
          date: "2024-01-12",
        },
      ],
      backersList: [
        {
          id: "1",
          name: "Emma Johnson",
          amount: 300,
          date: "2024-01-16",
          message: "Education changes everything!",
        },
        { id: "2", name: "Frank Miller", amount: 200, date: "2024-01-15" },
      ],
    },
    {
      id: "3",
      name: "Zero Authority DAO",
      description: "A platform created by creators for creators.",
      fullDescription:
        "Our vision is to create a trustless, permissionless gig marketplace for Web3 creators and builders to succeed.",
      category: "funding",
      totalRaised: 3200.45,
      backers: 31,
      status: "approved",
      creator: "Zero",
      image:
        "https://images.unsplash.com/photo-1725383219768-aecec2f1c1d5?w=400&h=250&fit=crop",
      slug: "zero-authority-dao",
      updates: [
        {
          id: "1",
          title: "Solar Panel Installation Complete",
          content:
            "We've successfully installed 50 solar panels across 10 homes in the community. Families are now enjoying clean, renewable energy!",
          date: "2024-01-18",
        },
      ],
      backersList: [
        {
          id: "1",
          name: "Grace Lee",
          amount: 1000,
          date: "2024-01-20",
          message: "The future is renewable!",
        },
        { id: "2", name: "Henry Brown", amount: 500, date: "2024-01-19" },
      ],
    },
    {
      id: "4",
      name: "TxInfo",
      description: "Add metadata to any blockchain transaction using Nostr.",
      category: "Infrastructure",
      totalRaised: 0,
      backers: 0,
      status: "pending",
      creator: "OpenCollective",
      image:
        "https://images.unsplash.com/photo-1526841803814-753ac32aa9e2?w=400&h=250&fit=crop",
      slug: "tx-info",
    },
  ];

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

  async shareStackingImpact(
    stxAmount: string,
    selectedProjects: Project[],
    rewardType: string
  ): Promise<void> {
    if (selectedProjects.length === 0) return;

    try {
      const projectNames = selectedProjects.map((p) => p.name);
      await nostrService.shareStackingImpact(
        stxAmount,
        projectNames,
        rewardType
      );
      console.log("Stacking impact shared on Nostr successfully");
    } catch (error) {
      console.error("Failed to share stacking impact on Nostr:", error);
    }
  }
}

export const projectService = new ProjectService();
