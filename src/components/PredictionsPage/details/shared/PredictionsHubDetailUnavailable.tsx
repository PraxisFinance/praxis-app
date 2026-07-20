export interface PredictionsHubDetailUnavailableProps {
  title?: string;
  message?: string;
}

/**
 * Fallback body for prediction detail screens when an item cannot be rendered:
 * an unknown category/market type, or a card that fails its type guard.
 * Rendered inside the shared detail page shell, so it only supplies body content.
 */
export function PredictionsHubDetailUnavailable({
  title = "Details unavailable",
  message = "We couldn't load the details for this prediction. Please go back and try another one.",
}: PredictionsHubDetailUnavailableProps) {
  return (
    <div className="bg-main-lightGray flex flex-col items-center gap-2 rounded-[10px] px-4 py-10 text-center">
      <p className="text-main-darkPurple text-base font-semibold">{title}</p>
      <p className="text-main-darkPurple/60 max-w-xs text-sm leading-relaxed">{message}</p>
    </div>
  );
}
