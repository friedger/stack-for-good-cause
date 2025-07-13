import {
  Client,
  createClient,
  OperationResponse,
} from "@stacks/blockchain-api-client";
import { paths } from "@stacks/blockchain-api-client/lib/generated/schema";
import {
  BufferCV,
  ClarityValue,
  cvToJSON,
  cvToString,
  hexToCV,
  ListCV,
  PrincipalCV,
  stringAsciiCV,
  StringAsciiCV,
  TupleCV,
  UIntCV,
} from "@stacks/transactions";
import { useCallback, useRef, useState } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
    : null;

const multiPoolContract =
  "SPMPMA1V6P430M8C91QS1G9XJ95S59JS1TZFZ4Q4.pox4-multi-pool-v1";

interface PoolMemberData {
  pool_member_id: string;
  currency: string;
  p_entries: string[];
  r_entries: number[];
  v_value: number;
  tx_id: string;
  event_index: number;
  block_height: number;
  tx_index: number;
  created_at?: string;
  updated_at?: string;
}

interface LatestEventInfo {
  block_height: number;
  tx_index: number;
  event_index: number;
}

export const useMultiPoolMembers = () => {
  const [users, setUsers] = useState<any | null>(null);
  const [isWritingToSupabase, setIsWritingToSupabase] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [lastSyncInfo, setLastSyncInfo] = useState<{
    timestamp: string;
    eventsProcessed: number;
  } | null>(null);

  // Lazy API client creation
  const apiClientRef = useRef<Client<paths>>(null);
  const getApiClient = useCallback(() => {
    if (!apiClientRef.current) {
      apiClientRef.current = createClient();
    }
    return apiClientRef.current;
  }, []);

  const batchFetchTransactions = useCallback(
    async (txIds: string[]) => {
      const apiClient = getApiClient();
      let allTxs: OperationResponse["/extended/v1/tx/multiple"] = {};
      console.log(`Batch fetching ${txIds.length} transactions...`);

      // Process in smaller batches to avoid overwhelming the API
      const batchSize = 20;
      const batches = [];
      for (let i = 0; i < txIds.length; i += batchSize) {
        batches.push(txIds.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const txPromises = batch.map(async (txId) => {
          try {
            const response = await apiClient.GET("/extended/v1/tx/multiple", {
              params: {
                query: { tx_id: txIds },
              },
            });
            if (response.data) {
              allTxs = {
                ...allTxs,
                ...response.data,
              };
            }
          } catch (error) {
            console.warn(`Failed to fetch transaction ${txId}:`, error);
          }
        });

        await Promise.all(txPromises);

        // Small delay between batches to be respectful to the API
        if (batches.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      return allTxs;
    },
    [getApiClient]
  );

  const writeToSupabase = useCallback(
    async (poolMembersData: PoolMemberData[]) => {
      if (!supabase) {
        console.warn("Supabase not configured, skipping database write");
        return;
      }

      setIsWritingToSupabase(true);
      setSupabaseError(null);

      try {
        // Use upsert to handle conflicts
        const { data, error } = await supabase
          .from("pool_members")
          .upsert(poolMembersData, {
            onConflict: "pool_member_id",
            ignoreDuplicates: false,
          })
          .select();

        if (error) {
          throw error;
        }

        console.log(
          "Successfully wrote/updated pool members to Supabase:",
          data?.length || 0,
          "records"
        );
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to write to Supabase";
        setSupabaseError(errorMessage);
        console.error("Error writing to Supabase:", error);
        throw error;
      } finally {
        setIsWritingToSupabase(false);
      }
    },
    []
  );

  const getSupabaseStats = useCallback(async () => {
    if (!supabase) {
      return null;
    }

    try {
      const { count, error: countError } = await supabase
        .from("pool_members")
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error("Error getting count:", countError);
        return null;
      }

      const { data: latestData, error: latestError } = await supabase
        .from("pool_members")
        .select("block_height, tx_index, event_index, created_at")
        .order("block_height", { ascending: false })
        .order("tx_index", { ascending: false })
        .order("event_index", { ascending: false })
        .limit(1);

      if (latestError) {
        console.error("Error getting latest:", latestError);
        return null;
      }

      return {
        totalRecords: count || 0,
        latestEvent: latestData?.[0] || null,
      };
    } catch (error) {
      console.error("Error getting Supabase stats:", error);
      return null;
    }
  }, []);

  const fetchMultiPoolMembers = useCallback(async () => {
    try {
      const apiClient = getApiClient();
      const offset = 0; // Adjust as needed for pagination
      // Fetch events from the API
      const response = await apiClient.GET(
        "/extended/v1/contract/{contract_id}/events",
        {
          params: {
            path: {
              contract_id: multiPoolContract,
            },
            query: {
              limit: 50,
              offset,
            },
          },
        }
      );

      if (!response.data?.results) {
        console.warn("No events found in API response");
        setUsers(null);
        return;
      }

      const allEvents = response.data.results.filter(
        (r) => r.event_type === "smart_contract_log"
      );

      // Extract pool member data from new events
      const extractedUsers = allEvents
        .map((r) => extractContractLogValue(r))
        .filter(Boolean);

      setUsers(extractedUsers);

      // Get unique transaction IDs for batch fetching
      const uniqueTxIds = [...new Set(extractedUsers.map((u) => u.tx_id))];

      // Batch fetch all transaction details
      const transactions = await batchFetchTransactions(uniqueTxIds);

      // Augment pool member data with transaction details
      const poolMembersData: PoolMemberData[] = extractedUsers
        .map((u) => {
          const tx = transactions[u.tx_id];
          if (!tx) {
            console.warn(`Transaction not found for tx_id: ${u.tx_id}`);
            return u; // Return without transaction data if not found
          }

          return {
            ...u,
            stacker: tx.found ? tx.result.sender_address : undefined, // Assuming sender_address is the stacker
            // Add any additional transaction data if needed
            // For example: stacker: tx.sender_address,
          };
        })
        .filter(Boolean);

      // Write new data to Supabase
      if (poolMembersData.length > 0) {
        await writeToSupabase(poolMembersData);
      }

      // Update sync info
      setLastSyncInfo({
        timestamp: new Date().toISOString(),
        eventsProcessed: allEvents.length,
      });

      console.log("Multi-pool members sync completed successfully");
    } catch (error) {
      console.error("Error fetching multi pool members:", error);
      setUsers(null);
    }
  }, [getApiClient, batchFetchTransactions, writeToSupabase]);

  return {
    users,
    fetchMultiPoolMembers,
    isWritingToSupabase,
    supabaseError,
    writeToSupabase,
    isSupabaseConfigured: !!supabase,
  };
};
function extractContractLogValue(
  r: { event_index: number } & {
    event_type: "smart_contract_log";
    tx_id: string;
    contract_log: {
      contract_id: string;
      topic: string;
      value: { hex: string; repr: string };
    };
  }
) {
  const value = r.contract_log.value.hex;
  const valueCV = hexToCV(value) as TupleCV<{
    a: StringAsciiCV;
    payload: BufferCV;
  }>;
  const payload = valueCV.value.payload.value;
  const tupleData = payload
    ? (hexToCV(payload) as TupleCV<{
        c: StringAsciiCV;
        p: ListCV<PrincipalCV>;
        r: ListCV<UIntCV>;
        v: UIntCV;
      }>)
    : null;

  if (tupleData) {
    const poolMemberId = `${r.tx_id}_${r.event_index}`;
    return {
      pool_member_id: poolMemberId,
      currency: cvToString(tupleData.value.c),
      p_entries: tupleData.value.p.value.slice(0, 5).map((p) => cvToString(p)),
      r_entries: tupleData.value.r.value.slice(0, 5).map((r) => Number(r)),
      v_value: Number(tupleData.value.v.value),
      tx_id: r.tx_id,
      event_index: r.event_index,
      block_height: (r as any).block_height || 0,
      tx_index: (r as any).tx_index || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as PoolMemberData;
  }
}
