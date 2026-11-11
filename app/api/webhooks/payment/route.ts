import { NextResponse } from "next/server";
import { StripePaymentGateway, StripeWebhookEvent } from "@/lib/integrations/stripe";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature") || request.headers.get("x-apollo-signature");
    const rawBody = await request.text();

    // Verify signature
    const isValid = StripePaymentGateway.verifySignature(signature, rawBody);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or missing webhook signature" },
        { status: 401 }
      );
    }

    const event: StripeWebhookEvent = JSON.parse(rawBody);
    const result = await StripePaymentGateway.processWebhookEvent(event);

    return NextResponse.json({
      received: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  const transactions = StripePaymentGateway.getProcessedKeys();
  return NextResponse.json({
    totalProcessed: transactions.length,
    transactions,
  });
}
