import type { APIRoute } from "astro";
import { getProducts } from "@/lib/db";

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = (locals as Record<string, unknown> & { runtime?: { env?: { DB?: unknown } } }).runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Service unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const products = await getProducts(db as Parameters<typeof getProducts>[0]);
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
