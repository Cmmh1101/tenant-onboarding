export interface FileValue {
  name: string;
  mimeType: string;
  size: number;
  dataUrl: string; // base64 data: URL
}

export interface FormValues {
  // Step 1 — Institution
  email_address: string;
  institution_name: string;
  legal_name: string;
  domain_mask: string;
  institution_code: string;
  license_number: string;
  // Step 2 — Contacts
  admissions_email: string;
  admissions_phone: string;
  admissions_whatsapp: string;
  student_support_email: string;
  student_support_phone: string;
  student_support_whatsapp: string;
  operations_email: string;
  // Step 3 — Director & location
  director_name: string;
  signatory_role: string;
  address: string;
  state_province: string;
  country: string;
  // Step 4 — Branding
  color_primary: string;
  color_secondary: string;
  color_tertiary: string;
  color_light: string;
  // Step 5 — Social & links
  url_facebook: string;
  url_instagram: string;
  url_tiktok: string;
  url_x: string;
  url_youtube: string;
  url_homepage: string;
  url_helpdesk: string;
  url_scholarships: string;
  url_philosophy: string;
  footer_description: string;
  // Step 6 — Documents, legal, tokens
  token_helpdesk: string;
  token_paypal: string;
  token_stripe: string;
  agreeTerms: boolean;
}

export interface FormFiles {
  director_signature: FileValue | null;
  license_doc: FileValue | null;
  student_manual: FileValue | null;
  // Step 4 — Branding (logos/icons — all real file uploads)
  favicon: FileValue | null;
  logo: FileValue | null;
  logo_negative: FileValue | null;
  logo_small: FileValue | null;
  logo_small_negative: FileValue | null;
  logo_full: FileValue | null;
  logo_full_negative: FileValue | null;
  /** Used in system-generated emails and PDFs — recommended 300x160px, PNG/JPEG. */
  logo_email_pdf: FileValue | null;
  // Step 6 — legal documents (PDF only)
  terms_doc: FileValue | null;
  privacy_doc: FileValue | null;
}

export const DEFAULT_VALUES: FormValues = {
  email_address: "", institution_name: "", legal_name: "", domain_mask: "",
  institution_code: "", license_number: "",
  admissions_email: "", admissions_phone: "", admissions_whatsapp: "",
  student_support_email: "", student_support_phone: "", student_support_whatsapp: "",
  operations_email: "",
  director_name: "", signatory_role: "", address: "", state_province: "", country: "",
  color_primary: "#005E5D", color_secondary: "#DF7C24", color_tertiary: "#942A81", color_light: "#E0F0EF",
  url_facebook: "", url_instagram: "", url_tiktok: "", url_x: "", url_youtube: "",
  url_homepage: "", url_helpdesk: "", url_scholarships: "", url_philosophy: "",
  footer_description: "",
  token_helpdesk: "", token_paypal: "", token_stripe: "",
  agreeTerms: false,
};

export const DEFAULT_FILES: FormFiles = {
  director_signature: null,
  license_doc: null,
  student_manual: null,
  favicon: null,
  logo: null,
  logo_negative: null,
  logo_small: null,
  logo_small_negative: null,
  logo_full: null,
  logo_full_negative: null,
  logo_email_pdf: null,
  terms_doc: null,
  privacy_doc: null,
};

export const TOTAL_STEPS = 6;
export const DRAFT_KEY = "edugogo_draft_v1";
