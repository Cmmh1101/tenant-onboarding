"use client";

import { Field, inputBaseClass, inputErrorClass } from "./Field";

interface TextInputProps {
  type?: "text" | "email" | "tel" | "url";
  label: string;
  placeholder?: string;
  hint?: string;
  naHint?: string;
  required?: boolean;
  full?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  prefix?: string;
  bare?: boolean;
}

export function TextInput({
  type = "text", label, placeholder, hint, naHint, required, full, value, onChange, error, prefix, bare,
}: TextInputProps) {
  return (
    <Field label={label} required={required} hint={hint} naHint={naHint} error={error} full={full} bare={bare}>
      {prefix ? (
        <div
          className={`flex items-stretch overflow-hidden rounded-lg border-[1.5px] bg-white transition focus-within:border-teal focus-within:ring-4 focus-within:ring-teal/10 ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        >
          <span className="flex items-center whitespace-nowrap border-r-[1.5px] border-gray-200 bg-teal-xlt px-3 text-[13px] font-medium text-teal-mid">
            {prefix}
          </span>
          <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full flex-1 border-none px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBaseClass} ${error ? inputErrorClass : ""}`}
        />
      )}
    </Field>
  );
}
