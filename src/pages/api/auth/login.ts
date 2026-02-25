import type { APIRoute } from "astro";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword, createToken, setSessionCookie } from "@/lib/auth";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const db = (locals as Record<string, unknown> & { runtime?: { env?: { DB?: unknown } } }).runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Service unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await getUserByEmail(db as Parameters<typeof getUserByEmail>[0], email);
    if (!user || !user.password_hash) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const secret = import.meta.env.AUTH_SECRET || "";
    const token = await createToken({ sub: user.id, email: user.email, name: user.name, role: user.role }, secret);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": setSessionCookie(token),
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
