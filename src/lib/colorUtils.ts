export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

/** Returns black or white — whichever contrasts best against the given hex color. */
export function contrastColor(hex: string): string {
  return getLuminance(hex) > 0.5 ? "#1a1a1a" : "#ffffff";
}

const NAMED_COLORS: [string, string][] = [
  ["#ffffff", "White"], ["#000000", "Black"], ["#ff0000", "Red"], ["#00ff00", "Lime"],
  ["#0000ff", "Blue"], ["#ffff00", "Yellow"], ["#ff00ff", "Magenta"], ["#00ffff", "Cyan"],
  ["#2563eb", "Royal Blue"], ["#1d4ed8", "Dark Blue"], ["#dbeafe", "Ice Blue"],
  ["#4f46e5", "Indigo"], ["#7c3aed", "Violet"], ["#9333ea", "Purple"],
  ["#059669", "Emerald Green"], ["#10b981", "Mint Green"], ["#d1fae5", "Pale Green"],
  ["#f59e0b", "Amber"], ["#ef4444", "Bright Red"], ["#ec4899", "Pink"],
  ["#f97316", "Orange"], ["#64748b", "Slate Gray"], ["#1e293b", "Navy"],
  ["#f0f9ff", "Very Light Blue"], ["#fafafa", "Very Light Gray"],
  ["#005e5d", "Teal"], ["#df7c24", "Orange"], ["#942a81", "Purple"], ["#e0f0ef", "Light Teal"],
];

export function getColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "—";
  let closest = "—";
  let minDist = Infinity;
  for (const [mh, mn] of NAMED_COLORS) {
    const mr = hexToRgb(mh);
    if (!mr) continue;
    const d = Math.sqrt((rgb.r - mr.r) ** 2 + (rgb.g - mr.g) ** 2 + (rgb.b - mr.b) ** 2);
    if (d < minDist) {
      minDist = d;
      closest = mn;
    }
  }
  return closest;
}

export function isValidHex(v: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(v);
}
