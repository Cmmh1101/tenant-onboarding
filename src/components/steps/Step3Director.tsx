"use client";

import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { useFormContext } from "@/lib/form/FormContext";
import { TextInput } from "../fields/TextInput";
import { SelectField } from "../fields/SelectField";
import { ImageUploadField } from "../fields/ImageUploadField";
import { StepShell } from "./StepShell";
import { QuestionCard } from "./QuestionCard";
import { COUNTRY_CODES } from "@/lib/countries";

export function Step3Director({ dict }: { dict: Dictionary; locale?: Locale }) {
  const { values, files, errors, setField, setFile } = useFormContext();
  const f = dict.fields;
  const naHint = dict.common.naHint;

  const countryOptions = COUNTRY_CODES.map(({ code, flag }) => ({
    value: code,
    label: `${flag} ${dict.countries[code as keyof typeof dict.countries]}`,
  }));

  return (
    <StepShell icon="🧑‍💼" step={3} dict={dict} title={dict.stepInfo["3"].title} desc={dict.stepInfo["3"].desc}>
      <QuestionCard number={1} title={f.director_name.label} hint={naHint}>
        <TextInput bare label={f.director_name.label} placeholder={f.director_name.placeholder}
          value={values.director_name} onChange={(v) => setField("director_name", v)} error={errors.director_name} />
      </QuestionCard>

      <QuestionCard number={2} title={f.signatory_role.label} hint={naHint}>
        <TextInput bare label={f.signatory_role.label} placeholder={f.signatory_role.placeholder}
          value={values.signatory_role} onChange={(v) => setField("signatory_role", v)} error={errors.signatory_role} />
      </QuestionCard>

      <QuestionCard number={3} title={f.director_signature.label} hint={f.director_signature.hint}>
        <ImageUploadField
          label={f.director_signature.label}
          value={files.director_signature}
          onChange={(file) => setFile("director_signature", file)}
          strings={dict.common}
        />
      </QuestionCard>

      <QuestionCard number={4} title={f.address.label} hint={naHint}>
        <TextInput bare label={f.address.label} placeholder={f.address.placeholder}
          value={values.address} onChange={(v) => setField("address", v)} error={errors.address} />
      </QuestionCard>

      <QuestionCard number={5} title={f.state_province.label} hint={naHint}>
        <TextInput bare label={f.state_province.label} placeholder={f.state_province.placeholder}
          value={values.state_province} onChange={(v) => setField("state_province", v)} error={errors.state_province} />
      </QuestionCard>

      <QuestionCard number={6} title={f.country.label}>
        <SelectField bare label={f.country.label} placeholder={dict.common.selectPlaceholder}
          value={values.country} onChange={(v) => setField("country", v)} error={errors.country}
          options={countryOptions} />
      </QuestionCard>
    </StepShell>
  );
}
