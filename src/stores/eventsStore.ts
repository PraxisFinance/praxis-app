import { create } from "zustand";

interface BaseEvent {
  id: string;
  lockTime: number;
  eventTime: number;
}

export interface SportEvent extends BaseEvent {
  type: "sport";
  sport: string;
  teamAName: string;
  teamAImage: string;
  teamBName: string;
  teamBImage: string;
  coefA: number;
  coefB: number;
  poolA: bigint;
  poolB: bigint;
  link: string;
}

export interface EconomicEvent extends BaseEvent {
  type: "economic";
  name: string;
  nameA: string;
  nameB: string;
  coefA: number;
  coefB: number;
  poolA: bigint;
  poolB: bigint;
}

export interface RandomEvent extends BaseEvent {
  type: "random";
  name: string;
  poolSize: bigint;
  amountOfWinners: number;
}

export type Event = SportEvent | EconomicEvent | RandomEvent;

interface EventsState {
  events: Event[];

  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  getEventsByType: <T extends Event["type"]>(type: T) => Extract<Event, { type: T }>[];
  reset: () => void;
}

const MOCK_SPORT_EVENTS: SportEvent[] = [
  {
    id: "sport-1",
    type: "sport",
    sport: "Football",
    teamAName: "Manchester United",
    teamAImage: "/teams/man-united.png",
    teamBName: "Liverpool",
    teamBImage: "/teams/liverpool.png",
    coefA: 2.15,
    coefB: 1.85,
    poolA: BigInt("50000000000"), // 50,000 USDC
    poolB: BigInt("65000000000"), // 65,000 USDC
    lockTime: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
    eventTime: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
    link: "https://example.com/match/1",
  },
  {
    id: "sport-2",
    type: "sport",
    sport: "Basketball",
    teamAName: "LA Lakers",
    teamAImage: "/teams/lakers.png",
    teamBName: "Boston Celtics",
    teamBImage: "/teams/celtics.png",
    coefA: 1.95,
    coefB: 2.05,
    poolA: BigInt("30000000000"), // 30,000 USDC
    poolB: BigInt("28000000000"), // 28,000 USDC
    lockTime: Date.now() + 1 * 24 * 60 * 60 * 1000,
    eventTime: Date.now() + 1.5 * 24 * 60 * 60 * 1000,
    link: "https://example.com/match/2",
  },
  {
    id: "sport-3",
    type: "sport",
    sport: "Tennis",
    teamAName: "Novak Djokovic",
    teamAImage: "/teams/djokovic.png",
    teamBName: "Carlos Alcaraz",
    teamBImage: "/teams/alcaraz.png",
    coefA: 1.75,
    coefB: 2.25,
    poolA: BigInt("15000000000"),
    poolB: BigInt("12000000000"),
    lockTime: Date.now() + 5 * 24 * 60 * 60 * 1000,
    eventTime: Date.now() + 6 * 24 * 60 * 60 * 1000,
    link: "https://example.com/match/3",
  },
];

const MOCK_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: "econ-1",
    type: "economic",
    name: "Fed Interest Rate Decision",
    nameA: "Rate Hike",
    nameB: "Rate Hold",
    coefA: 3.5,
    coefB: 1.35,
    poolA: BigInt("20000000000"),
    poolB: BigInt("80000000000"),
    lockTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
    eventTime: Date.now() + 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: "econ-2",
    type: "economic",
    name: "BTC Price End of Month",
    nameA: "Above $100k",
    nameB: "Below $100k",
    coefA: 1.8,
    coefB: 2.1,
    poolA: BigInt("45000000000"),
    poolB: BigInt("40000000000"),
    lockTime: Date.now() + 20 * 24 * 60 * 60 * 1000,
    eventTime: Date.now() + 21 * 24 * 60 * 60 * 1000,
  },
  {
    id: "econ-3",
    type: "economic",
    name: "ETH/BTC Ratio Q2",
    nameA: "ETH Outperforms",
    nameB: "BTC Outperforms",
    coefA: 2.4,
    coefB: 1.65,
    poolA: BigInt("25000000000"),
    poolB: BigInt("35000000000"),
    lockTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    eventTime: Date.now() + 90 * 24 * 60 * 60 * 1000,
  },
];

const MOCK_RANDOM_EVENTS: RandomEvent[] = [
  {
    id: "random-1",
    type: "random",
    name: "Weekly Lottery #42",
    poolSize: BigInt("100000000000"), // 100,000 USDC
    amountOfWinners: 10,
    lockTime: Date.now() + 5 * 24 * 60 * 60 * 1000,
    eventTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: "random-2",
    type: "random",
    name: "Monthly Grand Prize",
    poolSize: BigInt("500000000000"), // 500,000 USDC
    amountOfWinners: 3,
    lockTime: Date.now() + 25 * 24 * 60 * 60 * 1000,
    eventTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
  },
];

const initialState = {
  events: [] as Event[],
};

export const useEventsStore = create<EventsState>((set, get) => ({
  ...initialState,

  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),

  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? ({ ...e, ...updates } as Event) : e)),
    })),

  getEventsByType: <T extends Event["type"]>(type: T) => {
    return get().events.filter((e): e is Extract<Event, { type: T }> => e.type === type);
  },

  reset: () => set(initialState),
}));

export const loadMockEvents = () => {
  const store = useEventsStore.getState();
  store.setEvents([...MOCK_SPORT_EVENTS, ...MOCK_ECONOMIC_EVENTS, ...MOCK_RANDOM_EVENTS]);
};

export const isSportEvent = (event: Event): event is SportEvent => event.type === "sport";

export const isEconomicEvent = (event: Event): event is EconomicEvent => event.type === "economic";

export const isRandomEvent = (event: Event): event is RandomEvent => event.type === "random";

export const formatPool = (pool: bigint, decimals: number = 6): string => {
  const value = Number(pool) / 10 ** decimals;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const getTimeUntilLock = (lockTime: number): string => {
  const diff = lockTime - Date.now();
  if (diff <= 0) return "Locked";

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
};
