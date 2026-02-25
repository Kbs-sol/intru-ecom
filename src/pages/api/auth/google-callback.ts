import type { APIRoute } from "astro";
import { upsertGoogleUser } from "@/lib/db";
import { createToken, setSessionCookie } from "@/lib/auth";
import { generateId } from "@/lib/utils";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return new Response(null, { status: 302, headers: { Location: "/auth/login?error=no_code" } });
  }

  try {
    const clientId = import.meta.env.GOOGLE_CLIENT_ID || "";
    const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET || "";
    const siteUrl = import.meta.env.SITE_URL || "https://intru.in";
    const redirectUri = `${siteUrl}/api/auth/google-callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json() as GoogleTokenResponse;
    if (!tokens.access_token) throw new Error("No access token");

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userRes.json() as GoogleUserInfo;

    const db = (locals as Record<string, unknown> & { runtime?: { env?: { DB?: unknown } } }).runtime?.env?.DB;
    if (!db) throw new Error("DB unavailable");

    const user = await upsertGoogleUser(
      db as Parameters<typeof upsertGoogleUser>[0],
      googleUser.sub,
      googleUser.email,
      googleUser.name,
      googleUser.picture,
      generateId("user")
    );

    const secret = import.meta.env.AUTH_SECRET || "";
    const token = await createToken({ sub: user.id, email: user.email, name: user.name, role: user.role }, secret);

    let redirectTo = "/";
    if (state) {
      try {
        const parsed = JSON.parse(atob(state)) as { redirect?: string };
        redirectTo = parsed.redirect || "/";
      } catch {}
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectTo,
        "Set-Cookie": setSessionCookie(token),
      },
    });
  } catch {
    return new Response(null, { status: 302, headers: { Location: "/auth/login?error=google_failed" } });
  }
};
