import type { APIRoute } from "astro";
import { getPages, updatePage } from "@/lib/db";
import { getSession } from "@/lib/auth";

type DB = Parameters<typeof getPages>[0];

function getDB(locals: unknown): DB | null {
  return (locals as Record<string, unknown> & { runtime?: { env?: { DB?: unknown } } }).runtime?.env?.DB as DB | null;
}

async function checkAdmin(request: Request): Promise<boolean> {
  const secret = import.meta.env.AUTH_SECRET || "";
  const session = await getSession(request, secret);
  return session?.role === "admin";
}

export const GET: APIRoute = async ({ request, locals }) => {
  if (!await checkAdmin(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const db = getDB(locals);
  if (!db) return new Response(JSON.stringify({ error: "DB unavailable" }), { status: 503, headers: { "Content-Type": "application/json" } });
  const pages = await getPages(db);
  return new Response(JSON.stringify(pages), { status: 200, headers: { "Content-Type": "application/json" } });
};

export const PUT: APIRoute = async ({ request, locals }) => {
  if (!await checkAdmin(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const db = getDB(locals);
  if (!db) return new Response(JSON.stringify({ error: "DB unavailable" }), { status: 503, headers: { "Content-Type": "application/json" } });

  const body = await request.json() as { slug: string; title: string; content: string; meta_title: string; meta_description: string };
  const { slug, ...updates } = body;
  if (!slug) return new Response(JSON.stringify({ error: "Slug required" }), { status: 400, headers: { "Content-Type": "application/json" } });

  await updatePage(db, slug, updates);
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};
