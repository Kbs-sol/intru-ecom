import type { APIRoute } from "astro";
import { updateOrderPayment } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";

interface VerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json() as VerifyPayload;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ success: false, error: "Missing payment data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const keySecret = import.meta.env.RAZORPAY_KEY_SECRET || "";
    const valid = await verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, keySecret);

    if (!valid) {
      return new Response(JSON.stringify({ success: false, error: "Invalid payment signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const db = (locals as Record<string, unknown> & { runtime?: { env?: { DB?: unknown } } }).runtime?.env?.DB;
    if (db) {
      await updateOrderPayment(
        db as Parameters<typeof updateOrderPayment>[0],
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
