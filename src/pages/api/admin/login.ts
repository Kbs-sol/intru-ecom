import type { APIRoute } from "astro";
import { verifyPassword, createToken, setSessionCookie } from "@/lib/auth";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json() as { password?: string };
    const { password } = body;

    if (!password) {
      return new Response(JSON.stringify({ error: "Password required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const db = (locals as Record<string, unknown> & { runtime?: { env?: { DB?: unknown } } }).runtime?.env?.DB;
    type DB = Parameters<typeof import("@/lib/db").getUserByEmail>[0];

    let adminHash: string | null = null;

    if (db) {
      const admin = await (db as DB).prepare("SELECT * FROM admin_users LIMIT 1").first<{ id: string; email: string; password_hash: string }>();
      if (admin) {
        adminHash = admin.password_hash;
      }
    }

    // Fallback: allow PBKDF2_PLACEHOLDER to trigger setup, or check env hash
    const envHash = import.meta.env.ADMIN_PASSWORD_HASH || "";

    if (adminHash === "PBKDF2_PLACEHOLDER" || !adminHash) {
      if (envHash) {
        const valid = await verifyPassword(password, envHash);
        if (!valid) {
          return new Response(JSON.stringify({ error: "Invalid password" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else {
        // First-time setup: accept "intru@27" directly for initial bootstrap
        if (password !== "intru@27") {
          return new Response(JSON.stringify({ error: "Invalid password" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        // Update DB with hashed password
        if (db) {
          const newHash = await import("@/lib/auth").then(m => m.hashPassword(password));
          await (db as DB).prepare("UPDATE admin_users SET password_hash = ? WHERE id = 'admin_001'").bind(newHash).run();
        }
      }
    } else {
      const valid = await verifyPassword(password, adminHash);
      if (!valid) {
        return new Response(JSON.stringify({ error: "Invalid password" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const secret = import.meta.env.AUTH_SECRET || "";
    const token = await createToken(
      { sub: "admin_001", email: "admin@intru.in", name: "Admin", role: "admin" },
      secret
    );

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
