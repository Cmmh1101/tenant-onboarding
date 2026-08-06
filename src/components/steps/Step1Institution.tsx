"use client";

import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { useFormContext } from "@/lib/form/FormContext";
import { TextInput } from "../fields/TextInput";
import { StepShell } from "./StepShell";
import { QuestionCard } from "./QuestionCard";

export function Step1Institution({ dict }: { dict: Dictionary; locale?: Locale }) {
  const { values, errors, setField } = useFormContext();
  const f = dict.fields;
  const naHint = dict.common.naHint;

  return (
    <StepShell icon="🏫" step={1} dict={dict} title={dict.stepInfo["1"].title} desc={dict.stepInfo["1"].desc}>
      <QuestionCard number={1} title={f.email_address.label} hint={f.email_address.hint}>
        <TextInput bare type="email" label={f.email_address.label} placeholder={f.email_address.placeholder}
          value={values.email_address} onChange={(v) => setField("email_address", v)} error={errors.email_address} />
      </QuestionCard>

      <QuestionCard number={2} title={f.institution_name.label} hint={naHint}>
        <TextInput bare label={f.institution_name.label} placeholder={f.institution_name.placeholder}
          value={values.institution_name} onChange={(v) => setField("institution_name", v)} error={errors.institution_name} />
      </QuestionCard>

      <QuestionCard number={3} title={f.legal_name.label} hint={f.legal_name.hint}>
        <TextInput bare label={f.legal_name.label} placeholder={f.legal_name.placeholder}
          value={values.legal_name} onChange={(v) => setField("legal_name", v)} error={errors.legal_name} />
      </QuestionCard>

      <QuestionCard number={4} title={f.domain_mask.label} hint={f.domain_mask.hint}>
        <TextInput bare prefix="https://" label={f.domain_mask.label} placeholder={f.domain_mask.placeholder}
          value={values.domain_mask} onChange={(v) => setField("domain_mask", v)} error={errors.domain_mask} />
      </QuestionCard>

      <QuestionCard number={5} title={f.institution_code.label} hint={f.institution_code.hint}>
        <TextInput bare label={f.institution_code.label} placeholder={f.institution_code.placeholder}
          value={values.institution_code} onChange={(v) => setField("institution_code", v)} error={errors.institution_code} />
      </QuestionCard>

      <QuestionCard number={6} title={f.license_number.label} hint={f.license_number.hint}>
        <TextInput bare label={f.license_number.label} placeholder={f.license_number.placeholder}
          value={values.license_number} onChange={(v) => setField("license_number", v)} error={errors.license_number} />
      </QuestionCard>
    </StepShell>
  );
}
