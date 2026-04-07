export function parseTokenAmount(amount: string, decimals: number): bigint {
  if (!amount || amount === "0") return BigInt(0);
  const [integer = "0", fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(integer + paddedFraction);
}

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
