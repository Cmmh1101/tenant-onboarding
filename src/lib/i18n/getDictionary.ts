import type { Locale } from "./config";
import es from "./dictionaries/es.json";
import en from "./dictionaries/en.json";
import pt from "./dictionaries/pt.json";

export type Dictionary = typeof es;

const dictionaries: Record<Locale, Dictionary> = { es, en, pt };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.es;
}

/** Simple {placeholder} interpolation helper. */
export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}
