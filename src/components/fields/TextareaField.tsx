"use client";

import { Field, inputBaseClass, inputErrorClass } from "./Field";

interface TextareaFieldProps {
  label: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  full?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxLength?: number;
  charactersSuffix?: string;
  rows?: number;
  bare?: boolean;
}

export function TextareaField({
  label, placeholder, hint, required, full = true, value, onChange, error, maxLength, charactersSuffix, rows = 3, bare,
}: TextareaFieldProps) {
  return (
    <Field label={label} required={required} hint={hint} error={error} full={full} bare={bare}>
      <textarea
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBaseClass} resize-y ${error ? inputErrorClass : ""}`}
      />
      {maxLength && (
        <div className="text-right text-xs text-gray-400">
          {value.length}/{maxLength} {charactersSuffix}
        </div>
      )}
    </Field>
  );
}
