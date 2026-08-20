"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import {
  DEFAULT_FILES, DEFAULT_VALUES, DRAFT_KEY, FormFiles, FormValues, TOTAL_STEPS, FileValue,
} from "./types";
import type { Locale } from "@/lib/i18n/config";

type FieldName = keyof FormValues;
type FileName = keyof FormFiles;

const REQUIRED_FIELDS_BY_STEP: Record<number, FieldName[]> = {
  1: ["email_address", "institution_name", "legal_name", "domain_mask", "institution_code", "license_number"],
  2: ["admissions_email", "student_support_email", "operations_email"],
  3: ["director_name", "signatory_role", "address", "state_province", "country"],
  4: ["color_primary"],
  5: ["url_homepage"],
  6: [],
};

const EMAIL_FIELDS = new Set<FieldName>(["email_address", "admissions_email", "student_support_email", "operations_email"]);
const URL_FIELDS = new Set<FieldName>(["url_homepage"]);

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

interface DraftShape {
  values: FormValues;
  step: number;
  started: boolean;
}

function loadDraft(): DraftShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      values: { ...DEFAULT_VALUES, ...parsed.values },
      step: parsed.step || 1,
      started: Boolean(parsed.started),
    };
  } catch {
    return null;
  }
}

interface FormContextValue {
  values: FormValues;
  files: FormFiles;
  step: number;
  started: boolean;
  isHydrated: boolean;
  errors: Record<string, string>;
  submitting: boolean;
  submitStatus: "idle" | "syncing" | "synced" | "error";
  submitErrorMsg: string;
  submitted: boolean;
  setField: (name: FieldName, value: string | boolean) => void;
  setFile: (name: FileName, file: FileValue | null) => void;
  goNext: (validationMessages: { required: string; invalidEmail: string; invalidUrl: string }) => boolean;
  goBack: () => void;
  goToStep: (n: number) => void;
  goStart: () => void;
  saveDraft: () => void;
  submitForm: (locale: Locale, messages: { agreeRequired: string; submitError: string }) => Promise<boolean>;
  resetForm: () => void;
  lastDraftSavedAt: number | null;
}

const FormContext = createContext<FormContextValue | null>(null);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [files, setFiles] = useState<FormFiles>(DEFAULT_FILES);
  const [step, setStep] = useState(1);
  const [started, setStarted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<number | null>(null);
  const hydrated = useRef(false);

  // Hydrate from localStorage on mount (client only). This intentionally sets
  // state inside an effect rather than a lazy useState initializer: reading
  // localStorage during the initial render would make the client's first
  // render diverge from the server-rendered HTML and trigger a hydration
  // mismatch. Running it post-mount keeps SSR output and first paint in sync.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(draft.values);
      setStep(draft.step);
      setStarted(draft.started);
    }
    hydrated.current = true;
    setIsHydrated(true);
  }, []);

  const saveDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    // Once the form has been successfully submitted, never resurrect the
    // just-cleared draft — otherwise the periodic/debounced autosave below
    // would silently write the submitted values back to localStorage and a
    // returning visitor (or a page refresh) would see stale, already-sent
    // data instead of a blank form.
    if (submitted) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ values, step, started }));
      setLastDraftSavedAt(Date.now());
    } catch {
      /* ignore quota errors */
    }
  }, [values, step, started, submitted]);

  // Autosave every 30s + whenever values change (debounced).
  useEffect(() => {
    if (!hydrated.current || submitted) return;
    const t = setTimeout(saveDraft, 800);
    return () => clearTimeout(t);
  }, [values, step, started, submitted, saveDraft]);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [saveDraft, submitted]);

  const setField = useCallback((name: FieldName, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const setFile = useCallback((name: FileName, file: FileValue | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  }, []);

  const validateStep = useCallback(
    (n: number, messages: { required: string; invalidEmail: string; invalidUrl: string }) => {
      const required = REQUIRED_FIELDS_BY_STEP[n] || [];
      const nextErrors: Record<string, string> = {};
      for (const field of required) {
        const val = String(values[field] ?? "").trim();
        if (!val) {
          nextErrors[field] = messages.required;
          continue;
        }
        if (EMAIL_FIELDS.has(field) && val !== "N/A" && !isValidEmail(val)) {
          nextErrors[field] = messages.invalidEmail;
          continue;
        }
        if (URL_FIELDS.has(field) && val !== "N/A" && !isValidUrl(val)) {
          nextErrors[field] = messages.invalidUrl;
        }
      }
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    },
    [values]
  );

  const goNext = useCallback(
    (messages: { required: string; invalidEmail: string; invalidUrl: string }) => {
      const ok = validateStep(step, messages);
      if (ok && step < TOTAL_STEPS) setStep((s) => s + 1);
      return ok;
    },
    [step, validateStep]
  );

  const goBack = useCallback(() => setStep((s) => Math.max(1, s - 1)), []);
  const goToStep = useCallback((n: number) => setStep(Math.min(TOTAL_STEPS, Math.max(1, n))), []);
  const goStart = useCallback(() => setStarted(true), []);

  const resetForm = useCallback(() => {
    setValues(DEFAULT_VALUES);
    setFiles(DEFAULT_FILES);
    setStep(1);
    setStarted(false);
    setErrors({});
    setSubmitted(false);
    setSubmitStatus("idle");
    if (typeof window !== "undefined") window.localStorage.removeItem(DRAFT_KEY);
  }, []);

  const submitForm = useCallback(
    async (locale: Locale, messages: { agreeRequired: string; submitError: string }) => {
      if (!values.agreeTerms) {
        setErrors((prev) => ({ ...prev, agreeTerms: messages.agreeRequired }));
        return false;
      }
      setSubmitting(true);
      setSubmitStatus("syncing");
      setSubmitErrorMsg("");
      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: locale,
            submitted_at: new Date().toISOString(),
            ...values,
            ...files,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          throw new Error(data?.error || messages.submitError);
        }
        setSubmitStatus("synced");
        setSubmitted(true);
        if (typeof window !== "undefined") window.localStorage.removeItem(DRAFT_KEY);
        return true;
      } catch (err) {
        setSubmitStatus("error");
        setSubmitErrorMsg(err instanceof Error ? err.message : messages.submitError);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [values, files]
  );

  const value = useMemo<FormContextValue>(
    () => ({
      values, files, step, started, isHydrated, errors, submitting, submitStatus, submitErrorMsg, submitted,
      setField, setFile, goNext, goBack, goToStep, goStart, saveDraft, submitForm, resetForm, lastDraftSavedAt,
    }),
    [values, files, step, started, isHydrated, errors, submitting, submitStatus, submitErrorMsg, submitted,
      setField, setFile, goNext, goBack, goToStep, goStart, saveDraft, submitForm, resetForm, lastDraftSavedAt]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used within a FormProvider");
  return ctx;
}
