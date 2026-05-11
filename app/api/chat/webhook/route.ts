import { NextResponse } from "next/server";

/**
 * POST /api/chat/webhook
 *
 * Receives incoming payloads from Integrately, Zapier, Make, or any
 * automation platform and relays them as chatbot responses.
 *
 * Expected body:
 * {
 *   secret: string;          // must match CHATBOT_WEBHOOK_SECRET env var
 *   event: string;           // e.g. "new_order", "product_restock", "promo"
 *   data: Record<string, unknown>;
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { secret, event, data } = body as {
      secret?: string;
      event?: string;
      data?: Record<string, unknown>;
    };

    // ── Auth ────────────────────────────────────────────────────────────────
    const expectedSecret = process.env.CHATBOT_WEBHOOK_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!event) {
      return NextResponse.json({ message: "Missing event field" }, { status: 400 });
    }

    // ── Route event to a human-readable notification ─────────────────────
    let notification: string | null = null;

    switch (event) {
      case "new_order":
        notification = `🛒 New order placed! Order ID: ${data?.orderId ?? "N/A"} — Total: $${data?.total ?? "N/A"}`;
        break;
      case "product_restock":
        notification = `📦 "${data?.productName}" is back in stock! Grab it before it's gone.`;
        break;
      case "promo":
        notification = `🔥 New promo: ${data?.title ?? "Check our latest deals!"} — ${data?.discount ?? ""}% off!`;
        break;
      case "support_ticket":
        notification = `🎫 Support ticket #${data?.ticketId ?? "N/A"} created. Our team will contact you within 24 hours.`;
        break;
      default:
        notification = `📣 Update: ${event} — ${JSON.stringify(data ?? {})}`;
    }

    // In a real-time system you would push this to a pub/sub channel
    // (e.g. Redis pub/sub, Pusher, Ably) so the frontend chatbot can receive it.
    // For now we log and return the notification string so your automation
    // platform can use it as a response.
    console.log("[Chatbot Webhook]", { event, notification, data });

    return NextResponse.json({ success: true, notification });
  } catch (error: any) {
    console.error("Chatbot webhook error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Acknowledge GET requests from platforms that verify the webhook URL
export async function GET() {
  return NextResponse.json({ status: "FreshCart chatbot webhook active ✅" });
}
