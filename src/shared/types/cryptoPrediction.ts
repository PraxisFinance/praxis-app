import type { CryptoPredictionTypeFilterId } from "@/shared/constants/cryptocurrencyPredictions";

/**
 * Market lifecycle — строка статуса («Live now», «End in…», и т.д.) и индикаторы в карточке.
 */
export type CryptoPredictionStatus =
  | {
      kind: "live";
      /** Подпись у точки live; по умолчанию в UI можно показать «Live now» */
      label?: string;
    }
  | {
      kind: "upcoming";
      label?: string;
      /** ISO 8601 — старт окна / приёма ставок для строки «Starts at: …» */
      startsAt?: string;
    }
  | {
      /** Pool no longer accepting bets but resolution has not yet started (chain-Locked, or after vote deadline / before expiration). */
      kind: "locked";
      label?: string;
    }
  | {
      /** Lock period ended on the calendar but the indexer still shows the pool Open — settlement in flight. */
      kind: "resolving";
      label?: string;
    }
  | {
      kind: "ended";
      label?: string;
      /** Кратко, что произошло (опционально): «Resolved Up», «Void», … */
      resolutionSummary?: string;
      /** ISO 8601 — момент завершения (суффикс к статусу «Ended») */
      endedAt?: string;
    };

/**
 * Одна сторона бинарного рынка (Up/Down, Yes/No, Inside/Outside и т.п.).
 * `odds` — коэффициент выплаты (как в эспорте).
 * `poolPercent` — доля пула / «настроение» для полосы 0–100 (два исхода обычно в сумме ~100).
 */
export type CryptoBinaryOutcome = {
  id: string;
  label: string;
  odds: number;
  poolPercent: number;
};

/**
 * Уровень цены с парой Yes / No (макет: список целей с маленькими Yes/No).
 */
export type CryptoStrikeBinary = {
  id: string;
  /** Например «$1.24» или «Above $2.10» */
  targetLabel: string;
  yes: { odds: number; poolPercent?: number };
  no: { odds: number; poolPercent?: number };
};

type CryptoPredictionBase = {
  id: string;
  /** Заголовок карточки, напр. «AERO Up or Down» */
  title: string;
  /** Human-readable description from the offchain database, if available. */
  description?: string | null;
  /** Taxonomy tags from the offchain database, if available. */
  categories?: string[];
  assetSymbol: string;
  iconUrl: string;
  status: CryptoPredictionStatus;
  /** ISO 8601 — конец приёма ставок / окончание окна для подписи «End in: …» */
  endsAt: string;
  /** Совпадает с вкладками фильтра типа прогноза (кроме «all» и Two-Pool) */
  predictionType: Exclude<CryptoPredictionTypeFilterId, "all" | "two_pool">;
  /** Можно ли открыть ставку / предикт (закрыт рынок, технические причины) */
  isTradingOpen: boolean;
  /** On-chain pool ID passed to `depositBet(poolId, ...)`. */
  cpfPoolId: bigint;
  /** CPF contract address for this pool — resolved from vault, not from env. */
  cpfAddress: `0x${string}`;
  /** Formatted trading volume for card header, e.g. "$858.74K Vol." */
  volumeLabel?: string;
};

/** Up/Down: две крупные кнопки, общая двухцветная полоса по poolPercent. */
export type CryptoPredictionUpDown = CryptoPredictionBase & {
  predictionType: "up_down";
  outcomes: [CryptoBinaryOutcome, CryptoBinaryOutcome];
};

/** Above/Below: несколько уровней с Yes/No. */
export type CryptoPredictionAboveBelow = CryptoPredictionBase & {
  predictionType: "above_below";
  strikes: CryptoStrikeBinary[];
};

/** Price range: рынок «оказалась ли цена в коридоре» — два исхода + границы для текста в шапке. */
export type CryptoPredictionPriceRange = CryptoPredictionBase & {
  predictionType: "price_range";
  lowerBoundLabel: string;
  upperBoundLabel: string;
  outcomes: [CryptoBinaryOutcome, CryptoBinaryOutcome];
};

/** Hit price: дойдёт ли цена до уровня к endsAt — бинарный исход. */
export type CryptoPredictionHit = CryptoPredictionBase & {
  predictionType: "hit";
  targetPriceLabel: string;
  outcomes: [CryptoBinaryOutcome, CryptoBinaryOutcome];
};

export type CryptoPrediction =
  | CryptoPredictionUpDown
  | CryptoPredictionAboveBelow
  | CryptoPredictionPriceRange
  | CryptoPredictionHit;
