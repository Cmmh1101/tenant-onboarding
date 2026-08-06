"use client";

import { ReactNode } from "react";

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  naHint?: string;
  error?: string;
  full?: boolean;
  badge?: string;
  /** Skip rendering the label/hint chrome — used when the parent QuestionCard already shows the question title. */
  bare?: boolean;
  children: ReactNode;
}

export function Field({ label, required, hint, naHint, error, full, badge, bare, children }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      {!bare && (
        <label className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-600 text-sm">*</span>}
          {badge && (
            <span className="ml-auto rounded-full bg-teal-lt px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal">
              {badge}
            </span>
          )}
        </label>
      )}
      {bare && badge && (
        <span className="self-start rounded-full bg-teal-lt px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal">
          {badge}
        </span>
      )}
      {children}
      {!bare && hint && !error && <span className="text-xs leading-relaxed text-gray-400">{hint}</span>}
      {!bare && naHint && !error && (
        <span className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs leading-relaxed text-gray-600">
          <svg className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {naHint}
        </span>
      )}
      {error && (
        <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

export const inputBaseClass =
  "w-full rounded-lg border-[1.5px] border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal focus:ring-4 focus:ring-teal/10";

export const inputErrorClass = "border-red-500 focus:border-red-500 focus:ring-red-500/10";
