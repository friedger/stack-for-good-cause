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

interface CycleBlockHeights {
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
  private readonly STACKS_API_URL = 'https://stacks-node-api.mainnet.stacks.co/v2/pox';

  async getCurrentBlockHeight(): Promise<number> {
    try {
      const response = await fetch(this.STACKS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: StacksNodeResponse = await response.json();
      return data.current_burnchain_block_height;
    } catch (error) {
      console.error('Error fetching current block height:', error);
      throw error;
    }
  }

  async getCycleBlockHeights(): Promise<CycleBlockHeights> {
    try {
      const response = await fetch(this.STACKS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: StacksNodeResponse = await response.json();
      
      const currentCycle = data.current_cycle.id;
      const currentBlockHeight = data.current_burnchain_block_height;
      const CYCLE_LENGTH = data.reward_cycle_length;
      const cycleStartBlock = data.first_burnchain_block_height + (currentCycle * CYCLE_LENGTH);
      
      // Calculate Fast Pool event blocks based on cycle structure
      const rewardDistributionEndBlock = cycleStartBlock + 432; // ~3 days
      const extendingStartBlock = cycleStartBlock + 1050; // ~7 days
      const aggregateCommitsBlock = cycleStartBlock + 1400; // ~9.5 days
      const lisaClosesBlock = cycleStartBlock + 1700; // ~11.5 days
      const fastPoolClosesBlock = cycleStartBlock + 1900; // ~13 days
      const preparePhaseStartBlock = data.next_cycle.prepare_phase_start_block_height;
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
        automaticUnlockBlock
      };
    } catch (error) {
      console.error('Error fetching cycle block heights:', error);
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