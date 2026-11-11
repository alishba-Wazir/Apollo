import { describe, it, expect } from "vitest";
import {
  checkWhatsAppOptIn,
  checkMembershipActive,
  checkNotFrozen,
  checkCooldown,
  checkQuietHours,
  checkPrayerTime,
  evaluateWinbackEligibility,
  checkMedicalKeyword,
  EligibilityMember,
} from "../../lib/winback/guardrails";
import { GeminiWinbackMock } from "../../lib/winback/gemini-mock";

describe("Win-Back AI Guardrails & Eligibility Engine", () => {
  const baseMember: EligibilityMember = {
    id: "mem_test_1",
    name: "Tariq Mahmood",
    phone: "0300-1234567",
    status: "ACTIVE",
    whatsappOptIn: true,
    lastContactedAt: null,
  };

  describe("Rule: WhatsApp Opt-In", () => {
    it("allows member with explicit WhatsApp opt-in", () => {
      expect(checkWhatsAppOptIn(baseMember)).toBe(true);
    });

    it("blocks member who has opted out of WhatsApp messages", () => {
      expect(checkWhatsAppOptIn({ ...baseMember, whatsappOptIn: false })).toBe(false);
    });
  });

  describe("Rule: Membership Status", () => {
    it("allows ACTIVE member", () => {
      expect(checkMembershipActive(baseMember)).toBe(true);
    });

    it("blocks CANCELLED or EXPIRED member", () => {
      expect(checkMembershipActive({ ...baseMember, status: "CANCELLED" })).toBe(false);
      expect(checkMembershipActive({ ...baseMember, status: "EXPIRED" })).toBe(false);
    });
  });

  describe("Rule: Frozen Status", () => {
    it("allows member not frozen", () => {
      expect(checkNotFrozen(baseMember)).toBe(true);
    });

    it("blocks member explicitly flagged FROZEN", () => {
      expect(checkNotFrozen({ ...baseMember, status: "FROZEN" })).toBe(false);
    });

    it("blocks member with future frozenUntil date", () => {
      const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      expect(checkNotFrozen({ ...baseMember, frozenUntil: future })).toBe(false);
    });

    it("allows member whose freeze period has expired", () => {
      const past = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      expect(checkNotFrozen({ ...baseMember, frozenUntil: past })).toBe(true);
    });
  });

  describe("Rule: 14-Day Cooldown", () => {
    it("allows member who was never contacted", () => {
      expect(checkCooldown(null)).toBe(true);
      expect(checkCooldown(undefined)).toBe(true);
    });

    it("blocks outreach if contacted 5 days ago", () => {
      const recent = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      expect(checkCooldown(recent)).toBe(false);
    });

    it("allows outreach if last contacted 15 days ago", () => {
      const old = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
      expect(checkCooldown(old)).toBe(true);
    });
  });

  describe("Rule: Quiet Hours (22:00 to 07:00 PKT)", () => {
    it("blocks messaging at 23:30 (night)", () => {
      expect(checkQuietHours("23:30")).toBe(false);
    });

    it("blocks messaging at 04:15 (early morning)", () => {
      expect(checkQuietHours("04:15")).toBe(false);
    });

    it("allows messaging at 11:30 (daytime business hours)", () => {
      expect(checkQuietHours("11:30")).toBe(true);
    });

    it("allows messaging at 17:00 (afternoon)", () => {
      expect(checkQuietHours("17:00")).toBe(true);
    });
  });

  describe("Rule: Prayer Time Buffer (20-minute window)", () => {
    const prayers = {
      fajr: "05:30",
      dhuhr: "12:30",
      asr: "15:45",
      maghrib: "17:45",
      isha: "19:15",
    };

    it("blocks outreach during Maghrib congregation window (17:48)", () => {
      expect(checkPrayerTime("17:48", prayers, 20)).toBe(false);
    });

    it("blocks outreach 5 minutes before Dhuhr prayer (12:26)", () => {
      expect(checkPrayerTime("12:26", prayers, 20)).toBe(false);
    });

    it("allows outreach well outside prayer windows (14:15)", () => {
      expect(checkPrayerTime("14:15", prayers, 20)).toBe(true);
    });
  });

  describe("Comprehensive Eligibility Evaluation", () => {
    it("approves fully compliant member during permitted hours", () => {
      const res = evaluateWinbackEligibility({
        member: baseMember,
        currentTimeStr: "11:00",
        now: new Date(),
      });
      expect(res.eligible).toBe(true);
      expect(res.blockedReason).toBeNull();
    });

    it("blocks member if within quiet hours", () => {
      const res = evaluateWinbackEligibility({
        member: baseMember,
        currentTimeStr: "23:00",
        now: new Date(),
      });
      expect(res.eligible).toBe(false);
      expect(res.blockedReason).toContain("Quiet hours");
    });
  });

  describe("Rule: Medical Boundaries & Human Handover", () => {
    it("flags medical keyword 'pain' and initiates handover", () => {
      const check = checkMedicalKeyword("I had sharp knee pain after squats");
      expect(check.isMedical).toBe(true);
      expect(check.matchedKeyword).toBe("pain");

      const tagged = GeminiWinbackMock.tagReply("I had sharp knee pain after squats");
      expect(tagged.reasonTag).toBe("injury");
      expect(tagged.handedToHuman).toBe(true);
      expect(tagged.suggestedAction).toContain("Floor Manager personal call");
    });

    it("flags 'doctor' recommendation for handover", () => {
      const tagged = GeminiWinbackMock.tagReply("Doctor told me to take complete bed rest for 2 weeks");
      expect(tagged.handedToHuman).toBe(true);
      expect(tagged.reasonTag).toBe("injury");
    });

    it("does not flag non-medical reasons (work, travel) for medical handover", () => {
      const workReply = GeminiWinbackMock.tagReply("Stuck with quarterly office audit");
      expect(workReply.reasonTag).toBe("work");
      expect(workReply.handedToHuman).toBe(false);

      const travelReply = GeminiWinbackMock.tagReply("Currently in Lahore for a family wedding");
      expect(travelReply.reasonTag).toBe("travel");
      expect(travelReply.handedToHuman).toBe(false);
    });
  });

  describe("Gemini Message Drafting Mock", () => {
    it("generates English draft with member name and coach", () => {
      const draft = GeminiWinbackMock.draftMessage({
        memberName: "Bilal Khan",
        daysAway: 12,
        normalVisits: 4,
        goal: "Hypertrophy",
        studio: "Strength Studio",
        coachName: "Coach Hamza",
        branchName: "TRI FIT Seaview",
        language: "en",
      });
      expect(draft).toContain("Bilal");
      expect(draft).toContain("Coach Hamza");
      expect(draft).toContain("12 days");
      expect(draft).toContain("TRI FIT Seaview");
    });

    it("generates Roman Urdu draft with respectful conversational tone", () => {
      const draft = GeminiWinbackMock.draftMessage({
        memberName: "Kamran Akram",
        daysAway: 14,
        normalVisits: 3,
        goal: "Fat Loss",
        studio: "Burn Lab",
        coachName: "Coach Bilal",
        branchName: "TRI FIT AJ Tower",
        language: "ur",
      });
      expect(draft).toContain("Salam Kamran bhai!");
      expect(draft).toContain("Coach Bilal");
      expect(draft).toContain("14 din");
      expect(draft).toContain("TRI FIT AJ Tower");
    });
  });
});
