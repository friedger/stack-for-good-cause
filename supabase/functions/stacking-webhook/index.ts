// @ts-ignore
declare var Deno: any;
import { createClient } from "@supabase/supabase-js";
import { parseUserData } from "../../../src/lib/user-data.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ProjectMapping {
  project_address: string;
  ratio: number;
  currency: "stx" | "sbtc";
}
interface BlockIdentifier {
  hash: string;
  index: number;
}
interface Transaction {
  metadata: {
    kind: {
      data: {
        args: string[];
        contract_identifier: string;
        method: string;
      };
    };
    nonce: number;
    position: { index: number };
    raw_tx: string;
    result: string;
    sender: string;
    success: boolean;
  };
  operations: {}[];
  transaction_identifier: {
    hash: string;
  };
}
interface WebhookPayload {
  apply: {
    block_identifier: BlockIdentifier;
    metadata: {
      bitcoin_anchor_block_identifier: BlockIdentifier;
    };
    transactions: Transaction[];
  }[];
  rollback: {
    block_identifier: BlockIdentifier;
    transactions: Transaction[];
  }[];
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Check authorization header
    const authHeader = req.headers.get("Authorization");
    const webhookToken = Deno.env.get("WEBHOOK_BEARER_TOKEN");

    if (!authHeader || !authHeader.startsWith("Bearer ") || !webhookToken) {
      console.error("Authorization failed - missing token or header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    if (token !== webhookToken) {
      console.error("Authorization failed - invalid token");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse request body
    const payload: WebhookPayload = await req.json();
    console.log("Processing webhook payload with", payload.apply?.length || 0, "blocks");

    const { apply, rollback } = payload;
    
    // First, rollback orphaned transactions
    if (rollback && rollback.length > 0) {
      console.log("Processing", rollback.length, "rollback blocks");
      for (const block of rollback) {
        for (const tx of block.transactions) {
          console.log("Processing rollback tx:", tx.transaction_identifier.hash);
          // TODO: Implement rollback logic if needed
        }
      }
    }

    // Then apply new canonical transactions
    if (apply && apply.length > 0) {
      console.log("Processing", apply.length, "apply blocks");
      for (const block of apply) {
        for (const tx of block.transactions) {
          console.log("Processing apply tx:", tx.transaction_identifier.hash);

          try {
            // Insert/update user_data with correct conflict resolution
            const { data: userData, error: userError } = await supabase
              .from("user_data")
              .upsert(
                {
                  stx_address: tx.metadata.sender,
                  block_height: block.block_identifier.index,
                  tx_id: tx.transaction_identifier.hash,
                  tx_index: tx.metadata.position.index,
                },
                {
                  onConflict: "tx_id,tx_index", // Use the compound unique constraint
                  ignoreDuplicates: false, // Update existing records
                }
              )
              .select()
              .single();

            if (userError) {
              console.error("Error upserting user data:", userError);
              // Log the error but continue processing other transactions
              continue;
            }

            if (!userData) {
              console.error("No user data returned from upsert");
              continue;
            }

            console.log("Successfully processed user_data for tx:", tx.transaction_identifier.hash);

            // Parse transaction data
            const userDataString = tx.metadata.kind.data.args[1];
            const userData2 = parseUserData(userDataString);
            
            if (!userData2 || !userData2.addresses) {
              console.log("No valid user data found in transaction:", tx.transaction_identifier.hash);
              continue;
            }

            const currency = userData2.currency;
            console.log("Processing", userData2.addresses.length, "project mappings for currency:", currency);

            for (let i = 0; i < userData2.addresses.length; i++) {
              const projectAddress = userData2.addresses[i];
              const ratio = userData2.ratios[i] || 0;

              try {
                // Upsert project
                const { data: projectsData, error: projectsError } = await supabase
                  .from("projects")
                  .upsert(
                    {
                      project_stx_address: projectAddress,
                    },
                    {
                      onConflict: "project_stx_address",
                      ignoreDuplicates: false,
                    }
                  )
                  .select()
                  .single();

                if (projectsError) {
                  console.error("Error upserting project:", projectsError);
                  continue;
                }

                if (!projectsData) {
                  console.error("No project data returned from upsert");
                  continue;
                }

                // Upsert user-project mapping
                const { data: mappingData, error: mappingError } = await supabase
                  .from("user_project_mapping")
                  .upsert(
                    {
                      user_data_id: userData.id,
                      project_id: projectsData.id,
                      tx_id: tx.transaction_identifier.hash,
                      ratio: ratio,
                      currency: currency,
                    },
                    {
                      onConflict: "user_data_id,project_id,tx_id",
                      ignoreDuplicates: false,
                    }
                  )
                  .select()
                  .single();

                if (mappingError) {
                  console.error("Error upserting user-project mapping:", mappingError);
                  continue;
                }

                console.log("Successfully processed mapping for project:", projectAddress, "ratio:", ratio);
              } catch (mappingErr) {
                console.error("Error processing project mapping:", mappingErr);
                continue;
              }
            }
          } catch (txError) {
            console.error("Error processing transaction:", tx.transaction_identifier.hash, txError);
            continue;
          }
        }
      }
    }

    console.log("Webhook processing completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});