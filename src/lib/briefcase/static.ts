/**
 * Published work samples shipped with the site (files in /public/briefcase).
 * These appear in the Portfolio Briefcase alongside items published from /briefcase/admin.
 * Only add files the owner has confirmed are anonymised or synthetic.
 */
import type { PublicItem } from "./config";

export type StaticItem = PublicItem & {
  /** original file */
  href: string;
  /** preview image */
  preview?: string;
  /** readable PDF rendering of a spreadsheet */
  pdf?: string;
};

export const STATIC_ITEMS: StaticItem[] = [
  {
    id: "static-fs-retail",
    title: "Financial statements with notes — retail company",
    category: "Accounting",
    contribution:
      "A complete reporting workbook: chart of accounts, journals, general ledger and trial balance through to the statement of financial position, profit or loss, changes in equity, cash flows and notes — with tax and bank reconciliations.",
    result:
      "Statements and notes that trace back to the ledger in one workbook. Company, client names and all figures are anonymised.",
    label: "Anonymised work sample",
    case_id: "wp",
    file_name: "financial-statements-sample.xlsx",
    file_kind: "spreadsheet",
    file_size: 1522529,
    sort: 0,
    created_at: "2026-10-08T00:00:00.000Z",
    href: "/briefcase/fs-retail/financial-statements-sample.xlsx",
    preview: "/briefcase/fs-retail/preview.webp",
    pdf: "/briefcase/fs-retail/financial-statements-sample.pdf",
  },
];
