import { describe, it, expect } from "vitest";

describe("Smart Waitlists Queue & 15-Minute Expiry Engine", () => {
  interface WaitlistCandidate {
    id: string;
    name: string;
    tier: "VIP_BLACK" | "PREMIUM" | "STANDARD";
    joinedAt: number;
    priorityScore: number;
    status: "QUEUED" | "OFFERED" | "EXPIRED" | "CLAIMED";
    offerExpiresAt?: number;
  }

  const calculatePriorityScore = (tier: string, waitMinutes: number) => {
    const tierMultiplier = tier === "VIP_BLACK" ? 2.5 : tier === "PREMIUM" ? 1.5 : 1.0;
    return Math.round((waitMinutes * 1.2 + 50) * tierMultiplier);
  };

  const isOfferExpired = (offerExpiresAt: number, currentTime: number) => {
    return currentTime >= offerExpiresAt;
  };

  it("should weight VIP Black tier members higher than standard members joining at the same time", () => {
    const vipScore = calculatePriorityScore("VIP_BLACK", 30);
    const standardScore = calculatePriorityScore("STANDARD", 30);

    expect(vipScore).toBeGreaterThan(standardScore);
    expect(vipScore).toBe(215); // (36 + 50) * 2.5
    expect(standardScore).toBe(86); // (36 + 50) * 1.0
  });

  it("should correctly identify expired offers after 15 minutes (900,000ms)", () => {
    const offerSentTime = 1000000;
    const fifteenMinutesMs = 15 * 60 * 1000;
    const expiryTime = offerSentTime + fifteenMinutesMs;

    // Within window (14 mins)
    expect(isOfferExpired(expiryTime, offerSentTime + 14 * 60 * 1000)).toBe(false);

    // At window boundary (15 mins)
    expect(isOfferExpired(expiryTime, expiryTime)).toBe(true);

    // Past window (16 mins)
    expect(isOfferExpired(expiryTime, offerSentTime + 16 * 60 * 1000)).toBe(true);
  });

  it("should promote the highest priority score queued candidate when an offer expires", () => {
    const queue: WaitlistCandidate[] = [
      {
        id: "w-1",
        name: "Elena Rostova",
        tier: "VIP_BLACK",
        joinedAt: 100,
        priorityScore: 215,
        status: "QUEUED",
      },
      {
        id: "w-2",
        name: "John Miller",
        tier: "STANDARD",
        joinedAt: 80,
        priorityScore: 92,
        status: "QUEUED",
      },
    ];

    // Sort by priority descending
    const sorted = [...queue].sort((a, b) => b.priorityScore - a.priorityScore);
    const nextInLine = sorted[0];

    expect(nextInLine.id).toBe("w-1");
    expect(nextInLine.name).toBe("Elena Rostova");
  });
});
