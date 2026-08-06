"use client";

import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({
  locale,
  variant = "onTeal",
}: {
  locale: Locale;
  variant?: "onTeal" | "onWhite";
}) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const rest = pathname.replace(new RegExp(`^/${locale}`), "");
    router.push(`/${next}${rest}`);
  }

  const wrapClass =
    variant === "onTeal"
      ? "bg-white/15 border border-white/25"
      : "bg-gray-100 border border-gray-200";

  return (
    <div className={`inline-flex items-center gap-0.5 rounded-lg p-0.5 ${wrapClass}`}>
      {locales.map((l) => {
        const active = l === locale;
        const activeClass =
          variant === "onTeal"
            ? "bg-white text-teal shadow-sm"
            : "bg-gray-900 text-white shadow-sm";
        const inactiveClass = variant === "onTeal" ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-gray-700";
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            className={`rounded-[6px] px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-wide transition ${
              active ? activeClass : inactiveClass
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
