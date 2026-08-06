"use client";

import { ReactNode } from "react";

interface QuestionCardProps {
  number: number;
  title: string;
  tag?: string;
  hint?: string;
  children: ReactNode;
}

export function QuestionCard({ number, title, tag, hint, children }: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-3.5">
        <p className="text-[15px] font-bold leading-snug text-gray-800">
          <span className="mr-1.5 text-orange">{number}.</span>
          {title}
        </p>
        {tag && (
          <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[11.5px] text-gray-500">
            📋 {tag}
          </span>
        )}
        {hint && (
          <p className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-gray-400">
            <span>💡</span>
            {hint}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
