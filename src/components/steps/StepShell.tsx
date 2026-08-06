"use client";

import { ReactNode } from "react";
import { interpolate } from "@/lib/i18n/getDictionary";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { TOTAL_STEPS } from "@/lib/form/types";

export function StepShell({
  icon, step, title, desc, dict, children,
}: {
  icon: string;
  step: number;
  title: string;
  desc: string;
  dict: Dictionary;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start gap-3.5">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-orange/25 bg-orange/10 text-xl">
          {icon}
        </div>
        <div>
          <p className="text-[11.5px] font-bold uppercase tracking-wider text-gray-400">
            {interpolate(dict.progress.stepOf, { n: String(step), total: String(TOTAL_STEPS) })}
          </p>
          <h2 className="text-xl font-bold text-teal">{title}</h2>
          <p className="mt-0.5 text-[13px] text-gray-500">{desc}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
