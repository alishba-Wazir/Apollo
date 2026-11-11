import { checkMedicalKeyword } from "./guardrails";

export interface DraftContext {
  memberName: string;
  daysAway: number;
  normalVisits: number;
  goal: string;
  studio: string;
  coachName?: string;
  branchName: string;
  language: "en" | "ur";
}

export interface TaggedReply {
  replyText: string;
  reasonTag: "work" | "boredom" | "travel" | "cost" | "injury" | "other";
  handedToHuman: boolean;
  suggestedAction: string;
  handoverReason?: string;
}

/**
 * Gemini Mock Interface (Section 7)
 * Swappable module generating drafts and tagging replies offline.
 */
export class GeminiWinbackMock {
  public static draftMessage(context: DraftContext): string {
    const coach = context.coachName || "your floor coach";
    const firstName = context.memberName.split(" ")[0];

    if (context.language === "ur") {
      // Roman Urdu (Natural conversational style common in Karachi/Islamabad gyms)
      return `Salam ${firstName} bhai! Humne notice kiya aap pichle ${context.daysAway} din se ${context.branchName} nahi aaye. Coach ${coach} aapke ${context.goal.toLowerCase()} sessions miss kar rahe hain. Sab kheriyat hai na? Agar time ka masla hai tou hum flexible slot adjust kar sakte hain.`;
    }

    // English
    return `Salam ${firstName}! We noticed you haven't been in for ${context.daysAway} days for your ${context.goal.toLowerCase()} workouts in ${context.studio} at ${context.branchName}. Coach ${coach} was asking after you. Is everything okay? We would love to help you get back on track!`;
  }

  /**
   * Pre-scripted realistic member replies for demonstration
   */
  public static getSimulatedReplies(memberName: string): Record<string, string> {
    const first = memberName.split(" ")[0];
    return {
      work: `Salam! Office has been crazy with quarterly closing and late night audits. Really wanting to get back this Saturday.`,
      travel: `Hey! I am currently traveling to Lahore for family wedding events until next Tuesday. Please hold my slot!`,
      injury: `Salam, I had sharp shoulder pain during bench press two weeks ago. Doctor asked me to rest it.`,
      cost: `Salam, budget is a bit tight this month with fee hikes so I was considering taking a break.`,
      boredom: `Hi! To be honest, I felt my routine got repetitive and lost some motivation lately.`,
      other: `Salam! Was unwell with flu last week, feeling better now and planning to visit tomorrow morning.`,
    };
  }

  /**
   * Tag incoming reply and enforce medical boundaries
   */
  public static tagReply(replyText: string): TaggedReply {
    const medicalCheck = checkMedicalKeyword(replyText);

    if (medicalCheck.isMedical) {
      return {
        replyText,
        reasonTag: "injury",
        handedToHuman: true,
        suggestedAction: "Floor Manager personal call. Do NOT prescribe workouts, rest advice, or medical diagnostics.",
        handoverReason: `Medical trigger detected ('${medicalCheck.matchedKeyword}'). Transferred to human supervisor.`,
      };
    }

    const lower = replyText.toLowerCase();

    if (lower.includes("travel") || lower.includes("lahore") || lower.includes("trip") || lower.includes("flight")) {
      return {
        replyText,
        reasonTag: "travel",
        handedToHuman: false,
        suggestedAction: "Offer complimentary pass freeze until return date.",
      };
    }

    if (lower.includes("office") || lower.includes("work") || lower.includes("audit") || lower.includes("busy") || lower.includes("meeting")) {
      return {
        replyText,
        reasonTag: "work",
        handedToHuman: false,
        suggestedAction: "Suggest quiet-hour early morning 06:30 session or weekend slot.",
      };
    }

    if (lower.includes("budget") || lower.includes("cost") || lower.includes("price") || lower.includes("expensive") || lower.includes("fee")) {
      return {
        replyText,
        reasonTag: "cost",
        handedToHuman: true,
        suggestedAction: "Offer loyalty renewal discount or flexible monthly installment option.",
      };
    }

    if (lower.includes("motivation") || lower.includes("bored") || lower.includes("routine") || lower.includes("repetitive")) {
      return {
        replyText,
        reasonTag: "boredom",
        handedToHuman: false,
        suggestedAction: "Book a complimentary session with a new studio or personal trainer.",
      };
    }

    return {
      replyText,
      reasonTag: "other",
      handedToHuman: false,
      suggestedAction: "Send encouraging welcome back note with reserved locker.",
    };
  }
}
