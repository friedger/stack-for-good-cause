
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json();
    const apiKey = Deno.env.get('COINGECKO_API_KEY');
    
    // Map symbols to CoinGecko IDs
    const symbolMap: Record<string, string> = {
      'BTC': 'bitcoin',
      'STX': 'blockstack'
    };

    const coinIds = symbols.map((symbol: string) => symbolMap[symbol]).filter(Boolean);
    
    if (coinIds.length === 0) {
      throw new Error('No valid symbols provided');
    }

    // Build API URL
    const baseUrl = 'https://api.coingecko.com/api/v3/simple/price';
    const params = new URLSearchParams({
      ids: coinIds.join(','),
      vs_currencies: 'usd',
      include_24hr_change: 'true'
    });

    // Add API key if available (for pro tier)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['x-cg-pro-api-key'] = apiKey;
    }

    const response = await fetch(`${baseUrl}?${params}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('CoinGecko API response:', data);

    // Transform the data to match our PriceData interface
    const transformedData: Record<string, any> = {};
    
    for (const [symbol, coinId] of Object.entries(symbolMap)) {
      if (data[coinId]) {
        transformedData[symbol] = {
          symbol,
          baseSymbol: 'USD',
          price: data[coinId].usd,
          change24h: data[coinId].usd_24h_change || 0,
          lastUpdated: new Date().toISOString()
        };
      }
    }

    // Calculate BTC/STX price if both are available
    if (transformedData.BTC && transformedData.STX) {
      transformedData['BTC_STX'] = {
        symbol: 'BTC',
        baseSymbol: 'STX',
        price: transformedData.BTC.price / transformedData.STX.price,
        change24h: transformedData.BTC.change24h - transformedData.STX.change24h,
        lastUpdated: new Date().toISOString()
      };
    }

    return new Response(JSON.stringify(transformedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching prices:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
