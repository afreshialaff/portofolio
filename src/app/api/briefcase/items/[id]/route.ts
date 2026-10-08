import { BRIEFCASE_CATEGORIES, EVIDENCE_LABELS, type ItemStatus } from "@/lib/briefcase/config";
import { db, err, json, requireOwner, storage, toOwner } from "@/lib/briefcase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES: ItemStatus[] = ["draft", "published", "archived"];

/** Edit metadata, order, upload state or status (owner only). */
export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireOwner(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const row = await db.get(id);
  if (!row) return err(404, "Item not found.");

  let b: Record<string, unknown> = {};
  try {
    b = await req.json();
  } catch {
    return err(400, "Invalid request.");
  }
  const patch: Record<string, unknown> = {};
  const text = (k: string, max: number) => {
    if (typeof b[k] === "string") patch[k] = (b[k] as string).trim().slice(0, max);
  };
  text("title", 160);
  text("contribution", 1200);
  text("result", 1200);
  if (typeof b.category === "string") patch.category = b.category.trim().slice(0, 60);
  if (typeof b.label === "string") {
    if (!(EVIDENCE_LABELS as readonly string[]).includes(b.label)) return err(400, "Unknown evidence label.");
    patch.label = b.label;
  }
  if (b.case_id === null || typeof b.case_id === "string") patch.case_id = b.case_id || null;
  if (typeof b.sort === "number" && Number.isFinite(b.sort)) patch.sort = Math.round(b.sort);
  if (b.uploaded === true) patch.uploaded = true;

  if (typeof b.status === "string") {
    const status = b.status as ItemStatus;
    if (!STATUSES.includes(status)) return err(400, "Unknown status.");
    if (status === "published") {
      const next = { ...row, ...patch } as typeof row;
      if (b.confirmPublic !== true) return err(400, "Confirm the file is cleared for public view before publishing.");
      if (!next.uploaded) return err(400, "The file has not finished uploading.");
      if (!next.title || !next.contribution || !next.category || !next.label)
        return err(400, "Add a title, category, your contribution and an evidence label before publishing.");
    }
    patch.status = status;
  }
  const updated = await db.update(id, patch);
  return json({ item: updated ? toOwner(updated) : null, categories: BRIEFCASE_CATEGORIES });
}

/** Delete a draft or archived item and its file. Published items must be archived first. */
export async function DELETE(req: Request, ctx: Ctx) {
  const denied = await requireOwner(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const row = await db.get(id);
  if (!row) return err(404, "Item not found.");
  if (row.status === "published") return err(409, "Unpublish or archive the item before deleting it.");
  await storage.remove([row.file_path]);
  await db.remove(id);
  return json({ deleted: id });
}
