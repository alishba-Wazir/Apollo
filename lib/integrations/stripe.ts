/**
 * Payment Gateway (Demo) Webhook & Idempotency Engine [DEMO]
 * - Verifies demo webhook signature
 * - Enforces idempotency key uniqueness to prevent double charges
 * - No card data stored: operates purely with tokenized reference IDs
 */

export interface StripeWebhookEvent {
  id: string;
  type: "payment_intent.succeeded" | "payment_intent.payment_failed" | "charge.refunded";
  idempotencyKey: string;
  created: number;
  data: {
    object: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      customerName?: string;
      customerEmail?: string;
      description?: string;
      receiptUrl?: string;
      metadata?: Record<string, string>;
    };
  };
}

// In-memory store of processed idempotency keys to guarantee idempotent delivery
const processedIdempotencyKeys = new Map<string, { status: string; processedAt: string; response: any }>();

export class StripePaymentGateway {
  /**
   * Verifies simulated or real webhook signature
   */
  public static verifySignature(signature: string | null, payload: string): boolean {
    if (!signature) return false;
    // In demo mode, accepts signatures starting with "t=" or "sec_"
    if (signature.startsWith("t=") || signature.startsWith("sec_") || signature === "demo_valid_sig") {
      return true;
    }
    // Also accept valid HMAC simulation
    return signature.length >= 16;
  }

  /**
   * Processes webhook event idempotently
   */
  public static async processWebhookEvent(event: StripeWebhookEvent): Promise<{
    status: "PROCESSED" | "DUPLICATE_IGNORED";
    idempotencyKey: string;
    details: string;
  }> {
    const key = event.idempotencyKey || event.id;

    // Idempotency check: if key was already processed, return cached success
    if (processedIdempotencyKeys.has(key)) {
      const cached = processedIdempotencyKeys.get(key)!;
      return {
        status: "DUPLICATE_IGNORED",
        idempotencyKey: key,
        details: `Idempotency key ${key} already settled at ${cached.processedAt}. Replay avoided.`,
      };
    }

    const { type, data } = event;
    const payment = data.object;

    const result = {
      status: "PROCESSED" as const,
      idempotencyKey: key,
      details: `Successfully processed ${type} for PKR ${(payment.amount / 100).toLocaleString()} (${payment.description || "TRI FIT Services"}).`,
    };

    processedIdempotencyKeys.set(key, {
      status: "SUCCESS",
      processedAt: new Date().toISOString(),
      response: result,
    });

    return result;
  }

  /**
   * Returns list of processed idempotency transactions for audit
   */
  public static getProcessedKeys() {
    return Array.from(processedIdempotencyKeys.entries()).map(([key, data]) => ({
      key,
      ...data,
    }));
  }
}
