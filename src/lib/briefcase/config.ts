/**
 * Portfolio Briefcase — shared constants and types (safe for client and server).
 * Secrets live only in src/lib/briefcase/server.ts.
 */

export const BRIEFCASE_CATEGORIES = [
  "Accounting",
  "Finance / reconciliation",
  "Tax",
  "Payroll",
  "ERP",
  "Amazon",
  "Singapore reporting",
] as const;

export const EVIDENCE_LABELS = [
  "Anonymised work sample",
  "Demo using synthetic data",
  "Illustrative process",
] as const;
export type EvidenceLabel = (typeof EVIDENCE_LABELS)[number];

export type ItemStatus = "draft" | "published" | "archived";

/** Max size per file. Matches the Supabase Storage default per-file limit on the free plan. */
export const MAX_FILE_MB = 50;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export type FileKind = "image" | "pdf" | "spreadsheet" | "document" | "video";

/** Accepted types: extension → [mime, kind]. */
export const ACCEPTED: Record<string, [string, FileKind]> = {
  png: ["image/png", "image"],
  jpg: ["image/jpeg", "image"],
  jpeg: ["image/jpeg", "image"],
  webp: ["image/webp", "image"],
  gif: ["image/gif", "image"],
  pdf: ["application/pdf", "pdf"],
  xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "spreadsheet"],
  csv: ["text/csv", "spreadsheet"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "document"],
  mp4: ["video/mp4", "video"],
  webm: ["video/webm", "video"],
  mov: ["video/quicktime", "video"],
};

export const ACCEPT_ATTR = Object.keys(ACCEPTED)
  .map((e) => `.${e}`)
  .join(",");

export const ACCEPTED_HUMAN = "Images (PNG, JPG, WebP, GIF), PDF, XLSX, CSV, DOCX, video (MP4, WebM, MOV)";

export function extOf(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1].toLowerCase() : "";
}

export function kindOf(name: string): FileKind | null {
  return ACCEPTED[extOf(name)]?.[1] ?? null;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** What the public API returns — never the storage path. */
export type PublicItem = {
  id: string;
  title: string;
  category: string;
  contribution: string;
  result: string;
  label: EvidenceLabel;
  case_id: string | null;
  file_name: string;
  file_kind: FileKind;
  file_size: number;
  sort: number;
  created_at: string;
};

/** What the owner sees. */
export type OwnerItem = PublicItem & {
  status: ItemStatus;
  uploaded: boolean;
  updated_at: string;
};
