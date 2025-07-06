export interface PriceData {
  symbol: string;
  baseSymbol: string;
  price: number;
  change24h: number;
  lastUpdated: string;
}

class PriceService {
  private priceCache: Map<string, PriceData> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

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
    const cached = this.priceCache.get(symbol);
    const now = Date.now();

    // Return cached data if it's still fresh
    if (
      cached &&
      now - new Date(cached.lastUpdated).getTime() < this.cacheTimeout
    ) {
      return cached;
    }

    try {
      // In a real app, you would fetch from an actual API
      // For now, we'll simulate with mock data
      const mockPrices = {
        BTC: {
          USD: { price: 43250.5, change24h: 2.34 },
          STX: { price: 100, change24h: 23 },
        },
        STX: {
          USD: { price: 2.85, change24h: -1.23 },
          STX: { price: 1, change24h: 0 },
        },
      };

      const mockData =
        mockPrices[symbol as keyof typeof mockPrices][baseSymbol];
      if (!mockData) {
        throw new Error(`Price data not available for ${symbol}`);
      }

      const priceData: PriceData = {
        symbol,
        baseSymbol,
        price: mockData.price,
        change24h: mockData.change24h,
        lastUpdated: new Date().toISOString(),
      };

      this.priceCache.set(symbol, priceData);
      return priceData;
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error);

      // Return cached data even if stale, or default values
      if (cached) {
        return cached;
      }

      return {
        symbol,
        baseSymbol,
        price: 0,
        change24h: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  clearCache(): void {
    this.priceCache.clear();
  }
}

export const priceService = new PriceService();
