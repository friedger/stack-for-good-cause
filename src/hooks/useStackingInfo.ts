import { useEffect, useMemo, useState } from "react";
import { useUser } from "./useUser";
import { UserStackingService } from "@/services/userStacksNodeService";
import { DelegationInfo, StackerInfo } from "@stacks/stacking";
import { ClarityType } from "@stacks/transactions";
import { useCycleBlockHeights } from "./useCycleBlockHeights";

export const useUserStackingService = () => {
  const { stxAddress } = useUser();
  const [stackingStatus, setStackingStatus] = useState<StackerInfo | null>(
    null
  );
  const [multiPoolAllowed, setMultiPoolAllowed] = useState<boolean | null>(
    null
  );
  const [delegationStatus, setDelegationStatus] =
    useState<DelegationInfo | null>(null);

  const {
    cycleData,
    loading: cycleLoading,
    error: cycleError,
  } = useCycleBlockHeights();

  const userStackingService = useMemo(() => {
    if (!stxAddress) {
      return null;
    }
    return new UserStackingService(stxAddress);
  }, [stxAddress]);

  useEffect(() => {
    if (userStackingService && cycleData) {
      const fetchStackingStatus = async () => {
        try {
          const status = await userStackingService.getStackingStatus();
          setStackingStatus(status);

          const contractCallerExpiry =
            await userStackingService.getContractCallerExpiry();

          if (contractCallerExpiry.type === ClarityType.OptionalSome) {
            setMultiPoolAllowed(
              contractCallerExpiry.value.value["until-burn-ht"].type ===
                ClarityType.OptionalNone ||
                Number(
                  contractCallerExpiry.value.value["until-burn-ht"].value.value
                ) > cycleData.currentBlockHeight
            );
          }

          const poolInfo = await userStackingService.getDelegationStatus();
          setDelegationStatus(poolInfo);
        } catch (error) {
          console.error("Failed to fetch stacking status:", error);
        }
      };
      fetchStackingStatus();
    }
  }, [userStackingService, cycleData]); // Added cycleData as dependency

  return {
    userStackingService,
    stackingStatus,
    delegationStatus,
    multiPoolAllowed,
    cycleData,
    cycleLoading,
    cycleError,
  };
};
