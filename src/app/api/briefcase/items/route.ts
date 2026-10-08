import { ACCEPTED, MAX_FILE_BYTES, MAX_FILE_MB, extOf } from "@/lib/briefcase/config";
import { db, env, err, isOwner, json, randomId, requireOwner, safeName, storage, toOwner, toPublic } from "@/lib/briefcase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET  /api/briefcase/items            → published items (public)
 * GET  /api/briefcase/items?scope=owner → every item incl. drafts/archived (owner only)
 */
export async function GET(req: Request) {
  if (!env().configured) return json({ configured: false, items: [] });
  const owner = new URL(req.url).searchParams.get("scope") === "owner";
  if (owner) {
    if (!(await isOwner(req))) return err(401, "Owner login required.");
    const rows = await db.list("id=not.is.null");
    return json({ configured: true, items: rows.map(toOwner) });
  }
  const rows = await db.list("status=eq.published&uploaded=is.true");
  return json({ configured: true, items: rows.map(toPublic) });
}

/** Create a private draft and return a signed URL the browser uploads the file to. */
export async function POST(req: Request) {
  const denied = await requireOwner(req);
  if (denied) return denied;
  let body: { fileName?: string; fileSize?: number; title?: string } = {};
  try {
    body = await req.json();
  } catch {
    return err(400, "Invalid request.");
  }
  const name = String(body.fileName ?? "");
  const size = Number(body.fileSize ?? 0);
  const type = ACCEPTED[extOf(name)];
  if (!type) return err(415, "This file type is not supported.");
  if (!size || size > MAX_FILE_BYTES) return err(413, `Files must be under ${MAX_FILE_MB} MB.`);

  const id = randomId();
  const path = `items/${id}/${randomId().slice(0, 8)}-${safeName(name)}`;
  const existing = await db.list("id=not.is.null");
  const row = await db.insert({
    id,
    title: (body.title || name.replace(/\.[^.]+$/, "")).slice(0, 160),
    category: "",
    contribution: "",
    result: "",
    label: "Anonymised work sample",
    case_id: null,
    status: "draft",
    uploaded: false,
    sort: existing.length,
    file_path: path,
    file_name: name.slice(0, 200),
    file_kind: type[1],
    file_size: size,
  });
  const uploadUrl = await storage.signUpload(path);
  return json({ item: toOwner(row), uploadUrl, contentType: type[0] }, 201);
}
