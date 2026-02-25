import type { APIRoute } from "astro";
import { createOrder } from "@/lib/db";
import { createRazorpayOrder } from "@/lib/razorpay";
import { getSession } from "@/lib/auth";
import { generateId } from "@/lib/utils";

interface CartItem {
  key: string;
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
}

interface CheckoutPayload {
  items: CartItem[];
  total: number;
  subtotal: number;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json() as CheckoutPayload;
    const { items, total, subtotal, customer } = body;

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const keyId = import.meta.env.RAZORPAY_KEY_ID || "";
    const keySecret = import.meta.env.RAZORPAY_KEY_SECRET || "";

    if (!keyId || !keySecret || keyId === "RAZORPAY_KEY_ID") {
      return new Response(JSON.stringify({ error: "Payment gateway not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const orderId = generateId("ord");
    const secret = import.meta.env.AUTH_SECRET || "";
    const session = await getSession(request, secret);

    const shippingAddress = JSON.stringify({
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
    });

    const razorpayOrder = await createRazorpayOrder(keyId, keySecret, total, orderId);

    const db = (locals as Record<string, unknown> & { runtime?: { env?: { DB?: unknown } } }).runtime?.env?.DB;
    if (db) {
      await createOrder(db as Parameters<typeof createOrder>[0], {
        id: orderId,
        user_id: session?.sub || null,
        customer_email: customer.email,
        customer_name: `${customer.first_name} ${customer.last_name}`,
        customer_phone: customer.phone,
        shipping_address: shippingAddress,
        items: JSON.stringify(items),
        subtotal,
        total,
        status: "pending",
        razorpay_order_id: razorpayOrder.id,
        razorpay_payment_id: null,
        razorpay_signature: null,
        notes: null,
        created_at: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({
        order_id: orderId,
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
