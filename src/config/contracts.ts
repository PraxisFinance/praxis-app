export const praxisVaultAbi = [
  // ── View functions ──────────────────────────────────────────────────
  {
    type: "function",
    name: "quoteBuyIn",
    inputs: [{ name: "principalAmount", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isMatured",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalAssets",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalPrincipal",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "yieldSurplus",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maturity",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  // ── Write functions ─────────────────────────────────────────────────
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
    name: "withdraw",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "receiver", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "redeemYield",
    inputs: [
      { name: "ytAmount", type: "uint256" },
      { name: "receiver", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // ── Errors ──────────────────────────────────────────────────────────
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
