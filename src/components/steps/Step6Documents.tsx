"use client";

import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { useFormContext } from "@/lib/form/FormContext";
import { PdfUploadField } from "../fields/PdfUploadField";
import { PasswordField } from "../fields/PasswordField";
import { StepShell } from "./StepShell";
import { QuestionCard } from "./QuestionCard";
import { SummaryPanel } from "./SummaryPanel";

function LegalExplainer({ icon, what, desc, link, refText }: { icon: string; what: string; desc: string; link: string; refText: string }) {
  return (
    <div className="mb-4 flex items-start gap-3.5 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-lg">{icon}</div>
      <div>
        <p className="mb-1 text-[13px] font-semibold text-gray-800">{what}</p>
        <p className="mb-2 text-[12.5px] leading-relaxed text-gray-600">{desc}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-[12.5px] font-semibold text-teal underline hover:text-teal-mid">
          {refText}
        </a>
      </div>
    </div>
  );
}

export function Step6Documents({ dict }: { dict: Dictionary; locale?: Locale }) {
  const { values, files, errors, setField, setFile } = useFormContext();
  const f = dict.fields;

  return (
    <StepShell icon="📄" step={6} dict={dict} title={dict.stepInfo["6"].title} desc={dict.stepInfo["6"].desc}>
      <QuestionCard number={1} title={f.license_doc.label} tag={dict.sections.documents} hint={f.license_doc.hint}>
        <PdfUploadField label={f.license_doc.label} value={files.license_doc} onChange={(file) => setFile("license_doc", file)} strings={dict.common} />
      </QuestionCard>

      <QuestionCard number={2} title={f.student_manual.label} tag={dict.sections.documents} hint={f.student_manual.hint}>
        <PdfUploadField label={f.student_manual.label} value={files.student_manual} onChange={(file) => setFile("student_manual", file)} strings={dict.common} />
      </QuestionCard>

      <QuestionCard number={3} title={dict.sections.terms} tag={dict.sections.documents} hint={f.terms_doc.hint}>
        <LegalExplainer
          icon="⚖️" what={dict.legal.termsWhat} desc={dict.legal.termsDesc}
          link="https://us.dawere.com/terminos-y-condiciones" refText={dict.legal.termsRefLink}
        />
        <PdfUploadField
          label={f.terms_doc.label}
          value={files.terms_doc} onChange={(file) => setFile("terms_doc", file)} strings={dict.common}
        />
      </QuestionCard>

      <QuestionCard number={4} title={dict.sections.privacy} tag={dict.sections.documents} hint={f.privacy_doc.hint}>
        <LegalExplainer
          icon="🛡️" what={dict.legal.privacyWhat} desc={dict.legal.privacyDesc}
          link="https://us.dawere.com/politica-de-privacidad" refText={dict.legal.privacyRefLink}
        />
        <PdfUploadField
          label={f.privacy_doc.label}
          value={files.privacy_doc} onChange={(file) => setFile("privacy_doc", file)} strings={dict.common}
        />
      </QuestionCard>

      <QuestionCard number={5} title={dict.sections.tokens} hint={dict.sections.tokensDesc}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <PasswordField
              label={f.token_helpdesk.label} hint={f.token_helpdesk.hint}
              value={values.token_helpdesk} onChange={(v) => setField("token_helpdesk", v)}
              showLabel={dict.common.showToken} hideLabel={dict.common.hideToken}
            />
          </div>
          <PasswordField
            label={f.token_paypal.label} hint={f.token_paypal.hint}
            value={values.token_paypal} onChange={(v) => setField("token_paypal", v)}
            showLabel={dict.common.showToken} hideLabel={dict.common.hideToken}
          />
          <PasswordField
            label={f.token_stripe.label} hint={f.token_stripe.hint}
            value={values.token_stripe} onChange={(v) => setField("token_stripe", v)}
            showLabel={dict.common.showToken} hideLabel={dict.common.hideToken}
          />
        </div>
      </QuestionCard>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3.5 text-[15px] font-bold text-gray-800">{dict.sections.summary}</h3>
        <SummaryPanel dict={dict} values={values} files={files} />
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-gray-700">
          <input
            type="checkbox"
            checked={values.agreeTerms}
            onChange={(e) => setField("agreeTerms", e.target.checked)}
            className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 accent-teal"
          />
          <span>{f.agreeTerms.label}</span>
        </label>
        {errors.agreeTerms && <p className="mt-2 text-xs font-medium text-red-600">{errors.agreeTerms}</p>}
      </div>
    </StepShell>
  );
}
