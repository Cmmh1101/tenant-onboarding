# EDUGOGO — Institution Setup (Next.js)

Multi-step, multi-language (Spanish / English / Portuguese) onboarding form for
new EDUGOGO institutions, rebuilt in Next.js + Tailwind CSS from the original
static prototype. All submissions — regardless of which language the form was
filled out in — are written to a single Google Sheet.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Google Apps Script (Sheets + Drive) as the submission backend — no database needed

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in GOOGLE_SCRIPT_URL (see below)
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/es` (or `/en`/`/pt`
based on your browser's language). The language selector in the header
switches the URL prefix (`/es`, `/en`, `/pt`) without losing anything you've
typed into the form.

## How the multi-language routing works

- `src/middleware.ts` redirects `/` to `/{locale}` based on the browser's
  `Accept-Language` header, defaulting to Spanish.
- `src/app/[locale]/...` holds the actual app; `src/lib/i18n/dictionaries/{es,en,pt}.json`
  hold every UI string, label, hint, and validation message.
- Form data lives in React state + `localStorage` (`src/lib/form/FormContext.tsx`),
  independent of the locale segment, so switching languages mid-form never
  loses progress.
- The language the user filled the form in is recorded in the `language`
  column of the spreadsheet, but every submission — es, en, or pt — lands in
  the exact same sheet/tab.

## Connecting Google Sheets (no server/database required)

Submissions are sent to a Google Apps Script "Web App" that appends a row to
a Google Sheet (and uploads any files to Drive, storing the shareable link in
the corresponding cell).

1. Create a new Google Sheet (or open an existing one) — this is where every
   institution's answers will land.
2. In the Sheet, go to **Extensions → Apps Script**.
3. Delete the placeholder `Code.gs` content and paste in the contents of
   [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) from this repo.
4. Click **Deploy → New deployment**, choose type **Web app**, and set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**, authorize the requested permissions (this is your own
   script accessing your own Sheet/Drive), and copy the generated URL — it
   looks like `https://script.google.com/macros/s/AKfycb.../exec`.
6. Put that URL in the Next.js app's environment as `GOOGLE_SCRIPT_URL`
   (in `.env.local` for local dev, or your hosting provider's environment
   variables for production — e.g. Vercel → Project → Settings →
   Environment Variables).
7. The first submission automatically creates a header row and a
   "EDUGOGO - Formulario Adjuntos" Drive folder for uploaded files (or reuses
   one if you set a `DRIVE_FOLDER_ID` script property — see comments at the
   top of `Code.gs`).

Because the Apps Script URL is only ever called from the Next.js server (via
`/api/submit`), it's never exposed to the browser.

### Updating the script later

If you edit `Code.gs` after already deploying, use **Deploy → Manage
deployments → edit (pencil icon) → New version** so the live `/exec` URL
picks up your changes — creating a brand-new deployment would give you a
different URL you'd have to update in `GOOGLE_SCRIPT_URL` again.

## Field types covered

- Text, textarea, email, tel, url, select
- Color picker with hex input + live color-combination previews (brand
  preview widget and full footer preview, both update live as you type/pick
  colors)
- Image upload (director's signature) — drag & drop, client-side preview,
  2 MB limit
- Logo/icon uploads (favicon, logo, negative/small/full variants) — drag &
  drop, white/dark preview per variant, 0.5 MB (favicon) / 1.5 MB (others)
- Dedicated "logo for emails & PDFs" upload — PNG/JPEG only, 1 MB limit, with
  a soft warning if the uploaded image isn't close to the recommended
  300×160px
- PDF upload (operating license, student handbook, Terms & Conditions, Privacy
  Policy) — drag & drop, 8 MB limit
- Password/token fields with show/hide toggle
- Checkbox (submission agreement)

## Project structure

The app lives at the repository root (no nested `webapp/` folder):

```
src/
  app/
    [locale]/              # localized routes: layout.tsx, page.tsx, LocaleHtmlSync.tsx
    api/submit/route.ts     # forwards submissions to the Apps Script Web App
    layout.tsx               # root <html>/<body>, fonts
    globals.css
  components/
    Header.tsx, LanguageSwitcher.tsx, SectionPillsNav.tsx, IntroScreen.tsx,
    Wizard.tsx, SuccessModal.tsx
    steps/                   # StepShell, QuestionCard, SummaryPanel, Step1‑6*.tsx
    fields/                  # TextInput, TextareaField, SelectField, ColorField,
                              # ImageUploadField, LogoUploadField, PdfUploadField,
                              # PasswordField, BrandPreview, FooterPreview, SocialIcons
  lib/
    i18n/                    # config.ts, getDictionary.ts, dictionaries/{es,en,pt}.json
    form/                    # FormContext.tsx (state, validation, autosave, submit), types.ts
    colorUtils.ts, countries.ts
google-apps-script/
  Code.gs                    # paste into Apps Script — see setup above
```

## Deployment

Any Next.js host works (Vercel is the simplest). Set `GOOGLE_SCRIPT_URL` as
an environment variable on the host, then:

```bash
npm run build
npm run start
```
