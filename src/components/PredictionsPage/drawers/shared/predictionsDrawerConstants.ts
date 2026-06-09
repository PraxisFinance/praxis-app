import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import { YT_ICON_URL } from "@/shared/constants/tokenIconUrls";

export const PREDICTIONS_DRAWER_MAX_BALANCE =
  DEFAULT_BALANCES.find((balance) => balance.iconUrl === YT_ICON_URL)?.value ??
  DEFAULT_BALANCES[0]?.value ??
  "0";
