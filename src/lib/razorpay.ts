export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export async function createRazorpayOrder(
  keyId: string,
  keySecret: string,
  amount: number,
  receipt: string
): Promise<RazorpayOrder> {
  const credentials = btoa(`${keyId}:${keySecret}`);
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Razorpay order creation failed: ${error}`);
  }

  return response.json() as Promise<RazorpayOrder>;
}

export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string
): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(keySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const message = `${orderId}|${paymentId}`;
    const signatureBytes = await crypto.subtle.sign("HMAC", key, enc.encode(message));
    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return expectedSignature === signature;
  } catch {
    return false;
  }
}
