import { db, env, err, isOwner, storage } from "@/lib/briefcase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Redirects to a short-lived signed URL for the file.
 * Published items: anyone. Drafts and archived items: owner only (404 for everyone else).
 * ?download=1 asks the browser to save instead of display.
 */
export async function GET(req: Request, ctx: Ctx) {
  if (!env().configured) return err(404, "Not found.");
  const { id } = await ctx.params;
  const row = await db.get(id);
  if (!row || !row.uploaded) return err(404, "Not found.");
  if (row.status !== "published" && !(await isOwner(req))) return err(404, "Not found.");
  const download = new URL(req.url).searchParams.get("download") === "1";
  const url = await storage.signDownload(row.file_path, 600, download ? row.file_name : undefined);
  return new Response(null, { status: 302, headers: { location: url, "cache-control": "private, no-store" } });
}
