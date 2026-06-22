export const mockUsdcAbi = [
  {
    type: "function",
    name: "claim",
    inputs: [
      { name: "deadline", type: "uint256" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasClaimed",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
] as const;

export const testnetMintAbi = [
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const praxisCPFAbi = [
  {
    type: "function",
    name: "buy",
    inputs: [
      { name: "poolId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "inFavor", type: "bool" },
      { name: "minTokensOut", type: "uint256" },
    ],
    outputs: [{ name: "tokensOut", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getPool",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "poolId", type: "uint256" },
          { name: "yesReserve", type: "uint256" },
          { name: "noReserve", type: "uint256" },
          { name: "totalLPShares", type: "uint256" },
          { name: "yesPositionId", type: "uint256" },
          { name: "noPositionId", type: "uint256" },
          { name: "winningOutcome", type: "uint8" },
          { name: "createdAt", type: "uint256" },
          { name: "resolvedAt", type: "uint256" },
          { name: "votingDeadline", type: "uint256" },
          { name: "expiration", type: "uint256" },
          { name: "conditionId", type: "bytes32" },
          { name: "ctfAddress", type: "address" },
          { name: "state", type: "uint8" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStakeToken",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  { type: "error", name: "PraxisCPF_InsufficientAmount", inputs: [] },
  {
    type: "error",
    name: "PraxisCPF_PoolNotOpen",
    inputs: [{ name: "state", type: "uint8" }],
  },
  {
    type: "error",
    name: "PraxisCPF_SlippageExceeded",
    inputs: [
      { name: "tokensOut", type: "uint256" },
      { name: "minTokensOut", type: "uint256" },
    ],
  },
] as const;

/** Gnosis Conditional Tokens Framework — used directly by CPF claim flow. */
export const conditionalTokensAbi = [
  {
    type: "function",
    name: "redeemPositions",
    inputs: [
      { name: "collateralToken", type: "address" },
      { name: "parentCollectionId", type: "bytes32" },
      { name: "conditionId", type: "bytes32" },
      { name: "indexSets", type: "uint256[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

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
      { name: "minNet", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimTrader",
    inputs: [{ name: "side", type: "uint8" }],
    outputs: [{ name: "ytOut", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimLP",
    inputs: [],
    outputs: [{ name: "ytOut", type: "uint256" }],
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
