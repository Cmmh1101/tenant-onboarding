"use client";

import { useState } from "react";
import { Field } from "./Field";

interface PasswordFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  showLabel: string;
  hideLabel: string;
}

export function PasswordField({ label, hint, value, onChange, showLabel, hideLabel }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-stretch overflow-hidden rounded-lg border-[1.5px] border-gray-200 bg-white transition focus-within:border-teal focus-within:ring-4 focus-within:ring-teal/10">
        <input
          type={visible ? "text" : "password"}
          value={value}
          autoComplete="new-password"
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••••••••••"
          className="w-full flex-1 border-none px-3.5 py-2.5 font-mono text-[13px] tracking-wide text-gray-800 outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          title={visible ? hideLabel : showLabel}
          className="cursor-pointer border-l-[1.5px] border-gray-200 bg-teal-xlt px-3.5 text-gray-500 transition hover:bg-teal-lt hover:text-teal"
        >
          {visible ? "🙈" : "👁"}
        </button>
      </div>
    </Field>
  );
}
