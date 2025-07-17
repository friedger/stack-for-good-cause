import { supabase } from "@/integrations/supabase/client";
import { priceCache } from "./cachingService";

export interface PriceData {
  symbol: string;
  baseSymbol: string;
  price: number;
  change24h: number;
  lastUpdated: string;
}

class PriceService {
  async getBitcoinPrice(): Promise<PriceData> {
    return this.getPrice("BTC", "USD");
  }

  async getBtcStxPrice(): Promise<PriceData> {
    return this.getPrice("BTC", "STX");
  }

  async getStacksPrice(): Promise<PriceData> {
    return this.getPrice("STX", "USD");
  }

  private async getPrice(
    symbol: "STX" | "BTC",
    baseSymbol: "USD" | "STX"
  ): Promise<PriceData> {
    const cacheKey = `${symbol}_${baseSymbol}`;

    // Check shared cache first
    const cached = priceCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Fetch real prices from CoinGecko via Edge Function
      const { data, error } = await supabase.functions.invoke("fetch-prices", {
        body: { symbols: ["BTC", "STX"] },
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      console.log("Price data received:", data);

      let priceData: PriceData;

      if (symbol === "BTC" && baseSymbol === "STX") {
        // Use the calculated BTC/STX price
        priceData = data.BTC_STX;
      } else {
        // Use direct USD prices
        const coinData = data[symbol];
        if (!coinData) {
          throw new Error(`Price data not available for ${symbol}`);
        }
        priceData = coinData;
      }

      // Store in shared cache
      priceCache.set(cacheKey, priceData);
      return priceData;
    } catch (error) {
      console.error(`Failed to fetch real price for ${symbol}:`, error);

      const staleCached = priceCache.getStale(cacheKey);
      if (staleCached) {
        return staleCached;
      }

      // Fallback mock data as last resort
      const mockPrices = {
        BTC: {
          USD: { price: 43250.5, change24h: 2.34 },
          STX: { price: 15000, change24h: 1.5 },
        },
        STX: {
          USD: { price: 2.85, change24h: -1.23 },
          STX: { price: 1, change24h: 0 },
        },
      };

      const mockData =
        mockPrices[symbol as keyof typeof mockPrices][baseSymbol];

      const fallbackData: PriceData = {
        symbol,
        baseSymbol,
        price: mockData.price,
        change24h: mockData.change24h,
        lastUpdated: new Date().toISOString(),
      };

      return fallbackData;
    }
  }

  clearCache(): void {
    priceCache.clear();
  }
}

export const priceService = new PriceService();
