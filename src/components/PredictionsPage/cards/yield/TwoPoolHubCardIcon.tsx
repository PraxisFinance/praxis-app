import { UsdcTokenIcon } from "@/components/icons/base";
import type { TokenIconSize } from "@/components/icons/base";

export type TwoPoolHubCardIconSize = "sm" | "lg";

const ICON_LAYOUT: Record<
  TwoPoolHubCardIconSize,
  { box: number; currency: TokenIconSize; currencyOffset: string }
> = {
  sm: { box: 25, currency: 14, currencyOffset: "-right-0.5 -bottom-0.5" },
  lg: { box: 36, currency: 16, currencyOffset: "-right-0.5 -bottom-0.5" },
};

export function TwoPoolHubCardPraxisIcon({ size = 25 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="25" height="25" rx="3" fill="#9787F4" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.1274 5.0498C19.1549 5.0498 19.9878 5.84724 19.9878 6.83094V14.1668C19.9878 14.3836 19.8043 14.5593 19.5779 14.5593H16.9269C16.5797 14.5605 16.2986 14.8303 16.2986 15.163V16.2196C16.2986 16.4364 16.1151 16.6121 15.8887 16.6121H10.3391C9.99086 16.6121 9.70851 16.8824 9.70851 17.2158V20.6574C9.70851 20.8741 9.52499 21.0498 9.2986 21.0498H6.3977C6.17132 21.0498 5.98779 20.8741 5.98779 20.6574V7.67622C5.98779 7.45947 6.17132 7.28377 6.3977 7.28377H8.85716C9.20545 7.28377 9.48779 7.01345 9.48779 6.67999V5.44226C9.48779 5.22551 9.67132 5.0498 9.8977 5.0498H18.1274ZM10.3391 7.55547C9.99086 7.55547 9.70851 7.82578 9.70851 8.15924V13.3517L9.7087 13.367C9.71706 13.6882 9.98742 13.9471 10.3229 13.9553L10.3391 13.9555H15.6364C15.9847 13.9555 16.2671 13.6851 16.2671 13.3517V8.15924C16.2671 7.82578 15.9847 7.55546 15.6364 7.55547H10.3391Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.1274 5.0498C18.1549 5.0498 18.9878 5.84724 18.9878 6.83094V14.1668C18.9878 14.3836 18.8043 14.5593 18.5779 14.5593H15.9269C15.5797 14.5605 15.2986 14.8303 15.2986 15.163V16.2196C15.2986 16.4364 15.1151 16.6121 14.8887 16.6121H9.33914C8.99086 16.6121 8.70851 16.8824 8.70851 17.2158V20.6574C8.70851 20.8741 8.52499 21.0498 8.2986 21.0498H5.3977C5.17132 21.0498 4.98779 20.8741 4.98779 20.6574V7.67622C4.98779 7.45947 5.17132 7.28377 5.3977 7.28377H7.85716C8.20545 7.28377 8.48779 7.01345 8.48779 6.67999V5.44226C8.48779 5.22551 8.67132 5.0498 8.8977 5.0498H17.1274ZM9.33914 7.55547C8.99086 7.55547 8.70851 7.82578 8.70851 8.15924V13.3517L8.7087 13.367C8.71706 13.6882 8.98742 13.9471 9.32285 13.9553L9.33914 13.9555H14.6364C14.9847 13.9555 15.2671 13.6851 15.2671 13.3517V8.15924C15.2671 7.82578 14.9847 7.55546 14.6364 7.55547H9.33914Z"
        fill="#ECEBF2"
      />
    </svg>
  );
}

export function TwoPoolHubCardCurrencyIcon({ size = 14 }: { size?: TokenIconSize }) {
  return <UsdcTokenIcon size={size} />;
}

export function TwoPoolHubCardIcon({ size = "sm" }: { size?: TwoPoolHubCardIconSize }) {
  const layout = ICON_LAYOUT[size];

  return (
    <div
      className="relative shrink-0"
      style={{ width: layout.box, height: layout.box }}
      aria-hidden
    >
      <div className="relative z-0">
        <TwoPoolHubCardPraxisIcon size={layout.box} />
      </div>
      <div className={`absolute z-10 leading-none ${layout.currencyOffset}`}>
        <TwoPoolHubCardCurrencyIcon size={layout.currency} />
      </div>
    </div>
  );
}
