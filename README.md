# Praxis Base App

**The principal-protected prediction market on Base.**

Praxis lets users participate in prediction markets — sport, economic, and random events — while keeping their principal safe through yield-bearing vaults and YT (Yield Token) mechanics. Built as a [Farcaster Mini App](https://docs.farcaster.xyz/developers/miniapps) on the [Base](https://base.org) network.

## Tech Stack

| Layer      | Technology                                                      |
| ---------- | --------------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router, SSR)              |
| UI         | React 19, Tailwind CSS 4, shadcn/ui, Framer Motion              |
| Web3       | wagmi v3, viem v2, `@base-org/account`                          |
| State      | Zustand, TanStack React Query v5                                |
| Forms      | react-hook-form, Zod                                            |
| Components | Vaul (drawers), Embla (carousel), Sonner (toasts), Lucide icons |

## Features

- **Prediction Markets** — Sport (team pools & odds), economic (binary outcomes), and random (RYD — Random Yield Distribution) events
- **Principal Protection** — Deposit into vaults with maturity dates and APY; principal stays safe while yield funds predictions
- **YT Tokens** — Yield Tokens represent your share of vault returns
- **Claims & History** — Track pending and claimed income from resolved events
- **Leaderboard & Referrals** — Compete with other users and earn through referrals
- **Statistics** — Visual charts of activity and performance

## Getting Started 1

### Prerequisites

- Node.js 20+
- pnpm (recommended)

### Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout with Farcaster metadata
│   ├── providers.tsx     # Wagmi + React Query providers
│   └── (app)/            # App shell (header, bottom nav)
│       ├── main/         # Main dashboard
│       └── history/      # Transaction history
├── components/
│   ├── MainPage/         # Balances, menu, vault info
│   ├── HistoryPage/      # History view
│   ├── ConnectWallet.tsx  # Wallet connection UI
│   ├── BottomNav.tsx     # Tab navigation
│   ├── Header.tsx        # App header
│   └── ui/               # Shared UI primitives
├── config/
│   └── wagmi.ts          # Chain & connector config (Base Sepolia)
├── stores/               # Zustand state management
│   ├── accountStore.ts   # Wallet, deposits, YT token balances
│   ├── eventsStore.ts    # Prediction events & pools
│   ├── claimsStore.ts    # Pending & claimed income
│   ├── depositsStore.ts  # Vaults & user positions
│   ├── historyStore.ts   # Transaction history
│   ├── referralsStore.ts # Referral tracking
│   ├── leaderboardStore.ts
│   └── statisticsStore.ts
└── lib/
    └── utils.ts          # Shared utilities
```

## Network

Currently configured for **Base Sepolia** testnet. Chain and transport settings live in `src/config/wagmi.ts`.

## Farcaster Integration

The app registers as a Farcaster Mini App via `public/.well-known/farcaster.json`. Metadata (OG tags, miniapp launch button) is generated dynamically in the root layout.

## License

Private — all rights reserved.
