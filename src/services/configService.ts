
interface WhiteLabelConfig {
  logoTitle: string;
  logoSubtitle: string;
  defaultProjectSlug: string;
  defaultContributionPercentage: number;
  showProjectsInHeader: boolean;
}

class ConfigService {
  private config: WhiteLabelConfig;

  constructor() {
    this.config = {
      logoTitle: import.meta.env.VITE_LOGO_TITLE || "Zero",
      logoSubtitle: import.meta.env.VITE_LOGO_SUBTITLE || "Authority",
      defaultProjectSlug: import.meta.env.VITE_DEFAULT_PROJECT_SLUG || "zero-authority-dao",
      defaultContributionPercentage: Number(import.meta.env.VITE_DEFAULT_CONTRIBUTION_PERCENTAGE) || 4,
      showProjectsInHeader: import.meta.env.VITE_SHOW_PROJECTS_IN_HEADER !== "false",
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

  shouldShowProjectsInHeader(): boolean {
    return this.config.showProjectsInHeader;
  }
}

export const configService = new ConfigService();
