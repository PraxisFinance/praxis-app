/** Temporary UI mocks until referrals are wired to the API. */

export const INVITE_FRIENDS_ROUTE = "/invite-friends";

export const INVITE_FRIENDS_MOCK_REFERRAL_CODE = "PRAXIS-7X9K2M";

export const INVITE_FRIENDS_MOCK_FRIENDS = [
  { id: "ref-1", name: "Mizori", score: 1_000_000 },
  { id: "ref-2", name: "Tsunami", score: 750_000 },
  { id: "ref-3", name: "Eclipse", score: 500_000 },
  { id: "ref-4", name: "Nebula", score: 250_000 },
  { id: "ref-5", name: "Zenith", score: 100_000 },
] as const;
