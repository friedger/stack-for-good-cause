import { StackingClient } from "@stacks/stacking";

interface StacksNodeResponse {
  current_cycle: {
    id: number;
    min_threshold_ustx: number;
    stacked_ustx: number;
    is_pox_active: boolean;
  };
  current_burnchain_block_height: number;
  next_cycle: {
    id: number;
    min_threshold_ustx: number;
    stacked_ustx: number;
    prepare_phase_start_block_height: number;
    reward_phase_start_block_height: number;
  };
  first_burnchain_block_height: number;
  reward_cycle_length: number;
}

export interface CycleBlockHeights {
  currentCycle: number;
  currentBlockHeight: number;
  cycleStartBlock: number;
  rewardDistributionEndBlock: number;
  extendingStartBlock: number;
  aggregateCommitsBlock: number;
  lisaClosesBlock: number;
  fastPoolClosesBlock: number;
  preparePhaseStartBlock: number;
  cycleEndBlock: number;
  automaticUnlockBlock: number;
}

class StacksNodeService {
  private stackingClient: StackingClient;

  constructor() {
    // Initialize StackingClient for advanced operations
    this.stackingClient = new StackingClient({
      address: "SP000000000000000000002Q6VF78",
    });
  }

  async getCurrentBlockHeight(): Promise<number> {
    try {
      const coreInfo = await this.stackingClient.getCoreInfo();
      return coreInfo.burn_block_height;
    } catch (error) {
      console.error("Error fetching current block height:", error);
      throw new Error("Failed to fetch current block height");
    }
  }

  async getPoxInfo(): Promise<StacksNodeResponse> {
    try {
      const poxInfo = await this.stackingClient.getPoxInfo();

      // Transform the stacking library response to match our interface
      return {
        current_cycle: {
          id: poxInfo.current_cycle.id,
          min_threshold_ustx: poxInfo.current_cycle.min_threshold_ustx,
          stacked_ustx: poxInfo.current_cycle.stacked_ustx,
          is_pox_active: poxInfo.current_cycle.is_pox_active,
        },
        current_burnchain_block_height: poxInfo.current_burnchain_block_height,
        next_cycle: {
          id: poxInfo.next_cycle.id,
          min_threshold_ustx: poxInfo.next_cycle.min_threshold_ustx,
          stacked_ustx: poxInfo.next_cycle.stacked_ustx,
          prepare_phase_start_block_height:
            poxInfo.next_cycle.prepare_phase_start_block_height,
          reward_phase_start_block_height:
            poxInfo.next_cycle.reward_phase_start_block_height,
        },
        first_burnchain_block_height: poxInfo.first_burnchain_block_height,
        reward_cycle_length: poxInfo.reward_cycle_length,
      };
    } catch (error) {
      console.error("Error fetching PoX info:", error);
      throw new Error("Failed to fetch PoX information");
    }
  }

  async getCycleBlockHeights(): Promise<CycleBlockHeights> {
    try {
      const data = await this.getPoxInfo();

      const currentCycle = data.current_cycle.id;
      const currentBlockHeight = data.current_burnchain_block_height;
      const CYCLE_LENGTH = data.reward_cycle_length;
      const cycleStartBlock =
        data.first_burnchain_block_height + currentCycle * CYCLE_LENGTH;

      // Calculate Fast Pool event blocks based on cycle structure
      const rewardDistributionEndBlock = cycleStartBlock + 432; // ~3 days
      const extendingStartBlock = cycleStartBlock + 1050; // ~7 days
      const aggregateCommitsBlock = cycleStartBlock + 1400; // ~9.5 days
      const lisaClosesBlock = cycleStartBlock + 1700; // ~11.5 days
      const fastPoolClosesBlock = cycleStartBlock + 1900; // ~13 days
      const preparePhaseStartBlock =
        data.next_cycle.prepare_phase_start_block_height;
      const cycleEndBlock = cycleStartBlock + CYCLE_LENGTH;
      const automaticUnlockBlock = cycleEndBlock + 1;

      return {
        currentCycle,
        currentBlockHeight,
        cycleStartBlock,
        rewardDistributionEndBlock,
        extendingStartBlock,
        aggregateCommitsBlock,
        lisaClosesBlock,
        fastPoolClosesBlock,
        preparePhaseStartBlock,
        cycleEndBlock,
        automaticUnlockBlock,
      };
    } catch (error) {
      console.error("Error fetching cycle block heights:", error);
      throw error;
    }
  }

  calculateTimeFromBlocks(blocks: number): string {
    const MINUTES_PER_BLOCK = 10; // Bitcoin block time
    const totalMinutes = blocks * MINUTES_PER_BLOCK;
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = (totalMinutes % (24 * 60)) / 60;

    return `${days} days and ${hours.toFixed(2)} hours`;
  }

  getBlocksUntil(targetBlock: number, currentBlock: number): number {
    return Math.max(0, targetBlock - currentBlock);
  }
}

export const stacksNodeService = new StacksNodeService();
