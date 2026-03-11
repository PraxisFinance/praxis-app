"use client";

interface BalanceCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  iconUrl?: string;
}

export function BalanceCard({ label, value, icon, iconUrl }: BalanceCardProps) {
  return (
    <div className="px-2.5 py-[5px] bg-slate-200 rounded-[5px] inline-flex flex-col justify-start items-start gap-[5px]">
      <div className="text-indigo-950 text-sm font-normal leading-4">{label}</div>
      <div className="inline-flex justify-start items-center gap-[5px]">
        {iconUrl ? (
          <img className="w-4 h-4" src={iconUrl} alt="" />
        ) : icon ? (
          icon
        ) : null}
        <div className="text-indigo-950 text-base font-medium leading-5">{value}</div>
      </div>
    </div>
  );
}
