"use client";

import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { useFormContext } from "@/lib/form/FormContext";
import { TextInput } from "../fields/TextInput";
import { TextareaField } from "../fields/TextareaField";
import { FooterPreview } from "../fields/FooterPreview";
import { StepShell } from "./StepShell";
import { QuestionCard } from "./QuestionCard";

export function Step5Links({ dict }: { dict: Dictionary; locale?: Locale }) {
  const { values, errors, setField } = useFormContext();
  const f = dict.fields;
  const naHint = dict.common.naHint;

  return (
    <StepShell icon="🔗" step={5} dict={dict} title={dict.stepInfo["5"].title} desc={dict.stepInfo["5"].desc}>
      <QuestionCard number={1} title={dict.sections.social}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput prefix="facebook.com/" label={f.url_facebook.label} placeholder={f.url_facebook.placeholder} value={values.url_facebook} onChange={(v) => setField("url_facebook", v)} />
          <TextInput prefix="instagram.com/" label={f.url_instagram.label} placeholder={f.url_instagram.placeholder} value={values.url_instagram} onChange={(v) => setField("url_instagram", v)} />
          <TextInput prefix="tiktok.com/@" label={f.url_tiktok.label} placeholder={f.url_tiktok.placeholder} value={values.url_tiktok} onChange={(v) => setField("url_tiktok", v)} />
          <TextInput prefix="x.com/" label={f.url_x.label} placeholder={f.url_x.placeholder} value={values.url_x} onChange={(v) => setField("url_x", v)} />
          <TextInput full type="url" label={f.url_youtube.label} placeholder={f.url_youtube.placeholder} value={values.url_youtube} onChange={(v) => setField("url_youtube", v)} />
        </div>
      </QuestionCard>

      <QuestionCard number={2} title={f.url_homepage.label} hint={naHint}>
        <TextInput bare type="url" label={f.url_homepage.label} placeholder={f.url_homepage.placeholder}
          value={values.url_homepage} onChange={(v) => setField("url_homepage", v)} error={errors.url_homepage} />
      </QuestionCard>

      <QuestionCard number={3} title={f.url_helpdesk.label} hint={f.url_helpdesk.hint}>
        <TextInput bare type="url" label={f.url_helpdesk.label} placeholder={f.url_helpdesk.placeholder} value={values.url_helpdesk} onChange={(v) => setField("url_helpdesk", v)} />
      </QuestionCard>

      <QuestionCard number={4} title={f.url_scholarships.label} hint={f.url_scholarships.hint}>
        <TextInput bare type="url" label={f.url_scholarships.label} placeholder={f.url_scholarships.placeholder} value={values.url_scholarships} onChange={(v) => setField("url_scholarships", v)} />
      </QuestionCard>

      <QuestionCard number={5} title={f.url_philosophy.label} hint={f.url_philosophy.hint}>
        <TextInput bare type="url" label={f.url_philosophy.label} placeholder={f.url_philosophy.placeholder} value={values.url_philosophy} onChange={(v) => setField("url_philosophy", v)} />
      </QuestionCard>

      <QuestionCard number={6} title={f.footer_description.label} hint={f.footer_description.hint}>
        <TextareaField bare
          label={f.footer_description.label}
          placeholder={f.footer_description.placeholder}
          maxLength={400}
          charactersSuffix={dict.common.charactersSuffix}
          value={values.footer_description}
          onChange={(v) => setField("footer_description", v)}
        />
        <p className="mb-2 mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-400">
          👁 {dict.common.footerPreviewTitle}
        </p>
        <FooterPreview values={values} dict={dict} />
      </QuestionCard>
    </StepShell>
  );
}
