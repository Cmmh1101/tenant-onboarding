"use client";

import type { Dictionary } from "@/lib/i18n/getDictionary";
import { interpolate } from "@/lib/i18n/getDictionary";

interface SuccessModalProps {
  dict: Dictionary;
  visible: boolean;
  institutionName: string;
  email: string;
  status: "idle" | "syncing" | "synced" | "error";
  errorMsg: string;
  onClose: () => void;
}

export function SuccessModal({ dict, visible, institutionName, email, status, errorMsg, onClose }: SuccessModalProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#001e1e]/55 p-6 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-pop-in w-full max-w-[480px] rounded-2xl bg-white p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-lt text-4xl text-teal">
          ✓
        </div>
        <h2 className="mb-3 text-2xl font-extrabold text-gray-900">{dict.modal.title}</h2>
        <p className="mb-2.5 text-sm leading-relaxed text-gray-600">
          {interpolate(dict.modal.body, { institution: institutionName || "—" })}
        </p>
        <p className="my-4 flex items-center justify-center gap-2 rounded-lg border border-teal/10 bg-teal-xlt px-4 py-3 text-[13px] text-gray-600">
          ✉️ {interpolate(dict.modal.emailNote, { email: email || "—" })}
        </p>
        <div className="mb-1 flex min-h-6 items-center justify-center gap-2 text-[13px] font-medium">
          {status === "syncing" && <span className="text-gray-400">⏳ {dict.modal.syncing}</span>}
          {status === "synced" && <span className="text-green-600">{dict.modal.synced}</span>}
          {status === "error" && <span className="text-red-600">{errorMsg || dict.modal.error}</span>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-teal bg-teal px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-teal-mid"
        >
          ↻ {dict.modal.resendBtn}
        </button>
      </div>
    </div>
  );
}
