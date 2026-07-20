import { YtTokenIcon } from "@/components/icons/base";
import { HISTORY_EVENT_TYPE_LABELS } from "@/shared/constants/history";
import type { HistoryEvent } from "@/shared/types/history";
import { formatHistoryTimestamp, formatSignedHistoryAmount } from "./historyEventFormat";
import { HistoryEventTypeIcon } from "./HistoryEventTypeIcon";

export function HistoryEventCard({
  event,
  label,
}: {
  event: HistoryEvent;
  label?: string;
}) {
  const displayLabel = label ?? HISTORY_EVENT_TYPE_LABELS[event.type];

  return (
    <article className="flex flex-col gap-0 rounded-sm bg-main-grayPurple/60 p-2">
      <time
        className="text-main-darkPurple text-2xs leading-4 tabular-nums pl-2"
        dateTime={new Date(event.timestamp).toISOString()}
      >
        {formatHistoryTimestamp(event.timestamp)}
      </time>

      <div className="flex items-center min-w-0">
        <HistoryEventTypeIcon type={event.type} />
        <span className="text-main-darkPurple min-w-0 flex-1 truncate text-sm leading-5">
          {displayLabel}
        </span>

        <div className="flex shrink-0 items-center gap-1.5 rounded-sm bg-main-grayPurple px-2 py-1">
          <span className="inline-flex shrink-0" aria-hidden>
            <YtTokenIcon size={14} className="rounded-full" />
          </span>
          <span className="text-main-darkPurple text-2xs leading-4 tabular-nums">
            {formatSignedHistoryAmount(event.amount)}
          </span>
        </div>
      </div>
    </article>
  );
}
