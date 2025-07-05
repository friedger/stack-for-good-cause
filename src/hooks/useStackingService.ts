export const useStackingService = (): { estimatedApy: number } => {
  // In a real app, this might fetch from an API or calculate based on network data.
  // Here, we mock a fixed APY for demonstration.
  const estimatedApy = 0.1; // 10% APY as an example
  return { estimatedApy };
};
