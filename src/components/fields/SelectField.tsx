"use client";

import { Field, inputBaseClass, inputErrorClass } from "./Field";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  required?: boolean;
  full?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  options: Option[];
  placeholder: string;
  bare?: boolean;
}

export function SelectField({ label, required, full, value, onChange, error, options, placeholder, bare }: SelectFieldProps) {
  return (
    <Field label={label} required={required} error={error} full={full} bare={bare}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBaseClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2216%22%20height=%2216%22%20fill=%22%236b7280%22%20viewBox=%220%200%2016%2016%22%3E%3Cpath%20d=%22M7.247%2011.14%202.451%205.658C1.885%205.013%202.345%204%203.204%204h9.592a1%201%200%200%201%20.753%201.659l-4.796%205.48a1%201%200%200%201-1.506%200z%22/%3E%3C/svg%3E')] bg-[right_12px_center] bg-no-repeat pr-9 ${error ? inputErrorClass : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </Field>
  );
}
