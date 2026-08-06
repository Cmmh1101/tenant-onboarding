"use client";

import { getColorName, isValidHex } from "@/lib/colorUtils";

interface ColorFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, required, value, onChange }: ColorFieldProps) {
  const safeValue = isValidHex(value) ? value : "#000000";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11.5px] font-bold uppercase tracking-wide text-gray-600">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="flex items-center gap-2 rounded-lg border-[1.5px] border-gray-200 bg-white px-2.5 py-1.5 transition focus-within:border-teal focus-within:ring-4 focus-within:ring-teal/10">
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-8 w-8 flex-shrink-0 rounded-md"
        />
        <input
          type="text"
          value={value}
          maxLength={7}
          onChange={(e) => {
            let v = e.target.value.trim();
            if (v && !v.startsWith("#")) v = "#" + v;
            onChange(v.toUpperCase());
          }}
          className="w-[70px] border-none p-0 font-mono text-[13px] font-semibold uppercase text-gray-700 outline-none"
        />
        <span
          className="ml-auto h-6 w-6 flex-shrink-0 rounded-full shadow-sm"
          style={{ background: isValidHex(value) ? value : "#e5e7eb", border: "1px solid #ccc" }}
        />
      </div>
      <span className="text-center text-[11px] font-medium text-gray-500">
        {isValidHex(value) ? getColorName(value) : "—"}
      </span>
    </div>
  );
}
