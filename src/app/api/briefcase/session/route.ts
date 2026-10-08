import { clearSessionCookie, createSessionCookie, env, err, isOwner, json, safeEqual, sameOrigin } from "@/lib/briefcase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Who is looking: { configured, owner }. */
export async function GET(req: Request) {
  return json({ configured: env().configured, owner: await isOwner(req) });
}

/** Owner login with the password from BRIEFCASE_OWNER_PASSWORD. */
export async function POST(req: Request) {
  const { configured, password } = env();
  if (!configured) return err(503, "Briefcase storage is not configured yet.");
  if (!sameOrigin(req)) return err(403, "Cross-origin request blocked.");
  let body: { password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return err(400, "Invalid request.");
  }
  if (!body.password || !safeEqual(body.password, password)) {
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    return err(401, "Incorrect password.");
  }
  return json({ owner: true }, 200, { "set-cookie": await createSessionCookie(req) });
}

export async function DELETE() {
  return json({ owner: false }, 200, { "set-cookie": clearSessionCookie() });
}
