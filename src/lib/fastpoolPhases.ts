export interface FastPoolEvent {
  name: string;
  blockHeight: number;
  description: string;
  status: "completed" | "active" | "upcoming";
  timeRemaining?: string;
  blocksRemaining?: number;
}

export const phases = (cycleData) => [
  {
    name: "Fast Pool open",
    startBlock: 0,
    endBlock: cycleData.extendingStartBlock - cycleData.cycleStartBlock,
    color: "#10B981", // emerald-500
    bgColor: "#065F46", // emerald-800
    description: "Beginning of the stacking cycle",
  },
  {
    name: "Extension Phase",
    startBlock: cycleData.extendingStartBlock - cycleData.cycleStartBlock,
    endBlock: cycleData.fastPoolClosesBlock - cycleData.cycleStartBlock,
    color: "#F59E0B", // amber-500
    bgColor: "#92400E", // amber-800
    description: "Existing stackers can extend commitments",
  },

  {
    name: "Fast Pool Closed",
    startBlock: cycleData.fastPoolClosesBlock - cycleData.cycleStartBlock,
    endBlock: cycleData.preparePhaseStartBlock - cycleData.cycleStartBlock,
    color: "#F43F5E", // rose-500
    bgColor: "#9F1239", // rose-800
    description: "Fast Pool stops accepting new members",
  },
  {
    name: "Prepare Phase",
    startBlock: cycleData.preparePhaseStartBlock - cycleData.cycleStartBlock,
    endBlock: 2100,
    color: "#EF4444", // red-500
    bgColor: "#991B1B", // red-800
    description: "No new stacking operations allowed",
  },
];

export const fastPoolEvents = (cycleData): FastPoolEvent[] => {
  const events = [
    {
      name: "Miners start PoX Cycle",
      blockHeight: cycleData.cycleStartBlock,
      description: "Beginning of the current stacking cycle",
    },
    {
      name: "Fast Pool ends rewards distribution",
      blockHeight: cycleData.rewardDistributionEndBlock,
      description: "Fast Pool completes reward distribution to members",
    },

    {
      name: "Fast Pool starts extending stacking, everyone can extend",
      blockHeight: cycleData.extendingStartBlock,
      description:
        "Extension phase begins - existing stackers can extend their commitment",
    },
    {
      name: "Fast Pool aggregates partial commits (estimated)",
      blockHeight: cycleData.aggregateCommitsBlock,
      description: "Fast Pool combines partial stacking commitments",
    },
    {
      name: "Lisa closes for next cycle",
      blockHeight: cycleData.lisaClosesBlock,
      description: "Lisa protocol closes accepting new delegations",
    },
    {
      name: "Fast Pool closes for next cycle (estimated), last aggregate partial commit",
      blockHeight: cycleData.fastPoolClosesBlock,
      description:
        "Fast Pool stops accepting new members and performs final aggregation",
    },
    {
      name: "Begin of prepare phase, no more stacking possible",
      blockHeight: cycleData.preparePhaseStartBlock,
      description: "Prepare phase starts - no new stacking operations allowed",
    },
    {
      name: "End of cycle",
      blockHeight: cycleData.cycleEndBlock,
      description: "Current stacking cycle ends",
    },
    {
      name: "Automatic unlock (if locking period ended)",
      blockHeight: cycleData.automaticUnlockBlock,
      description:
        "Automatic unlock for stackers whose locking period has ended",
    },
  ];

  events.forEach((event: any) => {
    event.status =
      cycleData.currentBlockHeight >= event.blockHeight
        ? "completed"
        : "upcoming";
    return event;
  });

  // insert current block height in the events list before the first event with a hight block height
  const currentBlockHeight = cycleData.currentBlockHeight;
  const currentCycleEvent = {
    name: "Current Cycle",
    blockHeight: currentBlockHeight,
    description: "Current block height of the stacking cycle",
    status: "active",
  };
  const index = events.findIndex(
    (event) => event.blockHeight > currentBlockHeight
  );
  if (index === -1) {
    events.push(currentCycleEvent);
  } else {
    events.splice(index, 0, currentCycleEvent) as FastPoolEvent[];
  }
  return events as FastPoolEvent[];
};
