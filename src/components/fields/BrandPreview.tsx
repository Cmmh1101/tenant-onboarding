"use client";

import { contrastColor } from "@/lib/colorUtils";

interface BrandPreviewProps {
  title: string;
  primary: string;
  tertiary: string;
  light: string;
  institutionName: string;
}

export function BrandPreview({ title, primary, tertiary, light, institutionName }: BrandPreviewProps) {
  const primaryContrast = contrastColor(primary || "#005E5D");
  const tertiaryContrast = contrastColor(tertiary || "#942A81");
  const p = primary || "#005E5D";
  const t = tertiary || "#942A81";
  const l = light || "#E0F0EF";
  const name = (institutionName || "MI INSTITUCIÓN").toUpperCase().slice(0, 20);

  return (
    <div className="mt-1.5 overflow-hidden rounded-xl border-[1.5px] border-teal/10 shadow-md">
      {/* Navbar — always white */}
      <div className="flex items-center justify-between bg-white px-5 py-3 shadow-sm">
        <span className="text-[13px] font-extrabold tracking-wide text-gray-800">{name}</span>
        <nav className="flex items-center gap-3.5">
          <span className="hidden text-xs font-medium text-gray-500 sm:inline">Cursos</span>
          <span className="hidden text-xs font-medium text-gray-500 sm:inline">Nosotros</span>
          <button
            type="button"
            className="rounded-md px-3.5 py-1.5 text-[11.5px] font-bold"
            style={{ background: p, color: primaryContrast }}
          >
            Matricúlate
          </button>
        </nav>
      </div>
      {/* Sidebar + body */}
      <div className="flex min-h-[130px]">
        <aside className="hidden w-[110px] flex-shrink-0 flex-col gap-0.5 py-3 sm:flex" style={{ background: p }}>
          {["Inicio", "Mis cursos", "Certificados", "Soporte"].map((item, i) => (
            <div
              key={item}
              className="px-3.5 py-1.5 text-[11px] font-medium text-white/70"
              style={i === 0 ? { background: "rgba(255,255,255,0.12)", color: "#fff" } : undefined}
            >
              {item}
            </div>
          ))}
        </aside>
        <div className="flex-1 p-5" style={{ background: l }}>
          <h4 className="mb-1.5 text-sm font-bold text-gray-800">{title}</h4>
          <p className="mb-2.5 text-[13px] text-gray-600">Así lucirán tus colores en el campus virtual.</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: t, color: tertiaryContrast }}>
              Educación online
            </span>
            <span className="rounded-full px-3 py-1 text-[11px] font-semibold opacity-75" style={{ background: t, color: tertiaryContrast }}>
              Certificado oficial
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full border-[1.5px] px-2.5 py-1 text-[11px] font-semibold"
              style={{ borderColor: t, color: t }}
            >
              ★ Destacado
            </span>
          </div>
        </div>
      </div>
      {/* Footer strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3" style={{ background: p }}>
        <span className="text-xs font-extrabold tracking-wide" style={{ color: primaryContrast }}>{name}</span>
        <span className="text-[11px] opacity-75" style={{ color: primaryContrast }}>© {new Date().getFullYear()} · Todos los derechos reservados</span>
      </div>
    </div>
  );
}
