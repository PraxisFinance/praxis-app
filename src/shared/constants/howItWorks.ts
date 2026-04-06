/** Route + static copy for the “How it works” page. */

export const HOW_IT_WORKS_ROUTE = "/how-it-works";

export const HOW_IT_WORKS_TWITTER_URL = "https://x.com/praxis";

export const HOW_IT_WORKS_GUIDE_STEPS = [
  { id: "deposit", text: "Deposit & Stake your coins" },
  { id: "yield", text: "Earn yield from your stake" },
  { id: "predict", text: "Use yield to predict on events" },
  { id: "boost", text: "Boost yield from predictions" },
  { id: "strategy", text: "Create a strategy & compete with your friends" },
] as const;

export const HOW_IT_WORKS_ABOUT_INTRO =
  "Praxis is a prediction market on Base, where your principal stays safe and you risk only your future yield.";

export const HOW_IT_WORKS_NUMBERED_POINTS = [
  "You can stake USDC and instantly receive two tokens: PT (principal token) and YT (yield token).",
  "PT represents your stake; YT is your claim on future yield.",
  "YT is your prediction bankroll, your principal always remains safe.",
  "You can use YT for predictions to boost your future yield.",
] as const;
