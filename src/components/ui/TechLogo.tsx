/**
 * TechLogo — real brand marks (from simple-icons, CC0, in /public/logos) for the
 * software the résumé names, plus a set of thin line icons for concepts and
 * tools with no openly licensed logo. Brand logos keep their official colour.
 */
import type { CSSProperties, ReactNode } from "react";

type Brand = { src: string; color: string; label: string };

export const BRAND: Record<string, Brand> = {
  myob: { src: "/logos/myob.svg", color: "#7B14EF", label: "MYOB" },
  shopee: { src: "/logos/shopee.svg", color: "#EE4D2D", label: "Shopee" },
  xero: { src: "/logos/xero.svg", color: "#13B5EA", label: "Xero" },
  quickbooks: { src: "/logos/quickbooks.svg", color: "#2CA01C", label: "QuickBooks" },
  tiktok: { src: "/logos/tiktok.svg", color: "#000000", label: "TikTok" },
  blibli: { src: "/logos/blibli.svg", color: "#0072FF", label: "Blibli" },
  bukalapak: { src: "/logos/bukalapak.svg", color: "#E31E52", label: "Bukalapak" },
  googlesheets: { src: "/logos/googlesheets.svg", color: "#34A853", label: "Google Sheets" },
  googleappsscript: { src: "/logos/googleappsscript.svg", color: "#4285F4", label: "Google Apps Script" },
};

/* 24×24, stroke = currentColor, 1.4 px, round joins. Paths are original line drawings. */
export const CONCEPT: Record<string, ReactNode> = {
  report: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v3h3M9 17v-3M12 17v-6M15 17v-4" />
    </>
  ),
  ledger: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 8h16M4 13h16M10 3v18" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M12 14h2M8 17h2" />
    </>
  ),
  match: (
    <>
      <rect x="3" y="4" width="7" height="16" rx="1.5" />
      <rect x="14" y="4" width="7" height="16" rx="1.5" />
      <path d="M10 8h4M10 12h4M10 16h4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  papers: (
    <>
      <path d="M8 3h8l3 3v12H8z" />
      <path d="M5 6v15h11" />
      <path d="M11 9h5M11 12h5M11 15h3" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  percent: (
    <>
      <path d="M19 5 5 19" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </>
  ),
  building: (
    <>
      <path d="M5 21V4h9v17M14 9h5v12M3 21h18" />
      <path d="M8 8h3M8 12h3M8 16h3" />
    </>
  ),
  form: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h4" />
      <path d="m14 16 1.5 1.5L18 15" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  invoice: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 11h6M9 14h3" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M7 20h10M5 7h14" />
      <path d="m5 7-2.5 6a2.8 2.8 0 0 0 5 0zM19 7l-2.5 6a2.8 2.8 0 0 0 5 0z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.8 19.5h18.4z" />
      <path d="M12 10v4.5M12 17v.3" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M6.5 17c1-2 1.5-4 1.5-6a4 4 0 0 1 8 0c0 3-.5 5.5-1.8 8" />
      <path d="M12 11c0 3.5-1 6.5-3 9M4.5 13c.3-1 .5-1.5.5-2.5a7 7 0 0 1 14 0c0 1.5-.1 3-.4 4.3" />
    </>
  ),
  boxes: (
    <>
      <rect x="3.5" y="12" width="8" height="8" rx="1" />
      <rect x="12.5" y="12" width="8" height="8" rx="1" />
      <rect x="8" y="4" width="8" height="8" rx="1" />
    </>
  ),
  app: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18M6 6.8h.01M8.5 6.8h.01M7 13h5M7 16h8" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3c.6 4.2 2.4 6.2 7 7-4.6.8-6.4 2.8-7 7-.6-4.2-2.4-6.2-7-7 4.6-.8 6.4-2.8 7-7z" />
      <path d="M19 16c.3 1.6.9 2.3 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.2 2.2-.9 2.5-2.5z" />
    </>
  ),
  flow: (
    <>
      <rect x="3" y="4" width="6" height="5" rx="1.2" />
      <rect x="15" y="4" width="6" height="5" rx="1.2" />
      <rect x="9" y="15" width="6" height="5" rx="1.2" />
      <path d="M9 6.5h6M6 9v3.5h6V15M18 9v3.5h-6" />
    </>
  ),
  nodes: (
    <>
      <circle cx="5" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="7" r="2" />
      <circle cx="19" cy="17" r="2" />
      <path d="m7 7 3 3.5M7 17l3-3.5M14 11.2l3-3M14 12.8l3 3" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H9l-4 3.5V16H4z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c.5-3.4 3-5.5 6-5.5s5.5 2.1 6 5.5" />
      <path d="M15.5 5.2a3 3 0 0 1 0 5.6M17.5 14.8c1.8.7 3 2.5 3.4 5.2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z" />
    </>
  ),
  cap: (
    <>
      <path d="m2.5 9.5 9.5-4.5 9.5 4.5-9.5 4.5z" />
      <path d="M6.5 11.5V16c1.5 1.6 3.5 2.4 5.5 2.4s4-.8 5.5-2.4v-4.5M21.5 9.5v5" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3.5M8 20.5h8M9.5 17.5h5v3h-5z" />
    </>
  ),
  medal: (
    <>
      <path d="m8 3 2.5 6M16 3l-2.5 6M8 3h2.5M16 3h-2.5" />
      <circle cx="12" cy="15" r="5.5" />
      <path d="M12 12.5v5M10.8 13.4l1.2-.9" />
    </>
  ),
  book: (
    <>
      <path d="M12 6c-2-1.5-4.8-2-8-2v14c3.2 0 6 .5 8 2 2-1.5 4.8-2 8-2V4c-3.2 0-6 .5-8 2z" />
      <path d="M12 6v14" />
    </>
  ),
  star: (
    <>
      <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />
    </>
  ),
};

export function isBrand(key: string): boolean {
  return key in BRAND;
}

type Props = {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** stroke width for concept icons */
  stroke?: number;
};

/** Decorative by default (aria-hidden): every logo is shown next to its name. */
export function TechLogo({ name, size = 24, className, style, stroke = 1.4 }: Props) {
  const brand = BRAND[name];
  if (brand) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brand.src}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className={className}
        style={style}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );
  }
  const icon = CONCEPT[name] ?? CONCEPT.app;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {icon}
    </svg>
  );
}

export function brandColor(name: string): string | undefined {
  return BRAND[name]?.color;
}
