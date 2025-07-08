import { projectService } from "./projectService";

interface WhiteLabelConfig {
  logoTitle: string;
  logoSubtitle: string;
  defaultProjectSlug: string;
  defaultContributionPercentage: number;
  multiProjectsAllowed: boolean;
}

class ConfigService {
  private config: WhiteLabelConfig;

  constructor() {
    this.config = {
      logoTitle: import.meta.env.VITE_LOGO_TITLE || "Zero",
      logoSubtitle: import.meta.env.VITE_LOGO_SUBTITLE || "Authority",
      defaultProjectSlug:
        import.meta.env.VITE_DEFAULT_PROJECT_SLUG || "zero-authority-dao",
      defaultContributionPercentage:
        Number(import.meta.env.VITE_DEFAULT_CONTRIBUTION_PERCENTAGE) || 4,
      multiProjectsAllowed:
        import.meta.env.VITE_MULTI_PROJECTS_ALLOWED !== "false",
    };
  }

  getConfig(): WhiteLabelConfig {
    return this.config;
  }

  getLogoTitle(): string {
    return this.config.logoTitle;
  }

  getLogoSubtitle(): string {
    return this.config.logoSubtitle;
  }

  getDefaultProjectSlug(): string {
    return this.config.defaultProjectSlug;
  }

  getDefaultContributionPercentage(): number {
    return this.config.defaultContributionPercentage;
  }

  getMultiProjectsAllowed(): boolean {
    return this.config.multiProjectsAllowed;
  }

  getSubHeading(): string {
    return (
      import.meta.env.VITE_SUB_HEADING ||
      "Experience fast, flexible stacking with choice over your rewards. Earn in STX or sBTC, choose your impact, and join a community making a difference together."
    );
  }

  getDefaultProjectName(): string {
    return (
      projectService.getProjectBySlug(this.config.defaultProjectSlug).name ||
      "Fast Pool"
    );
  }
}

export const configService = new ConfigService();
