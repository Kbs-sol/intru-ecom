import type { APIRoute } from "astro";
import { getSession } from "@/lib/auth";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const secret = import.meta.env.AUTH_SECRET || "";
    const session = await getSession(request, secret);
    if (session?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const body = await request.json() as { id: string; status: string };
    const { id, status } = body;

    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!id || !validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const db = (locals as Record<string, unknown> & { runtime?: { env?: { DB?: unknown } } }).runtime?.env?.DB;
    if (!db) return new Response(JSON.stringify({ error: "DB unavailable" }), { status: 503, headers: { "Content-Type": "application/json" } });

    type DB = { prepare: (q: string) => { bind: (...args: unknown[]) => { run: () => Promise<void> } } };
    await (db as DB).prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
