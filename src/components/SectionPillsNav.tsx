"use client";

import type { Dictionary } from "@/lib/i18n/getDictionary";
import { TOTAL_STEPS } from "@/lib/form/types";

const STEP_ICONS = ["🏫", "🔄", "📣", "👪", "📊", "⚙️"];

export function SectionPillsNav({ dict, currentStep }: { dict: Dictionary; currentStep: number }) {
  const pct = Math.max(0, Math.min(1, (currentStep - 1) / (TOTAL_STEPS - 1))) * 100;

  return (
    <div className="relative border-b border-gray-200 bg-white">
      <div className="h-[3px] w-full bg-gray-100">
        <div className="h-full bg-orange transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 py-2.5 sm:px-7">
        {Object.entries(dict.stepNav).map(([stepNum, label]) => {
          const n = Number(stepNum);
          const active = n === currentStep;
          const completed = n < currentStep;
          return (
            <div
              key={stepNum}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1.5 text-[13px] font-medium transition sm:px-3 ${
                active
                  ? "border-orange/40 bg-orange/10 font-bold text-orange"
                  : completed
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  active ? "bg-orange text-white" : completed ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {completed ? "✓" : n}
              </span>
              <span className={active ? "inline" : "hidden sm:inline"}>{STEP_ICONS[n - 1]}</span>
              <span className={active ? "inline" : "hidden sm:inline"}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
