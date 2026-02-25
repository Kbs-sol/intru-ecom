import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, url }) => {
  const clientId = import.meta.env.GOOGLE_CLIENT_ID || "";
  const siteUrl = import.meta.env.SITE_URL || "https://intru.in";
  const redirect = url.searchParams.get("redirect") || "/";

  const state = btoa(JSON.stringify({ redirect, nonce: Math.random().toString(36).slice(2) }));
  const redirectUri = `${siteUrl}/api/auth/google-callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      "Set-Cookie": `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
    },
  });
};
