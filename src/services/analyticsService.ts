import { supabase } from "../integrations/supabase/client";

interface Member {
  timestamp: string;
  blockheight: number;
  txid: string;
  amount: number;
  stacker: string;
  unlock: number;
  rewardCycle: number;
  lockingPeriod: number;
}

interface CycleData {
  cycleNumber: number;
  comment?: string;
  totalStacked: number;
  totalRewards: number;
  activeStackers: number;
  poolMembers?: Member[];
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
  private cachedData: AnalyticsData | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  async fetchAnalyticsData(): Promise<AnalyticsData> {
    // Check local cache first
    const now = Date.now();
    if (this.cachedData && now - this.cacheTimestamp < this.CACHE_TTL) {
      console.log("Returning cached analytics data");
      return this.cachedData;
    }

    try {
      console.log("Fetching fresh analytics data from edge function...");
      const { data, error } = await supabase.functions.invoke(
        "stacking-analytics"
      );

      if (error) {
        console.error("Error fetching analytics:", error);
        throw error;
      }

      this.cachedData = data;
      this.cacheTimestamp = now;

      console.log("Analytics data updated:", {
        cycles: data.cycleData?.length,
        users: data.userData?.totalUsers,
        rewards: data.rewardData?.length,
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
      // Return fallback data if edge function fails
      return this.getFallbackData();
    }
  }

  async fetchCycleData(): Promise<CycleData[]> {
    const data = await this.fetchAnalyticsData();
    return data.cycleData || [];
  }

  async fetchRewardData(): Promise<RewardData[]> {
    const data = await this.fetchAnalyticsData();
    return data.rewardData || [];
  }

  async fetchUserData(): Promise<UserData> {
    const data = await this.fetchAnalyticsData();
    return (
      data.userData || {
        totalUsers: 0,
        totalStacked: 0,
        averageStacked: 0,
        mostActiveUsers: [],
      }
    );
  }

  private getFallbackData(): AnalyticsData {
    return {
      cycleData: [
        {
          cycleNumber: 85,
          totalStacked: 125000000,
          totalRewards: 2500000,
          activeStackers: 1250,
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
    return `${rate.toFixed(2)}%`;
  }
}

export const analyticsService = new AnalyticsService();
