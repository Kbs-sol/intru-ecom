import type { APIRoute } from "astro";
import { getUserByEmail, createUser } from "@/lib/db";
import { hashPassword, createToken, setSessionCookie } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json() as { email?: string; password?: string; name?: string };
    const { email, password, name } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), {
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

    const typedDb = db as Parameters<typeof getUserByEmail>[0];
    const existing = await getUserByEmail(typedDb, email);
    if (existing) {
      return new Response(JSON.stringify({ error: "An account with this email already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const id = generateId("user");
    const passwordHash = await hashPassword(password);

    await createUser(typedDb, {
      id,
      email,
      name: name || null,
      avatar_url: null,
      google_id: null,
      password_hash: passwordHash,
      role: "customer",
    });

    const secret = import.meta.env.AUTH_SECRET || "";
    const token = await createToken({ sub: id, email, name: name || null, role: "customer" }, secret);

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
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
