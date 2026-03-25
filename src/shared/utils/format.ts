export function formatTokenBalance(balance: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;

  const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  const trimmedFractional = fractionalStr.slice(0, 4).replace(/0+$/, "");

  if (trimmedFractional) {
    return `${integerPart}.${trimmedFractional}`;
  }
  return integerPart.toString();
}
