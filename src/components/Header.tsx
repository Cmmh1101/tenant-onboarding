"use client";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { interpolate } from "@/lib/i18n/getDictionary";
import { TOTAL_STEPS } from "@/lib/form/types";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ dict, locale, step }: { dict: Dictionary; locale: Locale; step: number }) {
  return (
    <header className="bg-teal">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:px-7">
        <div className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <polygon points="19,7 36,15 19,23 2,15" fill="#ffffff" />
            <path d="M10 18v8c0 3.3 4 6 9 6s9-2.7 9-6v-8l-9 4.5L10 18z" fill="#ffffff" fillOpacity="0.85" />
            <line x1="36" y1="15" x2="36" y2="25" stroke="#F38F1D" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="36" cy="26.5" r="2.2" fill="#F38F1D" />
          </svg>
          <span className="text-[19px] font-extrabold tracking-tight text-white">EDUGOGO</span>
        </div>
        <div className="flex items-center gap-4">
          {step >= 1 && (
            <span className="hidden text-[13px] font-medium text-white/85 sm:inline">
              {interpolate(dict.progress.stepOf, { n: String(step), total: String(TOTAL_STEPS) })}
            </span>
          )}
          <LanguageSwitcher locale={locale} variant="onTeal" />
        </div>
      </div>
    </header>
  );
}
