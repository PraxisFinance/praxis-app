"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [referralCode, setReferralCode] = useState("");
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/main");
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/1.png')" }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-5 py-11 max-w-md mx-auto">
        {/* Title Section */}
        <h1 className="text-center text-3xl sm:text-4xl font-bold leading-tight sm:leading-10 text-indigo-950">
          Welcome to Praxis: new view on prediction market!
        </h1>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4">
          {/* Referral Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter referral link"
              className="flex-1 h-10 sm:h-11 px-4 bg-slate-200 rounded-[5px] text-sm text-indigo-950 placeholder:text-indigo-950/50 outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button 
              className="h-10 sm:h-11 w-10 sm:w-11 flex-shrink-0 bg-violet-400 rounded-[5px] flex items-center justify-center hover:bg-violet-500 active:bg-violet-600 transition-colors"
              aria-label="Submit referral"
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 14 11" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
              >
                <path 
                  d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Get Started Button */}
          <button 
            onClick={handleGetStarted}
            className="w-full h-10 sm:h-11 bg-violet-400 rounded-[5px] flex items-center justify-center hover:bg-violet-500 active:bg-violet-600 transition-colors"
          >
            <span className="text-white text-base font-medium">
              Get Started!
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
