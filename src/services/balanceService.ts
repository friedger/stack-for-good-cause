import { Client } from "@stacks/blockchain-api-client";
import { paths } from "@stacks/blockchain-api-client/lib/generated/schema";
import { OperationResponse } from "@stacks/blockchain-api-client";
import { balanceCache } from "./cachingService";

export type AccountBalance =
  OperationResponse["/extended/v1/address/{principal}/balances"];

class BalanceService {
  constructor(private apiClient: Client<paths>) {}

  async getBalance(
    address: string,
    forceRefresh = false
  ): Promise<AccountBalance> {
    const cacheKey = `balance_${address}`;

    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
      const cached = balanceCache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const accountData = await this.apiClient.GET(
        "/extended/v1/address/{principal}/balances",
        {
          params: {
            path: {
              principal: address,
            },
          },
        }
      );

      if (!accountData.data) {
        throw new Error("No balance data received");
      }

      const balanceData = accountData.data as AccountBalance;

      // Cache the result
      balanceCache.set(cacheKey, balanceData);

      return balanceData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch balance";
      throw new Error(errorMessage);
    }
  }

  clearCache(address?: string): void {
    if (address) {
      // Clear specific address cache
      const cacheKey = `balance_${address}`;
      balanceCache.delete(cacheKey);
    } else {
      // Clear all balance cache
      balanceCache.clear();
    }
  }

  // Helper methods for balance calculations
  getStxBalance(balance: AccountBalance): number {
    return parseFloat(balance.stx.balance) / 1e6;
  }

  getLockedStx(balance: AccountBalance): number {
    return parseFloat(balance.stx.locked) / 1e6;
  }

  getAvailableStx(balance: AccountBalance): number {
    return this.getStxBalance(balance) - this.getLockedStx(balance);
  }

  // Additional helper methods
  hasStxBalance(balance: AccountBalance): boolean {
    return this.getStxBalance(balance) > 0;
  }

  getFormattedStxBalance(balance: AccountBalance): string {
    return this.getStxBalance(balance).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }
}

export { BalanceService };
