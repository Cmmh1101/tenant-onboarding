import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

// Fallback in case middleware doesn't run (e.g. static export edge cases).
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
