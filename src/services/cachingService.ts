import { AccountBalance } from "./balanceService";
import { PriceData } from "./priceService";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

// Reusable caching service
class CacheService<T> {
  private cache = new Map<string, CacheEntry<T>>();

  constructor(private ttl: number = 5 * 60 * 1000) {}

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() < entry.expiresAt) {
      return entry.data;
    }
    return null;
  }

  set(key: string, data: T): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.ttl,
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get even if expired (for fallback purposes)
  getStale(key: string): T | null {
    const entry = this.cache.get(key);
    return entry ? entry.data : null;
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now < entry.expiresAt) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
    };
  }
}

// Export typed instances
export const balanceCache = new CacheService<AccountBalance>();
export const priceCache = new CacheService<PriceData>();

export { CacheService };
