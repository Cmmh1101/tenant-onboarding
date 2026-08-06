"use client";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";

const STEP_ICONS = ["🏫", "🔄", "📣", "🏛", "🎓", "⚙️"];
const QUESTION_COUNTS = [6, 3, 6, 3, 6, 5];

export function IntroScreen({ dict, locale, onStart }: { dict: Dictionary; locale: Locale; onStart: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-teal px-4 py-10">
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="absolute right-6 top-6">
          <LanguageSwitcher locale={locale} variant="onWhite" />
        </div>

        <div className="mb-6 flex flex-col items-center text-center">
          <svg width="46" height="46" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="mb-2">
            <polygon points="19,7 36,15 19,23 2,15" fill="#005E5D" />
            <path d="M10 18v8c0 3.3 4 6 9 6s9-2.7 9-6v-8l-9 4.5L10 18z" fill="#287A78" />
            <line x1="36" y1="15" x2="36" y2="25" stroke="#DF7C24" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="36" cy="26.5" r="2.2" fill="#DF7C24" />
          </svg>
          <div className="flex items-baseline text-[26px] font-extrabold leading-none tracking-tight">
            <span className="text-orange">EDU</span>
            <span className="text-teal">GOGO</span>
          </div>
          <h1 className="mt-3 text-lg font-bold text-teal">{dict.intro.title}</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-gray-500">{dict.intro.description}</p>
        </div>

        <div className="mb-6 flex flex-col gap-2">
          {Object.entries(dict.stepNav).map(([stepNum, label]) => {
            const n = Number(stepNum);
            return (
              <div
                key={stepNum}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 text-[13.5px]"
              >
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <span>{STEP_ICONS[n - 1]}</span>
                  <span className="font-bold text-orange">{n}.</span>
                  {label}
                </span>
                <span className="text-xs text-gray-400">
                  {QUESTION_COUNTS[n - 1]} {dict.common.questionsAbbrev}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-lg bg-orange px-5 py-3 text-[15px] font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-orange-mid"
        >
          {dict.intro.startButton}
        </button>
      </div>
    </div>
  );
}
