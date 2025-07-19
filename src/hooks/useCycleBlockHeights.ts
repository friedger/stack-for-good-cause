import { useEffect, useState, useCallback } from "react";
import {
  CycleBlockHeights,
  stacksNodeService,
} from "@/services/stacksNodeService";

export const useCycleBlockHeights = () => {
  const [cycleData, setCycleData] = useState<CycleBlockHeights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCycleData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await stacksNodeService.getCycleBlockHeights();
      setCycleData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch cycle data";
      setError(errorMessage);
      console.error("Failed to fetch cycle block heights:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCycleData();
  }, [fetchCycleData]);

  const refetch = useCallback(() => {
    return fetchCycleData();
  }, [fetchCycleData]);

  return {
    cycleData,
    loading,
    error,
    refetch,
    // Helper computed values
    currentCycle: cycleData?.currentCycle ?? null,
    currentBlockHeight: cycleData?.currentBlockHeight ?? null,
    fastPoolClosesBlock: cycleData?.fastPoolClosesBlock ?? null,
    // Helper to check if fast pool is still open
    isFastPoolOpen: cycleData
      ? cycleData.currentBlockHeight < cycleData.fastPoolClosesBlock
      : null,
  };
};
