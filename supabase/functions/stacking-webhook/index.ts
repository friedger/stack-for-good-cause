import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProjectMapping {
  project_address: string;
  ratio: number;
  currency: 'stx' | 'sbtc';
}

interface WebhookPayload {
  user_address: string;
  block_height: number;
  tx_id: string;
  tx_index: number;
  projects: ProjectMapping[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Check authorization header
    const authHeader = req.headers.get('Authorization');
    const webhookToken = Deno.env.get('WEBHOOK_BEARER_TOKEN');
    
    if (!authHeader || !authHeader.startsWith('Bearer ') || !webhookToken) {
      console.error('Authorization failed - missing token or header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    if (token !== webhookToken) {
      console.error('Authorization failed - invalid token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const payload: WebhookPayload = await req.json();
    console.log('Processing webhook payload:', payload);

    // Validate payload
    if (!payload.user_address || !payload.tx_id || !payload.projects || !Array.isArray(payload.projects)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate ratios sum to 1.0 (allowing small floating point variance)
    const totalRatio = payload.projects.reduce((sum, p) => sum + p.ratio, 0);
    if (Math.abs(totalRatio - 1.0) > 0.0001) {
      return new Response(
        JSON.stringify({ error: 'Project ratios must sum to 1.0' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Start transaction by inserting/updating user_data
    const { data: userData, error: userError } = await supabase
      .from('user_data')
      .upsert({
        stx_address: payload.user_address,
        block_height: payload.block_height,
        tx_id: payload.tx_id,
        tx_index: payload.tx_index,
      })
      .select()
      .single();

    if (userError) {
      console.error('Error inserting user data:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert user data', details: userError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('User data inserted/updated:', userData);

    // Process each project mapping
    const results = [];
    for (const projectMapping of payload.projects) {
      try {
        // Insert/get project
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .upsert({
            project_stx_address: projectMapping.project_address,
          })
          .select()
          .single();

        if (projectError) {
          console.error('Error inserting project:', projectError);
          throw new Error(`Failed to insert project ${projectMapping.project_address}: ${projectError.message}`);
        }

        // Insert user-project mapping
        const { data: mapping, error: mappingError } = await supabase
          .from('user_project_mapping')
          .upsert({
            user_data_id: userData.id,
            project_id: project.id,
            ratio: projectMapping.ratio,
            currency: projectMapping.currency,
          })
          .select()
          .single();

        if (mappingError) {
          console.error('Error inserting mapping:', mappingError);
          throw new Error(`Failed to insert mapping: ${mappingError.message}`);
        }

        results.push({
          project_address: projectMapping.project_address,
          ratio: projectMapping.ratio,
          currency: projectMapping.currency,
          mapping_id: mapping.id,
        });

      } catch (error) {
        console.error('Error processing project mapping:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to process project mapping', details: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    console.log('Webhook processing completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        user_data_id: userData.id,
        processed_projects: results.length,
        results: results,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});