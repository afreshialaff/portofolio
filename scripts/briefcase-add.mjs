#!/usr/bin/env node
/**
 * Add a local file to the Portfolio Briefcase as a PRIVATE DRAFT — the same storage path the
 * owner upload page uses. Nothing is published by this script; review and publish in /briefcase/admin.
 *
 *   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… \
 *   node scripts/briefcase-add.mjs ./file.pdf --title "Bank reconciliation WP" \
 *        --category "Finance / reconciliation" --label "Anonymised work sample" \
 *        --contribution "…" --result "…" --case recon
 *
 * Requires Node 18+. No dependencies.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const TYPES = {
  png: ["image/png", "image"], jpg: ["image/jpeg", "image"], jpeg: ["image/jpeg", "image"], webp: ["image/webp", "image"],
  gif: ["image/gif", "image"], pdf: ["application/pdf", "pdf"],
  xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "spreadsheet"], csv: ["text/csv", "spreadsheet"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "document"],
  mp4: ["video/mp4", "video"], webm: ["video/webm", "video"], mov: ["video/quicktime", "video"],
};
const LABELS = ["Anonymised work sample", "Demo using synthetic data", "Illustrative process"];

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--") && !args[args.indexOf(a) - 1]?.startsWith("--"));
const opt = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const URL_ = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.BRIEFCASE_BUCKET || "briefcase";
if (!file || !URL_ || !KEY) {
  console.error("Usage: SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/briefcase-add.mjs <file> [--title …] [--category …] [--label …] [--contribution …] [--result …] [--case id]");
  process.exit(1);
}
const ext = path.extname(file).slice(1).toLowerCase();
const type = TYPES[ext];
if (!type) throw new Error(`Unsupported file type .${ext}`);
const size = fs.statSync(file).size;
if (size > 50 * 1024 * 1024) throw new Error("File is over 50 MB");
const label = opt("label") || "Anonymised work sample";
if (!LABELS.includes(label)) throw new Error(`--label must be one of: ${LABELS.join(" | ")}`);

const h = { apikey: KEY, authorization: `Bearer ${KEY}` };
const id = crypto.randomUUID();
const name = path.basename(file);
const filePath = `items/${id}/${crypto.randomUUID().slice(0, 8)}-${name.replace(/[^\w.\-]+/g, "_")}`;

const ins = await fetch(`${URL_}/rest/v1/briefcase_items`, {
  method: "POST",
  headers: { ...h, "content-type": "application/json", prefer: "return=representation" },
  body: JSON.stringify({
    id, title: opt("title") || name.replace(/\.[^.]+$/, ""), category: opt("category") || "", label,
    contribution: opt("contribution") || "", result: opt("result") || "", case_id: opt("case") || null,
    status: "draft", uploaded: false, sort: 999, file_path: filePath, file_name: name, file_kind: type[1], file_size: size,
  }),
});
if (!ins.ok) throw new Error(`Insert failed: ${ins.status} ${await ins.text()}`);
const sign = await fetch(`${URL_}/storage/v1/object/upload/sign/${BUCKET}/${filePath}`, { method: "POST", headers: { ...h, "x-upsert": "true" } });
if (!sign.ok) throw new Error(`Sign failed: ${sign.status} ${await sign.text()}`);
const { url } = await sign.json();
const put = await fetch(`${URL_}/storage/v1${url}`, { method: "PUT", headers: { "content-type": type[0], "x-upsert": "true" }, body: fs.readFileSync(file) });
if (!put.ok) throw new Error(`Upload failed: ${put.status} ${await put.text()}`);
await fetch(`${URL_}/rest/v1/briefcase_items?id=eq.${id}`, { method: "PATCH", headers: { ...h, "content-type": "application/json" }, body: JSON.stringify({ uploaded: true }) });
console.log(`Added as private draft: ${id} (${name}). Review and publish it in /briefcase/admin.`);
