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

export const praxisRYDAbi = [
  // ── View functions ──────────────────────────────────────────────────
  {
    type: "function",
    name: "state",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "endTime",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "numWinners",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minDeposit",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalDeposits",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "activeParticipants",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "prizePerWinner",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deposits",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isWinner",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasClaimed",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getParticipants",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getParticipantCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getWinners",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "vault",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "yt",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  // ── Write functions ─────────────────────────────────────────────────
  {
    type: "function",
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "requestDraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "resolveWinners",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claim",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // ── Errors ──────────────────────────────────────────────────────────
  { type: "error", name: "RYDNotOpen", inputs: [] },
  { type: "error", name: "RYDNotFinished", inputs: [] },
  { type: "error", name: "RYDNotReadyToResolve", inputs: [] },
  { type: "error", name: "RYDNotEnded", inputs: [] },
  { type: "error", name: "RYDAlreadyEnded", inputs: [] },
  { type: "error", name: "InvalidEndTime", inputs: [] },
  {
    type: "error",
    name: "BelowMinDeposit",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "minRequired", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "NotEnoughParticipants",
    inputs: [
      { name: "current", type: "uint256" },
      { name: "required", type: "uint256" },
    ],
  },
  { type: "error", name: "NotAWinner", inputs: [] },
  { type: "error", name: "AlreadyClaimed", inputs: [] },
  { type: "error", name: "ZeroAmount", inputs: [] },
  { type: "error", name: "NoDeposit", inputs: [] },
  { type: "error", name: "TooManyParticipants", inputs: [] },
  // ── Events ──────────────────────────────────────────────────────────
  {
    type: "event",
    name: "Deposited",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DrawRequested",
    inputs: [{ name: "requestId", type: "uint256", indexed: false }],
  },
  {
    type: "event",
    name: "RandomnessReceived",
    inputs: [{ name: "requestId", type: "uint256", indexed: false }],
  },
  {
    type: "event",
    name: "WinnersSelected",
    inputs: [
      { name: "winners", type: "address[]", indexed: false },
      { name: "prizePerWinner", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "PrizeClaimed",
    inputs: [
      { name: "winner", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;
