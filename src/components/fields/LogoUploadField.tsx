"use client";

import { useRef, useState } from "react";
import { Field } from "./Field";
import type { FileValue } from "@/lib/form/types";

interface LogoUploadFieldProps {
  label: string;
  hint?: string;
  value: FileValue | null;
  onChange: (file: FileValue | null) => void;
  dark?: boolean;
  wide?: boolean;
  maxSizeMb?: number;
  allowedMimeTypes?: string[];
  recommendedDimensions?: { width: number; height: number };
  strings: {
    dragDropText: string;
    clickSelectText: string;
    removeFile: string;
    fileTooLarge: string;
    invalidFileType: string;
    dimensionWarningTemplate?: string;
  };
}

function readImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function LogoUploadField({
  label, hint, value, onChange, dark, wide, maxSizeMb = 1.5, allowedMimeTypes, recommendedDimensions, strings,
}: LogoUploadFieldProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [dimensionWarning, setDimensionWarning] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setDimensionWarning("");

    const typeOk = allowedMimeTypes ? allowedMimeTypes.includes(file.type) : file.type.startsWith("image/");
    if (!typeOk) {
      setError(strings.invalidFileType);
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(strings.fileTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = String(e.target?.result || "");
      onChange({ name: file.name, mimeType: file.type, size: file.size, dataUrl });

      if (recommendedDimensions && strings.dimensionWarningTemplate) {
        try {
          const { width, height } = await readImageDimensions(dataUrl);
          const wOff = Math.abs(width - recommendedDimensions.width) / recommendedDimensions.width;
          const hOff = Math.abs(height - recommendedDimensions.height) / recommendedDimensions.height;
          if (wOff > 0.15 || hOff > 0.15) {
            setDimensionWarning(
              strings.dimensionWarningTemplate
                .replace("{width}", String(width))
                .replace("{height}", String(height))
                .replace("{recWidth}", String(recommendedDimensions.width))
                .replace("{recHeight}", String(recommendedDimensions.height))
            );
          }
        } catch {
          /* ignore — dimension check is just a nicety */
        }
      }
    };
    reader.readAsDataURL(file);
  }

  const acceptAttr = allowedMimeTypes ? allowedMimeTypes.join(",") : "image/*";

  return (
    <Field label={label} hint={!value ? hint : undefined} error={error}>
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
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 text-center transition ${
            wide ? "h-[70px]" : "h-[90px]"
          } ${dragOver ? "border-teal bg-teal-xlt" : "border-gray-300 bg-white hover:border-teal hover:bg-teal-xlt"}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <svg className="h-5 w-5 text-teal-mid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 16V4m0 0L7 9m5-5l5 5M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-xs text-gray-500">
            {strings.dragDropText} <span className="font-semibold text-teal underline">{strings.clickSelectText}</span>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div
            className={`relative flex w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed ${
              wide ? "h-[70px]" : "h-[90px]"
            } ${dark ? "border-gray-700 bg-[#1a1a1a]" : "border-gray-200 bg-white"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.dataUrl} alt={label} className="max-h-full max-w-full object-contain p-2" />
            <button
              type="button"
              onClick={() => { onChange(null); setDimensionWarning(""); if (inputRef.current) inputRef.current.value = ""; }}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-xs text-red-600 shadow hover:bg-red-50"
              title={strings.removeFile}
            >
              ✕
            </button>
          </div>
          {hint && <span className="text-xs leading-relaxed text-gray-400">{hint}</span>}
        </div>
      )}
      {dimensionWarning && (
        <span className="flex items-start gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs leading-relaxed text-amber-800">
          ⚠️ {dimensionWarning}
        </span>
      )}
    </Field>
  );
}
