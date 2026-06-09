import type { MouseEvent } from "react";

/** Keeps hub card link navigation from firing when an action button is pressed. */
export function stopHubCardLinkNavigation(event: MouseEvent) {
  event.stopPropagation();
}
