import { ACCEPTED, MAX_FILE_BYTES, MAX_FILE_MB, extOf } from "@/lib/briefcase/config";
import { db, err, json, randomId, requireOwner, safeName, storage, toOwner } from "@/lib/briefcase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * New signed upload URL for an item:
 *  - body {}                          → retry the same file path
 *  - body { fileName, fileSize }      → replace the file (old file is removed)
 * Replacing a published file moves the item back to draft so it is reviewed again.
 */
export async function POST(req: Request, ctx: Ctx) {
  const denied = await requireOwner(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const row = await db.get(id);
  if (!row) return err(404, "Item not found.");
  let b: { fileName?: string; fileSize?: number } = {};
  try {
    b = await req.json();
  } catch {
    b = {};
  }

  if (!b.fileName) {
    return json({ item: toOwner(row), uploadUrl: await storage.signUpload(row.file_path), contentType: ACCEPTED[extOf(row.file_name)]?.[0] });
  }

  const name = String(b.fileName);
  const size = Number(b.fileSize ?? 0);
  const type = ACCEPTED[extOf(name)];
  if (!type) return err(415, "This file type is not supported.");
  if (!size || size > MAX_FILE_BYTES) return err(413, `Files must be under ${MAX_FILE_MB} MB.`);
  const path = `items/${row.id}/${randomId().slice(0, 8)}-${safeName(name)}`;
  await storage.remove([row.file_path]);
  const updated = await db.update(id, {
    file_path: path,
    file_name: name.slice(0, 200),
    file_kind: type[1],
    file_size: size,
    uploaded: false,
    status: row.status === "published" ? "draft" : row.status,
  });
  return json({ item: updated ? toOwner(updated) : null, uploadUrl: await storage.signUpload(path), contentType: type[0] });
}
