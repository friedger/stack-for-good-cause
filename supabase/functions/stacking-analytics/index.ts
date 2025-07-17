import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

interface UserData {
  address: string;
  totalStacked: number;
  cyclesParticipated: number;
  lastActiveDate: string;
}

interface AnalyticsResponse {
  cycleData: CycleData[];
  userData: {
    totalUsers: number;
    totalStacked: number;
    averageStacked: number;
    mostActiveUsers: UserData[];
  };
  rewardData: any[];
  lastUpdated: string;
}

// Cache with 2-week TTL (data updates bi-weekly)
const CACHE_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
let cachedData: AnalyticsResponse | null = null;
let cacheTimestamp = 0;

async function fetchGitHubDirectory(path: string): Promise<string[]> {
  const apiUrl = `https://api.github.com/repos/friedger/stacking/contents/${path}`;
  console.log(`Fetching directory: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Supabase-Edge-Function",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();
    return files
      .filter(
        (file: any) => file.type === "file" && file.name.endsWith(".json")
      )
      .map((file: any) => file.name);
  } catch (error) {
    console.error(`Error fetching directory ${path}:`, error);
    return [];
  }
}

async function fetchJsonFile(path: string): Promise<any> {
  const rawUrl = `https://raw.githubusercontent.com/friedger/stacking/main/${path}`;
  console.log(`Fetching file: ${rawUrl}`);

  try {
    const response = await fetch(rawUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error);
    return null;
  }
}

async function aggregateCycleData(): Promise<CycleData[]> {
  console.log("Aggregating cycle data...");
  const cycleFiles = await fetchGitHubDirectory("packages/home/data/cycles");
  const cycleData: CycleData[] = [];

  // Process cycles in batches to avoid overwhelming the API
  const batchSize = 5;
  for (let i = 0; i < cycleFiles.length; i += batchSize) {
    const batch = cycleFiles.slice(i, i + batchSize);
    const batchPromises = batch.map(async (filename) => {
      const cycleNumber = parseInt(
        filename.replace("members-", "").replace(".json", "")
      );
      const data = await fetchJsonFile(`packages/home/data/cycles/${filename}`);

      if (data) {
        return {
          cycleNumber: data.cycle,
          comment: data.comment || "",
          totalStacked: data.totalStacked || 0,
          totalRewards: data.totalRewards || 0,
          activeStackers: data.poolMembers?.length || 0,
          poolMembers: data.poolMembers || [],
        };
      }
      return null;
    });

    const batchResults = await Promise.all(batchPromises);
    cycleData.push(...(batchResults.filter(Boolean) as CycleData[]));

    // Small delay between batches to be respectful to GitHub API
    if (i + batchSize < cycleFiles.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return cycleData.sort((a, b) => b.cycleNumber - a.cycleNumber);
}

async function aggregateUserData(): Promise<{
  totalUsers: number;
  totalStacked: number;
  averageStacked: number;
  mostActiveUsers: UserData[];
}> {
  console.log("Aggregating user data...");
  const userFiles = await fetchGitHubDirectory("packages/home/data/users");

  const userStats = new Map<
    string,
    {
      totalStacked: number;
      cyclesParticipated: number;
      lastActiveDate: string;
    }
  >();

  let totalStacked = 0;

  // Process users in smaller batches
  const batchSize = 10;
  for (let i = 0; i < Math.min(userFiles.length, 100); i += batchSize) {
    // Limit to first 100 users for performance
    const batch = userFiles.slice(i, i + batchSize);
    const batchPromises = batch.map(async (filename) => {
      const address = filename.replace(".json", "");
      const data = await fetchJsonFile(`packages/home/data/users/${filename}`);

      if (data && data.stackingHistory) {
        const userTotalStacked = data.stackingHistory.reduce(
          (sum: number, cycle: any) => sum + (cycle.amount || 0),
          0
        );
        const cyclesParticipated = data.stackingHistory.length;
        const lastActiveDate =
          data.stackingHistory[data.stackingHistory.length - 1]?.date || "";

        userStats.set(address, {
          totalStacked: userTotalStacked,
          cyclesParticipated,
          lastActiveDate,
        });

        totalStacked += userTotalStacked;
      }
    });

    await Promise.all(batchPromises);

    // Small delay between batches
    if (i + batchSize < Math.min(userFiles.length, 100)) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  // Get most active users
  const mostActiveUsers = Array.from(userStats.entries())
    .map(([address, stats]) => ({
      address,
      ...stats,
    }))
    .sort((a, b) => b.totalStacked - a.totalStacked)
    .slice(0, 10);

  return {
    totalUsers: userStats.size,
    totalStacked,
    averageStacked: totalStacked / Math.max(userStats.size, 1),
    mostActiveUsers,
  };
}

async function fetchRewardData(): Promise<any[]> {
  console.log("Fetching reward data...");
  const rewardFiles = await fetchGitHubDirectory(
    "packages/home/content/rewards"
  );
  const rewardData: any[] = [];

  // Process first 10 reward files
  const limitedFiles = rewardFiles.slice(0, 10);
  for (const filename of limitedFiles) {
    const data = await fetchJsonFile(
      `packages/home/content/rewards/${filename}`
    );
    if (data) {
      rewardData.push({
        filename: filename.replace(".json", ""),
        ...data,
      });
    }
  }

  return rewardData;
}

async function generateAnalytics(): Promise<AnalyticsResponse> {
  console.log("Starting analytics generation...");

  const [cycleData, userData, rewardData] = await Promise.all([
    aggregateCycleData(),
    aggregateUserData(),
    fetchRewardData(),
  ]);

  console.log(
    `Generated analytics: ${cycleData.length} cycles, ${userData.totalUsers} users`
  );

  return {
    cycleData,
    userData,
    rewardData,
    lastUpdated: new Date().toISOString(),
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Stacking analytics request received");

    // Check cache
    const now = Date.now();
    if (cachedData && now - cacheTimestamp < CACHE_TTL) {
      console.log("Returning cached data");
      return new Response(JSON.stringify(cachedData), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400", // 24 hours browser cache
        },
      });
    }

    // Generate fresh analytics
    console.log("Generating fresh analytics data...");
    const analytics = await generateAnalytics();

    // Update cache
    cachedData = analytics;
    cacheTimestamp = now;

    return new Response(JSON.stringify(analytics), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400", // 24 hours browser cache
      },
    });
  } catch (error) {
    console.error("Error in stacking-analytics function:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate analytics",
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
