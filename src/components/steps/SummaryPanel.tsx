"use client";

import type { Dictionary } from "@/lib/i18n/getDictionary";
import type { FormFiles, FormValues } from "@/lib/form/types";
import { isValidHex } from "@/lib/colorUtils";

interface RowData {
  label: string;
  value: string;
  color?: boolean;
}

function Row({ label, value, emptyText, color }: { label: string; value: string; emptyText: string; color?: boolean }) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-50 px-4 py-2 text-[13px] last:border-b-0">
      <span className="w-[190px] flex-shrink-0 font-medium text-gray-500">{label}</span>
      {color && value && isValidHex(value) ? (
        <span className="flex items-center gap-2 font-medium text-gray-800">
          <span className="h-4 w-4 rounded-full shadow-sm" style={{ background: value }} />
          {value}
        </span>
      ) : (
        <span className={`flex-1 break-all font-medium ${value ? "text-gray-800" : "italic text-gray-300"}`}>
          {value || emptyText}
        </span>
      )}
    </div>
  );
}

export function SummaryPanel({ dict, values, files }: { dict: Dictionary; values: FormValues; files: FormFiles }) {
  const np = dict.summary.notProvided;
  const f = dict.fields;

  const sections: { title: string; rows: RowData[] }[] = [
    {
      title: dict.summary.institution,
      rows: [
        { label: f.email_address.label, value: values.email_address },
        { label: f.institution_name.label, value: values.institution_name },
        { label: f.legal_name.label, value: values.legal_name },
        { label: f.domain_mask.label, value: values.domain_mask ? "https://" + values.domain_mask : "" },
        { label: f.institution_code.label, value: values.institution_code },
      ],
    },
    {
      title: dict.summary.contacts,
      rows: [
        { label: f.admissions_email.label, value: values.admissions_email },
        { label: f.student_support_email.label, value: values.student_support_email },
        { label: f.operations_email.label, value: values.operations_email },
      ],
    },
    {
      title: dict.summary.director,
      rows: [
        { label: f.director_name.label, value: values.director_name },
        { label: f.signatory_role.label, value: values.signatory_role },
        { label: f.director_signature.label, value: files.director_signature ? dict.summary.signatureUploaded : "" },
        { label: f.address.label, value: values.address },
        { label: f.country.label, value: values.country ? dict.countries[values.country as keyof typeof dict.countries] || values.country : "" },
      ],
    },
    {
      title: dict.summary.colors,
      rows: [
        { label: f.color_primary.label, value: values.color_primary, color: true },
        { label: f.color_secondary.label, value: values.color_secondary, color: true },
        { label: f.color_tertiary.label, value: values.color_tertiary, color: true },
      ],
    },
    {
      title: dict.summary.links,
      rows: [
        { label: f.url_homepage.label, value: values.url_homepage },
        { label: f.license_doc.label, value: files.license_doc ? dict.summary.fileUploaded : "" },
        { label: f.student_manual.label, value: files.student_manual ? dict.summary.fileUploaded : "" },
      ],
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border-[1.5px] border-gray-200">
      {sections.map((sec) => (
        <div key={sec.title} className="border-b border-gray-100 last:border-b-0">
          <div className="border-b border-teal/10 bg-teal-xlt px-4 py-2 text-[11.5px] font-bold uppercase tracking-wide text-teal">
            {sec.title}
          </div>
          <div>
            {sec.rows.map((row) => (
              <Row key={row.label} label={row.label} value={row.value} emptyText={np} color={row.color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
