import { walletService } from "@/services/walletService";
import { BalanceService, AccountBalance } from "@/services/balanceService";
import { isConnected } from "@stacks/connect";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useApiClient } from "./useApiClient";

export const useUser = () => {
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState(walletService.getWalletInfo());

  // Use shared API client
  const { getApiClient } = useApiClient();

  // Create balance service instance
  const balanceService = useMemo(() => {
    return new BalanceService(getApiClient());
  }, [getApiClient]);

  useEffect(() => {
    const checkWalletConnection = () => {
      const info = walletService.getWalletInfo();
      setWalletInfo(info);
    };

    checkWalletConnection();
  }, [isConnected()]);

  const fetchBalance = useCallback(
    async (addr: string, forceRefresh = false) => {
      setLoading(true);
      setError(null);

      try {
        const balanceData = await balanceService.getBalance(addr, forceRefresh);
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
    [balanceService]
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
    // Helper methods using the service
    stxBalance: balance ? balanceService.getStxBalance(balance) : 0,
    lockedStx: balance ? balanceService.getLockedStx(balance) : 0,
    availableStx: balance ? balanceService.getAvailableStx(balance) : 0,
  };
};
