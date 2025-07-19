import { useEffect, useMemo, useState } from "react";
import { useUser } from "./useUser";
import { UserStackingService } from "@/services/userStacksNodeService";
import { StackerInfo } from "@stacks/stacking";
import { ClarityType } from "@stacks/transactions";
import { useCycleBlockHeights } from "./useCycleBlockHeights";

export const useUserStackingService = () => {
  const { stxAddress } = useUser();
  const [stackingStatus, setStackingStatus] = useState<StackerInfo>(null);
  const [multiPoolAllowed, setMultiPoolAllowed] = useState<boolean>(false);

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
    multiPoolAllowed,
    cycleData,
    cycleLoading,
    cycleError,
  };
};
