import { describe, it, expect } from "vitest";
import { StripePaymentGateway, StripeWebhookEvent } from "@/lib/integrations/stripe";

describe("Payment Idempotency & Webhook Signature Verification", () => {
  it("should verify valid webhook signatures and reject invalid ones", () => {
    expect(StripePaymentGateway.verifySignature("t=1730881920,v1=sec_test_valid_sig", "payload")).toBe(true);
    expect(StripePaymentGateway.verifySignature("demo_valid_sig", "payload")).toBe(true);
    expect(StripePaymentGateway.verifySignature(null, "payload")).toBe(false);
    expect(StripePaymentGateway.verifySignature("short", "payload")).toBe(false);
  });

  it("should process a payment event on first receipt and ignore duplicate replay", async () => {
    const testKey = `idemp_unit_test_${Date.now()}`;
    const event: StripeWebhookEvent = {
      id: `evt_${Date.now()}`,
      type: "payment_intent.succeeded",
      idempotencyKey: testKey,
      created: 1730881920,
      data: {
        object: {
          id: `pi_${Date.now()}`,
          amount: 4500,
          currency: "usd",
          status: "succeeded",
          description: "Unit Test Payment",
        },
      },
    };

    // First attempt: should be PROCESSED
    const firstRun = await StripePaymentGateway.processWebhookEvent(event);
    expect(firstRun.status).toBe("PROCESSED");
    expect(firstRun.idempotencyKey).toBe(testKey);

    // Second attempt with same key: should be DUPLICATE_IGNORED
    const secondRun = await StripePaymentGateway.processWebhookEvent(event);
    expect(secondRun.status).toBe("DUPLICATE_IGNORED");
    expect(secondRun.details).toContain("already settled");
  });
});
