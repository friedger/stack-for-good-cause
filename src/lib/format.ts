export const ustxToLocalString = (amount: number): string => {
  return amount.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
