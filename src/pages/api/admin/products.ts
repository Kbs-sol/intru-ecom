import type { APIRoute } from "astro";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateId, slugify } from "@/lib/utils";

type DB = Parameters<typeof getProducts>[0];

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
  const products = await getProducts(db);
  return new Response(JSON.stringify(products), { status: 200, headers: { "Content-Type": "application/json" } });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!await checkAdmin(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const db = getDB(locals);
  if (!db) return new Response(JSON.stringify({ error: "DB unavailable" }), { status: 503, headers: { "Content-Type": "application/json" } });

  const body = await request.json() as Record<string, unknown>;
  const id = generateId("prod");
  const slug = body.slug as string || slugify(body.name as string || "");

  await createProduct(db, {
    id,
    name: body.name as string,
    slug,
    description: body.description as string || "",
    price: Number(body.price),
    sale_price: body.sale_price ? Number(body.sale_price) : null,
    category: body.category as string || "apparel",
    image_url: body.image_url as string || "",
    images: body.images as string || "[]",
    sizes: body.sizes as string || '["S","M","L","XL","XXL"]',
    stock_status: body.stock_status as string || "in_stock",
    featured: body.featured ? 1 : 0,
    meta_title: body.meta_title as string || null,
    meta_description: body.meta_description as string || null,
  });

  return new Response(JSON.stringify({ success: true, id }), { status: 201, headers: { "Content-Type": "application/json" } });
};

export const PUT: APIRoute = async ({ request, locals }) => {
  if (!await checkAdmin(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const db = getDB(locals);
  if (!db) return new Response(JSON.stringify({ error: "DB unavailable" }), { status: 503, headers: { "Content-Type": "application/json" } });

  const body = await request.json() as Record<string, unknown>;
  const { id, ...updates } = body;
  if (!id) return new Response(JSON.stringify({ error: "ID required" }), { status: 400, headers: { "Content-Type": "application/json" } });

  await updateProduct(db, id as string, updates as Parameters<typeof updateProduct>[2]);
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  if (!await checkAdmin(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const db = getDB(locals);
  if (!db) return new Response(JSON.stringify({ error: "DB unavailable" }), { status: 503, headers: { "Content-Type": "application/json" } });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "ID required" }), { status: 400, headers: { "Content-Type": "application/json" } });

  await deleteProduct(db, id);
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};
