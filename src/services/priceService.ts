
export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  lastUpdated: string;
}

class PriceService {
  private priceCache: Map<string, PriceData> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getBitcoinPrice(): Promise<PriceData> {
    return this.getPrice('BTC');
  }

  async getStacksPrice(): Promise<PriceData> {
    return this.getPrice('STX');
  }

  private async getPrice(symbol: string): Promise<PriceData> {
    const cached = this.priceCache.get(symbol);
    const now = Date.now();

    // Return cached data if it's still fresh
    if (cached && (now - new Date(cached.lastUpdated).getTime()) < this.cacheTimeout) {
      return cached;
    }

    try {
      // In a real app, you would fetch from an actual API
      // For now, we'll simulate with mock data
      const mockPrices = {
        BTC: { price: 43250.50, change24h: 2.34 },
        STX: { price: 2.85, change24h: -1.23 }
      };

      const mockData = mockPrices[symbol as keyof typeof mockPrices];
      if (!mockData) {
        throw new Error(`Price data not available for ${symbol}`);
      }

      const priceData: PriceData = {
        symbol,
        price: mockData.price,
        change24h: mockData.change24h,
        lastUpdated: new Date().toISOString()
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
        price: 0,
        change24h: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  clearCache(): void {
    this.priceCache.clear();
  }
}

export const priceService = new PriceService();
