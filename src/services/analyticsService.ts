import { supabase } from "../integrations/supabase/client";

export interface Member {
  timestamp: string;
  blockheight: number;
  txid: string;
  amount: number;
  stacker: string;
  unlock: number;
  rewardCycle: number;
  lockingPeriod: number;
}

export interface CycleData {
  cycle: number;
  cycleStart: number;
  cycleRewardsEnd: number;
  stacksCycleStart: number;
  stacksCycleRewardsEnd: number;
  cycleStartDate: string;
  cycleRewardsEndDate: string;
  stxPriceAtEnd: number;
  btcPriceAtEnd: number;
  btcRewards: number;
  fastPoolV1: number;
  fastPoolV2: number;
  totalStacked: string;
  rewardsUsd: number;
  blockRewardsUsd: number;
  stackedUsd: number;
  cycleYield: number;
  apy: number;
  threshold: number;
}

export interface RewardData {
  filename: string;
  [key: string]: any;
}

export interface UserData {
  totalUsers: number;
  totalStacked: number;
  averageStacked: number;
  mostActiveUsers: Array<{
    address: string;
    totalStacked: number;
    cyclesParticipated: number;
    lastActiveDate: string;
  }>;
}

export interface AnalyticsData {
  cycleData: CycleData[];
  userData: UserData;
  rewardData: RewardData[];
  lastUpdated: string;
}

class AnalyticsService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes for JSON files

  private async fetchJsonData(filename: string): Promise<any> {
    const cacheKey = filename;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.CACHE_TTL) {
      console.log(`Returning cached data for ${filename}`);
      return cached.data;
    }

    try {
      console.log(`Fetching fresh data from ${filename}...`);
      const response = await fetch(`/data/${filename}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: now });
      
      console.log(`Data updated from ${filename}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${filename}:`, error);
      // Return cached data if available, otherwise fallback
      return cached?.data || this.getFallbackDataForFile(filename);
    }
  }

  async fetchAnalyticsData(): Promise<AnalyticsData> {
    const [overview, cycles, rewards, users] = await Promise.all([
      this.fetchJsonData('overview.json'),
      this.fetchJsonData('cycles.json'),
      this.fetchJsonData('rewards.json'),
      this.fetchJsonData('users.json')
    ]);

    return {
      cycleData: cycles.cycles || [],
      userData: users.summary || this.getFallbackData().userData,
      rewardData: rewards.recentDistributions || [],
      lastUpdated: overview.lastUpdated || new Date().toISOString()
    };
  }

  async fetchCycleData(): Promise<CycleData[]> {
    const data = await this.fetchJsonData('cycles.json');
    return data.cycles || [];
  }

  async fetchRewardData(): Promise<RewardData[]> {
    const data = await this.fetchJsonData('rewards.json');
    return data.recentDistributions || [];
  }

  async fetchUserData(): Promise<UserData> {
    const data = await this.fetchJsonData('users.json');
    return data.summary || {
      totalUsers: 0,
      totalStacked: 0,
      averageStacked: 0,
      mostActiveUsers: [],
    };
  }

  async fetchOverviewData(): Promise<any> {
    return this.fetchJsonData('overview.json');
  }

  private getFallbackData(): AnalyticsData {
    return {
      cycleData: [
        {
          cycle: 85,
          cycleStart: 0,
          cycleRewardsEnd: 0,
          stacksCycleStart: 0,
          stacksCycleRewardsEnd: 0,
          cycleStartDate: "",
          cycleRewardsEndDate: "",
          stxPriceAtEnd: 0,
          btcPriceAtEnd: 0,
          btcRewards: 0,
          fastPoolV1: 0,
          fastPoolV2: 0,
          totalStacked: "125000000000000",
          rewardsUsd: 2500000,
          blockRewardsUsd: 0,
          stackedUsd: 0,
          cycleYield: 0,
          apy: 0,
          threshold: 0,
        },
      ],
      userData: {
        totalUsers: 1250,
        totalStacked: 125000000,
        averageStacked: 100000,
        mostActiveUsers: [],
      },
      rewardData: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  private getFallbackDataForFile(filename: string): any {
    const fallbacks: Record<string, any> = {
      'overview.json': {
        summary: { totalStacked: 0, totalRewards: 0, activeStackers: 0 },
        recentCycles: [],
        trends: { stackedGrowth: 0, stackersGrowth: 0, rewardsGrowth: 0 }
      },
      'cycles.json': { cycles: [] },
      'rewards.json': { recentDistributions: [] },
      'users.json': { 
        summary: { totalUsers: 0, totalStacked: 0, averageStacked: 0, mostActiveUsers: [] }
      }
    };
    return fallbacks[filename] || {};
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
  }

  formatSTX(amount: number): string {
    return `${this.formatNumber(Math.round(amount))} STX`;
  }

  formatBTC(amount: number): string {
    return `${amount.toFixed(8)} BTC`;
  }

  formatPercentage(rate: number): string {
    return `${(rate || 0).toFixed(2)}%`;
  }
}

export const analyticsService = new AnalyticsService();
