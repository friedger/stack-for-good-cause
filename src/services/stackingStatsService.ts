
import { walletService } from './walletService';

export interface StackingStats {
  currentlyStacked: number;
  totalEarned: number;
  totalDonated: number;
  activeStacks: number;
  supportedProjects: number;
  apr: number;
}

class StackingStatsService {
  private stats: StackingStats = {
    currentlyStacked: 0,
    totalEarned: 0,
    totalDonated: 0,
    activeStacks: 0,
    supportedProjects: 0,
    apr: 8.5
  };

  private isStacking = false;
  private stackedAmount = 0;
  private startTime: number | null = null;

  getCurrentStats(): StackingStats {
    // Update earned amount based on time elapsed if stacking
    if (this.isStacking && this.startTime) {
      const timeElapsed = (Date.now() - this.startTime) / (1000 * 60 * 60 * 24 * 365); // Years
      const earned = this.stackedAmount * (this.stats.apr / 100) * timeElapsed;
      
      this.stats.totalEarned = earned;
      this.stats.totalDonated = earned * 0.3; // Assuming 30% donation rate
    }

    return { ...this.stats };
  }

  startStacking(amount: number): void {
    this.isStacking = true;
    this.stackedAmount = amount;
    this.startTime = Date.now();
    this.stats.currentlyStacked = amount;
    this.stats.activeStacks = 1;
    this.stats.supportedProjects = 2; // Based on typical project selection
    
    console.log(`Started stacking ${amount} STX`);
  }

  stopStacking(): void {
    this.isStacking = false;
    this.stats.currentlyStacked = 0;
    this.stats.activeStacks = 0;
    
    console.log('Stopped stacking');
  }

  updateDonationStats(projectCount: number): void {
    this.stats.supportedProjects = projectCount;
  }

  isCurrentlyStacking(): boolean {
    return this.isStacking;
  }

  getStackedAmount(): number {
    return this.stackedAmount;
  }
}

export const stackingStatsService = new StackingStatsService();
