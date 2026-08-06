"use client";

import { useRef, useState } from "react";
import { Field } from "./Field";
import type { FileValue } from "@/lib/form/types";

interface PdfUploadFieldProps {
  label: string;
  hint?: string;
  value: FileValue | null;
  onChange: (file: FileValue | null) => void;
  maxSizeMb?: number;
  strings: {
    dragDropText: string;
    clickSelectText: string;
    pdfHint: string;
    removeFile: string;
    fileTooLarge: string;
    invalidFileType: string;
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfUploadField({ label, hint, value, onChange, maxSizeMb = 8, strings }: PdfUploadFieldProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError("");
    if (file.type !== "application/pdf") {
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
    <Field label={label} hint={hint} error={error} badge="PDF" bare>
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
          className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-5 py-6 text-center transition ${
            dragOver ? "border-teal bg-teal-xlt" : "border-gray-300 bg-white hover:border-teal hover:bg-teal-xlt"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <svg className="h-7 w-7 text-teal-mid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm text-gray-600">
            {strings.dragDropText} <span className="font-semibold text-teal underline">{strings.clickSelectText}</span>
          </p>
          <p className="text-xs text-gray-400">{strings.pdfHint}</p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-700">{value.name}</p>
              <p className="text-xs text-gray-400">{formatBytes(value.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            ✕ {strings.removeFile}
          </button>
        </div>
      )}
    </Field>
  );
}
