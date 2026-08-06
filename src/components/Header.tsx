"use client";

import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { interpolate } from "@/lib/i18n/getDictionary";
import { TOTAL_STEPS } from "@/lib/form/types";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ dict, locale, step }: { dict: Dictionary; locale: Locale; step: number }) {
  return (
    <header className="bg-teal">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:px-7">
        <div className="flex items-center rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
          <Image src="/edugogo-logo.png" alt="EDUGOGO" width={240} height={120} priority className="h-6 w-auto sm:h-7" />
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
