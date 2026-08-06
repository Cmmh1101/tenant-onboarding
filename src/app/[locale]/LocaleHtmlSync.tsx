"use client";

import { useEffect } from "react";

/** Keeps <html lang> in sync with the active locale segment (root layout is static). */
export function LocaleHtmlSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
