"use client";

import { ArrowIcon } from "./icons/ArrowIcon";

interface MenuCardProps {
  label: string;
  imageUrl?: string;
  description?: string;
  title?: string;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function MenuCard({ 
  label, 
  imageUrl, 
  description, 
  title,
  fullWidth = false,
  onClick 
}: MenuCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative bg-slate-200 rounded-[5px] overflow-hidden ${
        fullWidth ? "w-full" : "w-full"
      } h-28 text-left transition-transform active:scale-[0.98]`}
    >
      {imageUrl && (
        <img 
          className="w-full h-full object-cover absolute inset-0" 
          src={imageUrl} 
          alt={label}
        />
      )}
      
      {title && (
        <div className="absolute left-2.5 top-2.5 text-indigo-950 text-sm font-medium leading-4">
          {title}
        </div>
      )}
      
      {description && (
        <div className="absolute left-2.5 top-8 w-36 text-indigo-950 text-[10px] font-normal leading-3">
          {description}
        </div>
      )}
      
      <div className="px-2.5 py-[5px] absolute left-2.5 bottom-2.5 bg-violet-400 rounded-[30px] inline-flex justify-center items-center gap-[5px]">
        <span className="text-white text-xs font-medium leading-4">{label}</span>
        <ArrowIcon className="w-4 h-4" />
      </div>
    </button>
  );
}
