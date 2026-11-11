/**
 * Enterprise WhatsApp Business Cloud API Connector [DEMO]
 * Supports transactional templates:
 * - waitlist_spot_opened
 * - membership_renewal_reminder
 * - pt_copilot_nudge
 * - kiosk_receipt
 */

export interface WhatsAppMessagePayload {
  recipientPhone: string;
  recipientName: string;
  templateName: "waitlist_spot_opened" | "membership_renewal_reminder" | "pt_copilot_nudge" | "kiosk_receipt";
  parameters: Record<string, string>;
}

export interface WhatsAppMessageRecord {
  id: string;
  recipientPhone: string;
  recipientName: string;
  templateName: string;
  content: string;
  status: "QUEUED" | "SENT" | "DELIVERED" | "READ";
  sentAt: string;
  deliveredAt: string;
}

// In-memory message store for audit and demo inspection
const messageAuditLog: WhatsAppMessageRecord[] = [
  {
    id: "wa-msg-8890",
    recipientPhone: "0300-0000000",
    recipientName: "Demo Member 01",
    templateName: "pt_copilot_nudge",
    content: "Hi Demo Member 01! Coach Marcus here from TRI FIT. Welcome to VIP Elite tier! Your training regimen and 3D digital twin are ready for review.",
    status: "DELIVERED",
    sentAt: new Date(Date.now() - 3600000).toISOString(),
    deliveredAt: new Date(Date.now() - 3595000).toISOString(),
  },
  {
    id: "wa-msg-8891",
    recipientPhone: "0300-0000001",
    recipientName: "Demo Member 02",
    templateName: "pt_copilot_nudge",
    content: "Hi Demo Member 02! Coach Marcus here. Noticed you hit a PR on Tuesday. Make sure to hydrate and prioritize hamstring mobility today. See you tomorrow!",
    status: "READ",
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    deliveredAt: new Date(Date.now() - 7195000).toISOString(),
  },
  {
    id: "wa-msg-8892",
    recipientPhone: "0300-0000002",
    recipientName: "Demo Member 03",
    templateName: "waitlist_spot_opened",
    content: "Great news Demo Member 03! A spot opened in High-Intensity MetCon (18:30). Tap in your member app to claim within 15 minutes.",
    status: "DELIVERED",
    sentAt: new Date(Date.now() - 900000).toISOString(),
    deliveredAt: new Date(Date.now() - 898000).toISOString(),
  },
];

/**
 * Normalizes demo phone numbers
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.trim();
}

export class WhatsAppDispatcher {
  /**
   * Generates formatted message text from template
   */
  public static formatMessage(payload: WhatsAppMessagePayload): string {
    const { templateName, recipientName, parameters } = payload;
    switch (templateName) {
      case "waitlist_spot_opened":
        return `TRI FIT VIP: Good news ${recipientName}! A spot just opened in ${parameters.className || "Class"} with ${parameters.instructor || "Coach"}. You have ${parameters.expiryTime || "15 minutes"} to confirm your booking: https://trifit.gym/claim/spot`;
      case "membership_renewal_reminder":
        return `Hello ${recipientName}, your ${parameters.tier || "TRI FIT"} Membership is up for annual renewal. Renew early to lock in your ${parameters.discount || "10% Loyalty Credit"}: https://trifit.gym/renew`;
      case "pt_copilot_nudge":
        return `Hey ${recipientName}, Coach checking in! ${parameters.customNote || "Ready to crush your next session? Let me know if you need to adjust your training schedule."}`;
      case "kiosk_receipt":
        return `TRI FIT Digital Receipt: Thank you ${recipientName}! Payment of ${parameters.amount || "PKR 0.00"} for ${parameters.item || "Services"} was successful. Transaction ID: ${parameters.receiptId || "RCP-0000"}.`;
      default:
        return `TRI FIT Update for ${recipientName}.`;
    }
  }

  /**
   * Dispatches a message through the WhatsApp Cloud API pipeline
   */
  public static async sendMessage(payload: WhatsAppMessagePayload): Promise<WhatsAppMessageRecord> {
    const content = this.formatMessage(payload);
    const record: WhatsAppMessageRecord = {
      id: `wa-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientPhone: payload.recipientPhone,
      recipientName: payload.recipientName,
      templateName: payload.templateName,
      content,
      status: "SENT",
      sentAt: new Date().toISOString(),
      deliveredAt: new Date(Date.now() + 1500).toISOString(),
    };

    // Simulate instant delivery transition
    messageAuditLog.unshift(record);

    // Simulate asynchronous delivery receipt
    setTimeout(() => {
      record.status = "DELIVERED";
    }, 1200);

    return record;
  }

  /**
   * Returns recent WhatsApp dispatches for audit UI
   */
  public static getAuditLog(): WhatsAppMessageRecord[] {
    return messageAuditLog;
  }
}
