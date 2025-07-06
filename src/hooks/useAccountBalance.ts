import { walletService } from "@/services/walletService";
import { createClient, OperationResponse } from "@stacks/blockchain-api-client";
import { isConnected } from "@stacks/connect";
import { useCallback, useEffect, useRef, useState } from "react";

export type AccountBalance =
  OperationResponse["/extended/v1/address/{principal}/balances"];

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export const useAccountBalance = () => {
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState(walletService.getWalletInfo());

  useEffect(() => {
    const checkWalletConnection = () => {
      const info = walletService.getWalletInfo();
      setWalletInfo(info);
    };

    checkWalletConnection();
  }, [isConnected()]);

  // Lazy API client creation
  const apiClientRef = useRef<any>(null);
  const getApiClient = useCallback(() => {
    if (!apiClientRef.current) {
      apiClientRef.current = createClient();
    }
    return apiClientRef.current;
  }, []);

  // Cache with 5 minute TTL
  const cacheRef = useRef<Map<string, CacheEntry<AccountBalance>>>(new Map());
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const getCachedBalance = useCallback(
    (addr: string): AccountBalance | null => {
      const cached = cacheRef.current.get(addr);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data;
      }
      return null;
    },
    []
  );

  const setCachedBalance = useCallback((addr: string, data: AccountBalance) => {
    const now = Date.now();
    cacheRef.current.set(addr, {
      data,
      timestamp: now,
      expiresAt: now + CACHE_TTL,
    });
  }, []);

  const fetchBalance = useCallback(
    async (addr: string, forceRefresh = false) => {
      // Check cache first unless force refresh is requested
      if (!forceRefresh) {
        const cached = getCachedBalance(addr);
        if (cached) {
          setBalance(cached);
          setLoading(false);
          setError(null);
          return cached;
        }
      }

      setLoading(true);
      setError(null);

      try {
        const apiClient = getApiClient();
        const accountData = await apiClient.GET(
          "/extended/v1/address/{principal}/balances",
          {
            params: {
              path: {
                principal: addr,
              },
            },
          }
        );

        if (!accountData.data) {
          throw new Error("No balance data received");
        }

        const balanceData = accountData.data as AccountBalance;

        // Cache the result
        setCachedBalance(addr, balanceData);
        setBalance(balanceData);
        setLoading(false);

        return balanceData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch balance";
        setError(errorMessage);
        setLoading(false);
        throw new Error(errorMessage);
      }
    },
    [getApiClient, getCachedBalance, setCachedBalance]
  );

  // Auto-fetch when address changes
  useEffect(() => {
    if (walletInfo?.stxAddress) {
      fetchBalance(walletInfo?.stxAddress);
    } else {
      setBalance(null);
      setError(null);
      setLoading(false);
    }
  }, [walletInfo?.stxAddress, fetchBalance]);

  const refetch = useCallback(() => {
    if (walletInfo?.stxAddress) {
      return fetchBalance(walletInfo?.stxAddress, true);
    }
    return Promise.resolve(null);
  }, [walletInfo?.stxAddress, fetchBalance]);

  return {
    balance,
    loading,
    error,
    refetch,
    stxAddress: walletInfo?.stxAddress,
    // Helper to get STX balance as number
    stxBalance: balance ? parseFloat(balance.stx.balance) / 1e6 : 0,
    lockedStx: balance ? parseFloat(balance.stx.locked) / 1e6 : 0,
  };
};
