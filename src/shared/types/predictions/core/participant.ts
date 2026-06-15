/** Binary market outcome (Yes/No, Up/Down, Inside/Outside). */
export type PredictionOutcome = {
  id: string;
  label: string;
  odds?: number;
  poolPercent?: number;
};

/** Match participant (team or player side). */
export type PredictionParticipant = {
  name: string;
  logoUrl: string;
  odds: number;
  score?: number;
};

export type PredictionBinaryOutcomes = [PredictionOutcome, PredictionOutcome];

/** Crypto markets require odds and pool share on both outcomes. */
export type CryptoBinaryOutcome = {
  id: string;
  label: string;
  odds: number;
  poolPercent: number;
};

export type CryptoBinaryOutcomes = [CryptoBinaryOutcome, CryptoBinaryOutcome];
