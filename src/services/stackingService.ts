
export interface StackingData {
  id: string;
  amount: number;
  project: string;
  donationPercentage: number;
  startDate: string;
  status: 'active' | 'completed' | 'pending';
  earned: number;
  donated: number;
}

export interface UserStats {
  totalStacked: number;
  totalEarned: number;
  totalDonated: number;
  activeStacks: number;
  supportedProjects: number;
}

export interface SupportedProject {
  name: string;
  totalDonated: number;
  lastDonation: string;
}

class StackingService {
  private stackingHistory: StackingData[] = [
    {
      id: "1",
      amount: 3000,
      project: "Clean Water Initiative",
      donationPercentage: 15,
      startDate: "2024-01-10",
      status: "active",
      earned: 255.30,
      donated: 76.59
    },
    {
      id: "2",
      amount: 2000,
      project: "Education for All",
      donationPercentage: 10,
      startDate: "2024-01-05",
      status: "active",
      earned: 170.20,
      donated: 51.06
    }
  ];

  private supportedProjects: SupportedProject[] = [
    {
      name: "Clean Water Initiative",
      totalDonated: 76.59,
      lastDonation: "2024-01-15"
    },
    {
      name: "Education for All",
      totalDonated: 51.06,
      lastDonation: "2024-01-15"
    }
  ];

  getUserStats(): UserStats {
    const totalStacked = this.stackingHistory.reduce((sum, stack) => sum + stack.amount, 0);
    const totalEarned = this.stackingHistory.reduce((sum, stack) => sum + stack.earned, 0);
    const totalDonated = this.stackingHistory.reduce((sum, stack) => sum + stack.donated, 0);
    const activeStacks = this.stackingHistory.filter(stack => stack.status === 'active').length;
    const supportedProjects = this.supportedProjects.length;

    return {
      totalStacked,
      totalEarned,
      totalDonated,
      activeStacks,
      supportedProjects
    };
  }

  getStackingHistory(): StackingData[] {
    return [...this.stackingHistory];
  }

  getSupportedProjects(): SupportedProject[] {
    return [...this.supportedProjects];
  }

  createStack(stackData: Omit<StackingData, 'id' | 'earned' | 'donated'>): StackingData {
    const newStack: StackingData = {
      ...stackData,
      id: Date.now().toString(),
      earned: 0,
      donated: 0
    };

    this.stackingHistory.push(newStack);
    return newStack;
  }

  updateStack(id: string, updates: Partial<StackingData>): StackingData | null {
    const stackIndex = this.stackingHistory.findIndex(s => s.id === id);
    if (stackIndex === -1) return null;

    this.stackingHistory[stackIndex] = { ...this.stackingHistory[stackIndex], ...updates };
    return this.stackingHistory[stackIndex];
  }
}

export const stackingService = new StackingService();
