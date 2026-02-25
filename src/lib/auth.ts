export interface JWTPayload {
  sub: string;
  email: string;
  name: string | null;
  role: string;
  iat: number;
  exp: number;
}

function base64url(data: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64urlDecode(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  return new Uint8Array(bin.split("").map((c) => c.charCodeAt(0)));
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createToken(payload: Omit<JWTPayload, "iat" | "exp">, secret: string, expiresInSeconds = 604800): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const enc = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  const payloadB64 = btoa(JSON.stringify(fullPayload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(signingInput));
  const sigB64 = base64url(signature);

  return `${signingInput}.${sigB64}`;
}

export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;

    const enc = new TextEncoder();
    const key = await getKey(secret);
    const sigBytes = base64urlDecode(sigB64);

    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(signingInput));
    if (!valid) return null;

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))) as JWTPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getSession(request: Request, secret: string): Promise<JWTPayload | null> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)intru_session=([^;]+)/);
  if (!match) return null;
  return verifyToken(match[1], secret);
}

export function setSessionCookie(token: string): string {
  return `intru_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}

export function clearSessionCookie(): string {
  return `intru_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `pbkdf2:${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split(":");
    if (parts[0] !== "pbkdf2" || parts.length !== 3) return false;
    const saltHex = parts[1];
    const storedHash = parts[2];
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      256
    );
    const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex === storedHash;
  } catch {
    return false;
  }
}
