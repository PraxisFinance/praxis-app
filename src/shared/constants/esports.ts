export const ESPORTS_GAMES = [
  { id: "dota2", label: "DOTA2", iconUrl: "/esports/dota2.png" },
  { id: "csgo", label: "CSGO", iconUrl: "/esports/csgo.png" },
  { id: "lol", label: "LOL", iconUrl: "/esports/lol.png" },
  { id: "cod", label: "Call of Duty", iconUrl: "/esports/cod.png" },
  { id: "valorant", label: "Valorant", iconUrl: "/esports/valorant.png" },
] as const;

export type EsportsGameFilterId = (typeof ESPORTS_GAMES)[number]["id"];

export const ESPORTS_TIME_FILTERS = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "1h", label: "1h" },
  { id: "6h", label: "6h" },
  { id: "12h", label: "12h" },
  { id: "1d", label: "1d" },
  { id: "2d", label: "2d" },
  { id: "1w", label: "1w" },
] as const;

export type EsportsTimeFilterId = (typeof ESPORTS_TIME_FILTERS)[number]["id"];
