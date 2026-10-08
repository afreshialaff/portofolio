/**
 * Portfolio Briefcase — server-only helpers.
 *
 * Storage + metadata: Supabase (private Storage bucket + Postgres table), called over
 * its REST APIs with the service-role key so no SDK dependency is needed.
 * Owner auth: a single owner password (env) and an HMAC-signed, HttpOnly session cookie.
 *
 * Required environment variables (Vercel → Project → Settings → Environment Variables):
 *   SUPABASE_URL                 https://<project>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY    service_role key (server only — never exposed to the browser)
 *   BRIEFCASE_OWNER_PASSWORD     the owner's login password
 *   BRIEFCASE_SESSION_SECRET     long random string used to sign the session cookie
 * Optional:
 *   BRIEFCASE_BUCKET             storage bucket name (default "briefcase")
 */
import type { OwnerItem, PublicItem } from "./config";

export const COOKIE = "bc_session";
const SESSION_HOURS = 8;

export function env() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const password = process.env.BRIEFCASE_OWNER_PASSWORD;
  const secret = process.env.BRIEFCASE_SESSION_SECRET;
  const bucket = process.env.BRIEFCASE_BUCKET || "briefcase";
  const configured = Boolean(url && key && password && secret && secret.length >= 16);
  return { url: url ?? "", key: key ?? "", password: password ?? "", secret: secret ?? "", bucket, configured };
}

/* ------------------------------------------------------------------ responses */
export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...headers },
  });
}
export const err = (status: number, message: string) => json({ error: message }, status);

/* ------------------------------------------------------------------ session (HMAC) */
const enc = new TextEncoder();

function b64url(buf: ArrayBuffer): string {
  let s = "";
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < Math.max(ab.length, bb.length); i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

export async function createSessionCookie(req: Request): Promise<string> {
  const { secret } = env();
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  const token = `${exp}.${await hmac(secret, `owner.${exp}`)}`;
  const secure = new URL(req.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}${secure}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

export async function isOwner(req: Request): Promise<boolean> {
  const { configured, secret } = env();
  if (!configured) return false;
  const token = readCookie(req, COOKIE);
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  return safeEqual(sig, await hmac(secret, `owner.${exp}`));
}

/** Same-origin check for state-changing requests (on top of SameSite=Strict). */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin fetches without Origin (older browsers) still need the cookie
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

/** Guard for owner-only, state-changing routes. Returns a Response to send, or null when allowed. */
export async function requireOwner(req: Request): Promise<Response | null> {
  if (!env().configured) return err(503, "Briefcase storage is not configured yet.");
  if (!sameOrigin(req)) return err(403, "Cross-origin request blocked.");
  if (!(await isOwner(req))) return err(401, "Owner login required.");
  return null;
}

/* ------------------------------------------------------------------ Supabase REST */
function headers(extra: Record<string, string> = {}) {
  const { key } = env();
  return { apikey: key, authorization: `Bearer ${key}`, ...extra };
}

const TABLE = "briefcase_items";

type Row = OwnerItem & { file_path: string };

async function rest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url } = env();
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: headers({ "content-type": "application/json", prefer: "return=representation", ...(init.headers as Record<string, string>) }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Database error ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export const db = {
  list: (filter: string) =>
    rest<Row[]>(`${TABLE}?select=*&${filter}&order=sort.asc,created_at.desc`, { method: "GET" }),
  get: async (id: string) => (await rest<Row[]>(`${TABLE}?select=*&id=eq.${encodeURIComponent(id)}`, { method: "GET" }))[0] ?? null,
  insert: async (row: Partial<Row>) => (await rest<Row[]>(TABLE, { method: "POST", body: JSON.stringify(row) }))[0],
  update: async (id: string, patch: Partial<Row>) =>
    (await rest<Row[]>(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
    }))[0] ?? null,
  remove: (id: string) => rest<Row[]>(`${TABLE}?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" }),
};

const encPath = (p: string) => p.split("/").map(encodeURIComponent).join("/");

export const storage = {
  /** Signed URL the browser can PUT the file to directly (bypasses the 4.5 MB function body limit). */
  async signUpload(path: string): Promise<string> {
    const { url, bucket } = env();
    const res = await fetch(`${url}/storage/v1/object/upload/sign/${bucket}/${encPath(path)}`, {
      method: "POST",
      headers: headers({ "content-type": "application/json", "x-upsert": "true" }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Storage error ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { url: string };
    return `${url}/storage/v1${data.url}`;
  },
  /** Short-lived signed download URL. */
  async signDownload(path: string, seconds = 600, downloadName?: string): Promise<string> {
    const { url, bucket } = env();
    const res = await fetch(`${url}/storage/v1/object/sign/${bucket}/${encPath(path)}`, {
      method: "POST",
      headers: headers({ "content-type": "application/json" }),
      body: JSON.stringify({ expiresIn: seconds }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Storage error ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { signedURL: string };
    const full = `${url}/storage/v1${data.signedURL}`;
    return downloadName ? `${full}&download=${encodeURIComponent(downloadName)}` : full;
  },
  async remove(paths: string[]): Promise<void> {
    const { url, bucket } = env();
    await fetch(`${url}/storage/v1/object/${bucket}`, {
      method: "DELETE",
      headers: headers({ "content-type": "application/json" }),
      body: JSON.stringify({ prefixes: paths }),
      cache: "no-store",
    });
  },
};

/* ------------------------------------------------------------------ shaping */
export function toPublic(r: Row): PublicItem {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    contribution: r.contribution,
    result: r.result,
    label: r.label,
    case_id: r.case_id,
    file_name: r.file_name,
    file_kind: r.file_kind,
    file_size: r.file_size,
    sort: r.sort,
    created_at: r.created_at,
  };
}

export function toOwner(r: Row): OwnerItem {
  return { ...toPublic(r), status: r.status, uploaded: r.uploaded, updated_at: r.updated_at };
}

export function safeName(name: string): string {
  return name.normalize("NFKD").replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").slice(-120) || "file";
}

export function randomId(): string {
  return crypto.randomUUID();
}
