"use client";

import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/lib/i18n/config";
import { interpolate } from "@/lib/i18n/getDictionary";
import { useFormContext } from "@/lib/form/FormContext";
import { ColorField } from "../fields/ColorField";
import { LogoUploadField } from "../fields/LogoUploadField";
import { BrandPreview } from "../fields/BrandPreview";
import { StepShell } from "./StepShell";
import { QuestionCard } from "./QuestionCard";

const PNG_JPEG = ["image/png", "image/jpeg"];

export function Step4Branding({ dict }: { dict: Dictionary; locale?: Locale }) {
  const { values, files, setField, setFile } = useFormContext();
  const f = dict.fields;

  const sizeHint = (mb: number) => interpolate(dict.common.imageSizeHintTemplate, { mb: String(mb) });
  const uploadStrings = {
    dragDropText: dict.common.dragDropText,
    clickSelectText: dict.common.clickSelectText,
    removeFile: dict.common.removeFile,
    fileTooLarge: dict.common.fileTooLarge,
    invalidFileType: dict.common.invalidFileType,
    dimensionWarningTemplate: dict.common.dimensionWarningTemplate,
  };

  return (
    <StepShell icon="🎨" step={4} dict={dict} title={dict.stepInfo["4"].title} desc={dict.stepInfo["4"].desc}>
      <QuestionCard number={1} title={dict.sections.colorsPalette} hint={dict.sections.colorsPaletteDesc}>
        <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ColorField required label={f.color_primary.label} value={values.color_primary} onChange={(v) => setField("color_primary", v)} />
          <ColorField label={f.color_secondary.label} value={values.color_secondary} onChange={(v) => setField("color_secondary", v)} />
          <ColorField label={f.color_tertiary.label} value={values.color_tertiary} onChange={(v) => setField("color_tertiary", v)} />
          <ColorField label={f.color_light.label} value={values.color_light} onChange={(v) => setField("color_light", v)} />
        </div>
        <BrandPreview
          title={dict.common.brandPreviewTitle}
          primary={values.color_primary}
          tertiary={values.color_tertiary}
          light={values.color_light}
          institutionName={values.institution_name}
        />
      </QuestionCard>

      <QuestionCard number={2} title={f.logo_email_pdf.label} hint={f.logo_email_pdf.hint}>
        <LogoUploadField
          label={f.logo_email_pdf.label}
          hint={sizeHint(1)}
          value={files.logo_email_pdf}
          onChange={(file) => setFile("logo_email_pdf", file)}
          maxSizeMb={1}
          allowedMimeTypes={PNG_JPEG}
          recommendedDimensions={{ width: 300, height: 160 }}
          strings={uploadStrings}
        />
      </QuestionCard>

      <QuestionCard number={3} title={dict.sections.logos} hint={dict.sections.logosDesc}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <LogoUploadField maxSizeMb={0.5} label={f.favicon_url.label} hint={`${f.favicon_url.hint} ${sizeHint(0.5)}`} value={files.favicon} onChange={(file) => setFile("favicon", file)} strings={uploadStrings} />
          <LogoUploadField maxSizeMb={1.5} label={f.logo_url.label} hint={`${f.logo_url.hint} ${sizeHint(1.5)}`} value={files.logo} onChange={(file) => setFile("logo", file)} strings={uploadStrings} />
          <LogoUploadField dark maxSizeMb={1.5} label={f.logo_negative_url.label} hint={`${f.logo_negative_url.hint} ${sizeHint(1.5)}`} value={files.logo_negative} onChange={(file) => setFile("logo_negative", file)} strings={uploadStrings} />
          <LogoUploadField maxSizeMb={1.5} label={f.logo_small_url.label} hint={`${f.logo_small_url.hint} ${sizeHint(1.5)}`} value={files.logo_small} onChange={(file) => setFile("logo_small", file)} strings={uploadStrings} />
          <LogoUploadField dark maxSizeMb={1.5} label={f.logo_small_negative_url.label} hint={`${f.logo_small_negative_url.hint} ${sizeHint(1.5)}`} value={files.logo_small_negative} onChange={(file) => setFile("logo_small_negative", file)} strings={uploadStrings} />
          <LogoUploadField wide maxSizeMb={1.5} label={f.logo_full_url.label} hint={`${f.logo_full_url.hint} ${sizeHint(1.5)}`} value={files.logo_full} onChange={(file) => setFile("logo_full", file)} strings={uploadStrings} />
          <LogoUploadField wide dark maxSizeMb={1.5} label={f.logo_full_negative_url.label} hint={`${f.logo_full_negative_url.hint} ${sizeHint(1.5)}`} value={files.logo_full_negative} onChange={(file) => setFile("logo_full_negative", file)} strings={uploadStrings} />
        </div>
      </QuestionCard>
    </StepShell>
  );
}
