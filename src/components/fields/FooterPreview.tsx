"use client";

import { contrastColor } from "@/lib/colorUtils";
import type { FormValues } from "@/lib/form/types";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { FacebookIcon, InstagramIcon, TikTokIcon, XIcon, YouTubeIcon, WhatsAppIcon, MailIcon } from "./SocialIcons";

interface FooterPreviewProps {
  values: FormValues;
  dict: Dictionary;
}

function isFilled(v: string) {
  return !!v && v !== "N/A";
}

export function FooterPreview({ values, dict }: FooterPreviewProps) {
  const primary = values.color_primary || "#005E5D";
  const dark = contrastColor(primary) === "#1a1a1a";
  const textColor = dark ? "rgba(0,0,0,0.72)" : "rgba(255,255,255,0.78)";
  const strongColor = dark ? "#1a1a1a" : "#fff";
  const name = values.institution_name || "MI INSTITUCIÓN";

  const socialRows = [
    { key: "fb", show: isFilled(values.url_facebook), icon: FacebookIcon, label: "Facebook" },
    { key: "ig", show: isFilled(values.url_instagram), icon: InstagramIcon, label: "Instagram" },
    { key: "tt", show: isFilled(values.url_tiktok), icon: TikTokIcon, label: "TikTok" },
    { key: "x", show: isFilled(values.url_x), icon: XIcon, label: "X (Twitter)" },
    { key: "yt", show: isFilled(values.url_youtube), icon: YouTubeIcon, label: "YouTube" },
  ].filter((s) => s.show);

  const admissionsWhatsapp = isFilled(values.admissions_whatsapp) ? `+${values.admissions_whatsapp}` : "";
  const admissionsEmail = isFilled(values.admissions_email) ? values.admissions_email : "";
  const supportWhatsapp = isFilled(values.student_support_whatsapp) ? `+${values.student_support_whatsapp}` : "";
  const supportEmail = isFilled(values.student_support_email) ? values.student_support_email : "";

  const companyLinks = [
    { key: "philosophy", show: isFilled(values.url_philosophy), label: dict.fields.url_philosophy.label },
    { key: "manual", show: true, label: dict.fields.student_manual.label },
    { key: "terms", show: true, label: dict.sections.terms },
    { key: "privacy", show: true, label: dict.sections.privacy },
    { key: "blog", show: true, label: "Blog" },
    { key: "help", show: isFilled(values.url_helpdesk), label: dict.sections.help },
  ].filter((l) => l.show);

  return (
    <div className="overflow-hidden rounded-xl shadow-md" style={{ background: primary }}>
      <div className="grid grid-cols-1 gap-6 p-7 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
        <div>
          <div className="mb-2.5 text-sm font-extrabold" style={{ color: strongColor }}>{name}</div>
          <p className="mb-3.5 text-xs leading-relaxed" style={{ color: textColor }}>
            {values.footer_description || "..."}
          </p>
          <p className="text-[11px] opacity-70" style={{ color: textColor }}>
            © {new Date().getFullYear()} {name}
          </p>
        </div>

        <div>
          <h4 className="mb-3.5 text-[13px] font-bold" style={{ color: strongColor }}>{dict.sections.company}</h4>
          <ul className="flex flex-col gap-2 text-[12.5px]" style={{ color: textColor }}>
            {companyLinks.map((l) => (
              <li key={l.key}>{l.label}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3.5 text-[13px] font-bold" style={{ color: strongColor }}>{dict.sections.followUs}</h4>
          <ul className="flex flex-col gap-2.5 text-[12.5px]" style={{ color: textColor }}>
            {socialRows.length === 0 && <li className="opacity-50">—</li>}
            {socialRows.map(({ key, icon: Icon, label }) => (
              <li key={key} className="flex items-center gap-2">
                <Icon />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3.5 text-[13px] font-bold" style={{ color: strongColor }}>{dict.sections.contactUs}</h4>
          {isFilled(values.address) && (
            <p className="mb-3.5 text-xs leading-relaxed" style={{ color: textColor }}>{values.address}</p>
          )}

          {(admissionsWhatsapp || admissionsEmail) && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-bold" style={{ color: strongColor }}>{dict.sections.admissions}</p>
              <div className="flex flex-col gap-1 text-xs" style={{ color: textColor }}>
                {admissionsWhatsapp && (
                  <span className="flex items-center gap-2"><WhatsAppIcon />{admissionsWhatsapp}</span>
                )}
                {admissionsEmail && (
                  <span className="flex items-center gap-2 break-all"><MailIcon />{admissionsEmail}</span>
                )}
              </div>
            </div>
          )}

          {(supportWhatsapp || supportEmail) && (
            <div>
              <p className="mb-1.5 text-xs font-bold" style={{ color: strongColor }}>{dict.sections.studentSupport}</p>
              <div className="flex flex-col gap-1 text-xs" style={{ color: textColor }}>
                {supportWhatsapp && (
                  <span className="flex items-center gap-2"><WhatsAppIcon />{supportWhatsapp}</span>
                )}
                {supportEmail && (
                  <span className="flex items-center gap-2 break-all"><MailIcon />{supportEmail}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
