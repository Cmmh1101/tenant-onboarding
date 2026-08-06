"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { useFormContext } from "@/lib/form/FormContext";
import { TOTAL_STEPS } from "@/lib/form/types";
import { Header } from "./Header";
import { SectionPillsNav } from "./SectionPillsNav";
import { IntroScreen } from "./IntroScreen";
import { SuccessModal } from "./SuccessModal";
import { Step1Institution } from "./steps/Step1Institution";
import { Step2Contacts } from "./steps/Step2Contacts";
import { Step3Director } from "./steps/Step3Director";
import { Step4Branding } from "./steps/Step4Branding";
import { Step5Links } from "./steps/Step5Links";
import { Step6Documents } from "./steps/Step6Documents";

const STEPS = [Step1Institution, Step2Contacts, Step3Director, Step4Branding, Step5Links, Step6Documents];

export function Wizard({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const {
    step, goNext, goBack, goStart, started, isHydrated, submitForm, resetForm,
    submitting, submitStatus, submitErrorMsg, submitted, values,
  } = useFormContext();
  const [shake, setShake] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const StepComponent = STEPS[step - 1];

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function handleNext() {
    const ok = goNext({
      required: dict.validation.required,
      invalidEmail: dict.validation.invalidEmail,
      invalidUrl: dict.validation.invalidUrl,
    });
    if (!ok) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitForm(locale, {
      agreeRequired: dict.validation.agreeRequired,
      submitError: dict.validation.submitError,
    });
  }

  if (!isHydrated) {
    return <div className="min-h-screen bg-teal" />;
  }

  if (!started) {
    return <IntroScreen dict={dict} locale={locale} onStart={goStart} />;
  }

  return (
    <>
      <Header dict={dict} locale={locale} step={step} />
      <SectionPillsNav dict={dict} currentStep={step} />
      <main className="min-h-screen flex-1 bg-gray-50 pb-20">
        <div ref={containerRef} className={shake ? "animate-shake" : ""}>
          <form onSubmit={handleSubmit}>
            <StepComponent dict={dict} locale={locale} />

            <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 pb-4 pt-2 sm:px-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-teal hover:bg-teal-lt hover:text-teal"
                >
                  ← {dict.nav.back}
                </button>
              )}
              <div className="flex-1" />
              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-orange-mid"
                >
                  {dict.nav.next} →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-orange-mid disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? dict.nav.submitting : `✈ ${dict.nav.submit}`}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <SuccessModal
        dict={dict}
        visible={submitted}
        institutionName={values.institution_name}
        email={values.email_address}
        status={submitStatus}
        errorMsg={submitErrorMsg}
        onClose={resetForm}
      />

      {submitStatus === "error" && !submitted && (
        <div className="fixed bottom-7 right-7 z-[999] flex items-center gap-2.5 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-medium text-white shadow-xl">
          ⚠ {submitErrorMsg || dict.modal.error}
        </div>
      )}
    </>
  );
}
