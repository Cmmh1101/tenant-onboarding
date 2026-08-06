"use client";

import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { useFormContext } from "@/lib/form/FormContext";
import { TextInput } from "../fields/TextInput";
import { StepShell } from "./StepShell";
import { QuestionCard } from "./QuestionCard";

export function Step2Contacts({ dict }: { dict: Dictionary; locale?: Locale }) {
  const { values, errors, setField } = useFormContext();
  const f = dict.fields;
  const naHint = dict.common.naHint;

  return (
    <StepShell icon="🔄" step={2} dict={dict} title={dict.stepInfo["2"].title} desc={dict.stepInfo["2"].desc}>
      <QuestionCard number={1} title={dict.sections.admissions} hint={naHint}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput type="email" label={f.admissions_email.label} placeholder={f.admissions_email.placeholder}
            value={values.admissions_email} onChange={(v) => setField("admissions_email", v)} error={errors.admissions_email} />
          <TextInput type="tel" label={f.admissions_phone.label} placeholder={f.admissions_phone.placeholder}
            value={values.admissions_phone} onChange={(v) => setField("admissions_phone", v)} />
          <TextInput full prefix="https://wa.me/" label={f.admissions_whatsapp.label} placeholder={f.admissions_whatsapp.placeholder} hint={f.admissions_whatsapp.hint}
            value={values.admissions_whatsapp} onChange={(v) => setField("admissions_whatsapp", v)} />
        </div>
      </QuestionCard>

      <QuestionCard number={2} title={dict.sections.studentSupport} hint={naHint}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput type="email" label={f.student_support_email.label} placeholder={f.student_support_email.placeholder}
            value={values.student_support_email} onChange={(v) => setField("student_support_email", v)} error={errors.student_support_email} />
          <TextInput type="tel" label={f.student_support_phone.label} placeholder={f.student_support_phone.placeholder}
            value={values.student_support_phone} onChange={(v) => setField("student_support_phone", v)} />
          <TextInput full prefix="https://wa.me/" label={f.student_support_whatsapp.label} placeholder={f.student_support_whatsapp.placeholder}
            value={values.student_support_whatsapp} onChange={(v) => setField("student_support_whatsapp", v)} />
        </div>
      </QuestionCard>

      <QuestionCard number={3} title={dict.sections.operations} hint={f.operations_email.hint}>
        <TextInput bare type="email" label={f.operations_email.label} placeholder={f.operations_email.placeholder}
          value={values.operations_email} onChange={(v) => setField("operations_email", v)} error={errors.operations_email} />
      </QuestionCard>
    </StepShell>
  );
}
