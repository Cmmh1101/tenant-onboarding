"use client";

import { useRef, useState } from "react";
import { Field } from "./Field";
import type { FileValue } from "@/lib/form/types";

interface ImageUploadFieldProps {
  label: string;
  hint?: string;
  value: FileValue | null;
  onChange: (file: FileValue | null) => void;
  maxSizeMb?: number;
  strings: {
    dragDropText: string;
    clickSelectText: string;
    imageHint: string;
    removeFile: string;
    fileTooLarge: string;
    invalidFileType: string;
  };
}

export function ImageUploadField({ label, hint, value, onChange, maxSizeMb = 2, strings }: ImageUploadFieldProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError(strings.invalidFileType);
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(strings.fileTooLarge);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({
        name: file.name,
        mimeType: file.type,
        size: file.size,
        dataUrl: String(e.target?.result || ""),
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <Field label={label} hint={hint} error={error} full badge="Imagen" bare>
      {!value ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-5 py-7 text-center transition ${
            dragOver ? "border-teal bg-teal-xlt" : "border-gray-300 bg-white hover:border-teal hover:bg-teal-xlt"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <svg className="h-8 w-8 text-teal-mid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 16V4m0 0L7 9m5-5l5 5M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm text-gray-600">
            {strings.dragDropText} <span className="font-semibold text-teal underline">{strings.clickSelectText}</span>
          </p>
          <p className="text-xs text-gray-400">{strings.imageHint}</p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 px-5 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.dataUrl} alt="preview" className="max-h-20 max-w-[260px] rounded-md object-contain" />
          <button
            type="button"
            onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            ✕ {strings.removeFile}
          </button>
        </div>
      )}
    </Field>
  );
}
