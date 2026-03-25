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
    }
  | {
      kind: "ended";
      label?: string;
      /** Кратко, что произошло (опционально): «Resolved Up», «Void», … */
      resolutionSummary?: string;
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
  assetSymbol: string;
  iconUrl: string;
  status: CryptoPredictionStatus;
  /** ISO 8601 — конец приёма ставок / окончание окна для подписи «End in: …» */
  endsAt: string;
  /** Совпадает с вкладками фильтра типа прогноза (кроме «all») */
  predictionType: Exclude<CryptoPredictionTypeFilterId, "all">;
  /** Можно ли открыть ставку / предикт (закрыт рынок, технические причины) */
  isTradingOpen: boolean;
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
