export const praxisVaultAbi = [
  {
    type: "function",
    name: "quoteBuyIn",
    inputs: [{ name: "principalAmount", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "principalAmount", type: "uint256" },
      { name: "receiver", type: "address" },
      { name: "maxBuyIn", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isMatured",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "error",
    name: "ZeroAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "BuyInExceedsMax",
    inputs: [
      { name: "required", type: "uint256" },
      { name: "max", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "VaultMatured",
    inputs: [],
  },
] as const;

/** Two-pool vault: `enum Side { Stable, Elevated }` → ABI `uint8`. */
export const twoPoolAbi = [
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "side", type: "uint8" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
