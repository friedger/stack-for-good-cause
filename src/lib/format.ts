export const ustxToLocalString = (amount: number): string => {
  return amount.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const truncAddress = (address: string): string => {
  return `${address.slice(0, 8)}...${address.slice(-4)}`;
};
