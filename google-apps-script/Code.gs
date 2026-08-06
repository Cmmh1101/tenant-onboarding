/**
 * EDUGOGO — Institution Setup Form
 * Google Apps Script Web App
 *
 * Receives the JSON payload posted by the Next.js app's /api/submit route,
 * uploads any attached files (signature image, license PDF, student manual
 * PDF, favicon, and all logo variants) to a Google Drive folder, and appends
 * one row to a Google Sheet — regardless of which language (es / en / pt)
 * the form was filled out in.
 *
 * SETUP
 * 1. Create (or open) the Google Sheet where you want responses to land.
 * 2. Extensions → Apps Script. Delete any starter code and paste this file.
 * 3. Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the resulting /exec URL into GOOGLE_SCRIPT_URL in the Next.js app's
 *    environment variables (.env.local or your hosting provider's dashboard).
 * 5. (Optional) Set a specific Drive folder for uploaded files: Project
 *    Settings → Script Properties → add DRIVE_FOLDER_ID = <folder id>.
 *    If you skip this, the script auto-creates a folder named
 *    "EDUGOGO - Formulario Adjuntos" the first time it runs.
 */

const SHEET_NAME = "Respuestas"; // change if you want a specific tab name
const DRIVE_FOLDER_NAME = "EDUGOGO - Formulario Adjuntos";

// Column order — the header row is written automatically the first time the
// script runs. Do not reorder without also clearing/rewriting your header row.
const COLUMNS = [
  { key: "submitted_at", header: "Fecha de Envío" },
  { key: "language", header: "Idioma" },
  { key: "email_address", header: "Email" },
  { key: "institution_name", header: "Nombre Institución" },
  { key: "legal_name", header: "Nombre Legal" },
  { key: "domain_mask", header: "Dominio" },
  { key: "institution_code", header: "Código Institución" },
  { key: "license_number", header: "Número Licencia" },
  { key: "admissions_email", header: "Email Admisiones" },
  { key: "admissions_phone", header: "Teléfono Admisiones" },
  { key: "admissions_whatsapp", header: "WhatsApp Admisiones" },
  { key: "student_support_email", header: "Email Soporte Estudiante" },
  { key: "student_support_phone", header: "Teléfono Soporte" },
  { key: "student_support_whatsapp", header: "WhatsApp Soporte" },
  { key: "operations_email", header: "Email Operaciones" },
  { key: "director_name", header: "Nombre Director" },
  { key: "signatory_role", header: "Cargo Firmante" },
  { key: "director_signature_url", header: "URL Firma Director" },
  { key: "address", header: "Dirección" },
  { key: "state_province", header: "Estado/Provincia" },
  { key: "country", header: "País" },
  { key: "color_primary", header: "Color Primario" },
  { key: "color_secondary", header: "Color Secundario" },
  { key: "color_tertiary", header: "Color Terciario" },
  { key: "color_light", header: "Color Claro" },
  { key: "favicon_url", header: "URL Favicon" },
  { key: "logo_url", header: "URL Logo" },
  { key: "logo_negative_url", header: "URL Logo Negativo" },
  { key: "logo_small_url", header: "URL Isotipo" },
  { key: "logo_small_negative_url", header: "URL Isotipo Negativo" },
  { key: "logo_full_url", header: "URL Logo Completo" },
  { key: "logo_full_negative_url", header: "URL Logo Completo Negativo" },
  { key: "logo_email_pdf_url", header: "URL Logo (Emails/PDF)" },
  { key: "url_facebook", header: "Facebook" },
  { key: "url_instagram", header: "Instagram" },
  { key: "url_tiktok", header: "TikTok" },
  { key: "url_x", header: "X (Twitter)" },
  { key: "url_youtube", header: "YouTube" },
  { key: "url_homepage", header: "Sitio Web" },
  { key: "url_helpdesk", header: "URL Helpdesk" },
  { key: "url_scholarships", header: "URL Becas" },
  { key: "url_philosophy", header: "URL Filosofía" },
  { key: "footer_description", header: "Descripción Footer" },
  { key: "license_doc_url", header: "URL Licencia (PDF)" },
  { key: "student_manual_url", header: "URL Manual Estudiante (PDF)" },
  { key: "terms_doc_url", header: "URL Términos (PDF)" },
  { key: "privacy_doc_url", header: "URL Privacidad (PDF)" },
  { key: "token_helpdesk", header: "Token Helpdesk" },
  { key: "token_paypal", header: "Token PayPal" },
  { key: "token_stripe", header: "Token Stripe" },
  { key: "agreeTerms", header: "Aceptó Términos" },
];

// Maps each file field the browser sends (base64 payload key) to the
// spreadsheet column key it should populate with the resulting Drive link.
const FILE_FIELDS = {
  director_signature: "director_signature_url",
  license_doc: "license_doc_url",
  student_manual: "student_manual_url",
  favicon: "favicon_url",
  logo: "logo_url",
  logo_negative: "logo_negative_url",
  logo_small: "logo_small_url",
  logo_small_negative: "logo_small_negative_url",
  logo_full: "logo_full_url",
  logo_full_negative: "logo_full_negative_url",
  logo_email_pdf: "logo_email_pdf_url",
  terms_doc: "terms_doc_url",
  privacy_doc: "privacy_doc_url",
};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    // Upload every attached file (images + PDFs) to Drive and collect the
    // resulting shareable links, keyed by their destination column.
    const uploadedUrls = {};
    Object.keys(FILE_FIELDS).forEach((payloadKey) => {
      const columnKey = FILE_FIELDS[payloadKey];
      uploadedUrls[columnKey] = uploadFileIfPresent(payload[payloadKey], payloadKey);
    });

    const row = COLUMNS.map(({ key }) => {
      if (Object.prototype.hasOwnProperty.call(uploadedUrls, key)) return uploadedUrls[key];
      const value = payload[key];
      return value === undefined || value === null ? "" : value;
    });

    const sheet = getSheet();
    ensureHeaderRow(sheet);
    sheet.appendRow(row);

    return jsonResponse({ success: true, row: sheet.getLastRow() });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err && err.message ? err.message : err) });
  }
}

function doGet() {
  return jsonResponse({ success: true, message: "EDUGOGO Apps Script endpoint is running." });
}

/** Returns (creating if needed) the target sheet tab. */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() > 0) return;
  const headers = COLUMNS.map((c) => c.header);
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

/**
 * Decodes a base64 data URL, saves it to the shared Drive folder, and
 * returns a shareable "anyone with the link" URL. Returns "" if fileValue
 * is null/undefined (field left empty).
 */
function uploadFileIfPresent(fileValue, prefix) {
  if (!fileValue || !fileValue.dataUrl) return "";
  try {
    const commaIdx = fileValue.dataUrl.indexOf(",");
    const base64 = commaIdx >= 0 ? fileValue.dataUrl.substring(commaIdx + 1) : fileValue.dataUrl;
    const mimeType = fileValue.mimeType || "application/octet-stream";
    const bytes = Utilities.base64Decode(base64);
    const safeName = (fileValue.name || `${prefix}-${Date.now()}`).replace(/[^\w.\-]+/g, "_");
    const blob = Utilities.newBlob(bytes, mimeType, `${prefix}-${Date.now()}-${safeName}`);

    const folder = getOrCreateFolder();
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return `[Error al subir archivo: ${err && err.message ? err.message : err}]`;
  }
}

function getOrCreateFolder() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty("DRIVE_FOLDER_ID");
  if (savedId) {
    try {
      return DriveApp.getFolderById(savedId);
    } catch (e) {
      // Saved id is no longer valid — fall through and recreate.
    }
  }
  const existing = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  const folder = existing.hasNext() ? existing.next() : DriveApp.createFolder(DRIVE_FOLDER_NAME);
  props.setProperty("DRIVE_FOLDER_ID", folder.getId());
  return folder;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
