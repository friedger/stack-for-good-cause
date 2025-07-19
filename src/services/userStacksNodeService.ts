import { poolAddress } from "@/lib/consts";
import { StackingClient } from "@stacks/stacking";
import {
  fetchCallReadOnlyFunction,
  OptionalCV,
  principalCV,
  TupleCV,
  tupleCV,
  UIntCV,
} from "@stacks/transactions";

// User-specific stacking service
class UserStackingService {
  private stackingClient: StackingClient;
  private userAddress: string;

  constructor(userAddress: string) {
    this.userAddress = userAddress;
    this.stackingClient = new StackingClient({
      address: userAddress,
    });
  }

  async getStackingStatus() {
    try {
      const status = await this.stackingClient.getStatus();
      return status;
    } catch (error) {
      console.error(
        `Error fetching stacking status for ${this.userAddress}:`,
        error
      );
      throw new Error("Failed to fetch user stacking status");
    }
  }

  async getDelegationStatus() {
    try {
      const delegation = await this.stackingClient.getDelegationStatus();
      return delegation;
    } catch (error) {
      console.error(
        `Error fetching delegation status for ${this.userAddress}:`,
        error
      );
      throw new Error("Failed to fetch user delegation status");
    }
  }

  async getContractCallerExpiry() {
    const allowedResponse = (await fetchCallReadOnlyFunction({
      contractAddress: "SP000000000000000000002Q6VF78",
      contractName: "pox-4",
      functionName: "get-allowed-contract-caller",
      functionArgs: [principalCV(this.userAddress), principalCV(poolAddress)],
      senderAddress: this.userAddress,
    })) as OptionalCV<TupleCV<{ "until-burn-ht": OptionalCV<UIntCV> }>>;
    const allowedCaller = allowedResponse;
    return allowedCaller;
  }

  async canStack(amount: string, cycles: number) {
    try {
      const result = await this.stackingClient.canStack({
        amount,
        cycles,
        poxAddress: "", // Will be set by pool
      });
      return result;
    } catch (error) {
      console.error(`Error checking if ${this.userAddress} can stack:`, error);
      throw new Error("Failed to check user stacking eligibility");
    }
  }
}

export { UserStackingService };
