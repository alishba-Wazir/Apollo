/**
 * Win-Back AI Eligibility Guardrails Engine
 * Strictly testable, pure functions enforcing Section 3 rules:
 * - opt_in required
 * - membership active
 * - not frozen
 * - 14-day cooldown
 * - quiet hours respected (22:00 - 07:00 PKT)
 * - prayer times respected
 * - auto-send permanently off (manager click required)
 * - medical advice boundary
 */

export interface EligibilityMember {
  id: string;
  name: string;
  phone: string;
  status: string; // ACTIVE, FROZEN, CANCELLED
  frozenUntil?: Date | string | null;
  whatsappOptIn: boolean;
  lastContactedAt?: Date | string | null;
}

export interface EligibilityResult {
  eligible: boolean;
  blockedReason: string | null;
  checks: {
    optIn: boolean;
    activeStatus: boolean;
    notFrozen: boolean;
    cooldownPassed: boolean;
    outsideQuietHours: boolean;
    outsidePrayerTime: boolean;
  };
}

export function checkWhatsAppOptIn(member: EligibilityMember): boolean {
  return member.whatsappOptIn === true;
}

export function checkMembershipActive(member: EligibilityMember): boolean {
  return member.status === "ACTIVE";
}

export function checkNotFrozen(member: EligibilityMember, now: Date = new Date()): boolean {
  if (member.status === "FROZEN") return false;
  if (!member.frozenUntil) return true;
  const frozenDate = new Date(member.frozenUntil);
  return frozenDate.getTime() <= now.getTime();
}

export function checkCooldown(
  lastContactedAt?: Date | string | null,
  now: Date = new Date()
): boolean {
  if (!lastContactedAt) return true;
  const lastContact = new Date(lastContactedAt).getTime();
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  return now.getTime() - lastContact >= fourteenDaysMs;
}

export function checkQuietHours(
  timeStr: string, // e.g. "23:15" or "08:30"
  quietHoursStart: string = "22:00",
  quietHoursEnd: string = "07:00"
): boolean {
  const [h, m] = timeStr.split(":").map(Number);
  const currentMinutes = h * 60 + m;

  const [startH, startM] = quietHoursStart.split(":").map(Number);
  const startMinutes = startH * 60 + startM;

  const [endH, endM] = quietHoursEnd.split(":").map(Number);
  const endMinutes = endH * 60 + endM;

  // Overnight quiet hours (e.g. 22:00 to 07:00)
  if (startMinutes > endMinutes) {
    if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
      return false; // inside quiet hours
    }
    return true;
  } else {
    // Daytime quiet hours (rare)
    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      return false;
    }
    return true;
  }
}

export function checkPrayerTime(
  currentTimeStr: string, // e.g. "17:45"
  prayerSchedule: Record<string, string> = {
    fajr: "05:30",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "17:45",
    isha: "19:15",
  },
  windowMinutes: number = 20, // 20-minute congregation buffer
  bufferBeforeMinutes: number = 5 // 5-minute pre-prayer preparation window
): boolean {
  const [curH, curM] = currentTimeStr.split(":").map(Number);
  const currentTotal = curH * 60 + curM;

  for (const [name, time] of Object.entries(prayerSchedule)) {
    const [pH, pM] = time.split(":").map(Number);
    const prayerTotal = pH * 60 + pM;

    // Check if current time falls within [prayerTime - bufferBeforeMinutes, prayerTime + windowMinutes]
    if (currentTotal >= prayerTotal - bufferBeforeMinutes && currentTotal <= prayerTotal + windowMinutes) {
      return false; // inside prayer window
    }
  }

  return true;
}

/**
 * Aggregated eligibility evaluator
 */
export function evaluateWinbackEligibility(params: {
  member: EligibilityMember;
  currentTimeStr?: string;
  now?: Date;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  prayerSchedule?: Record<string, string>;
}): EligibilityResult {
  const now = params.now || new Date();
  const timeStr =
    params.currentTimeStr ||
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const optIn = checkWhatsAppOptIn(params.member);
  const activeStatus = checkMembershipActive(params.member);
  const notFrozen = checkNotFrozen(params.member, now);
  const cooldownPassed = checkCooldown(params.member.lastContactedAt, now);
  const outsideQuietHours = checkQuietHours(
    timeStr,
    params.quietHoursStart || "22:00",
    params.quietHoursEnd || "07:00"
  );
  const outsidePrayerTime = checkPrayerTime(timeStr, params.prayerSchedule);

  let blockedReason: string | null = null;
  if (!optIn) blockedReason = "Member has not opted in to WhatsApp communication.";
  else if (!activeStatus) blockedReason = "Membership status is inactive or cancelled.";
  else if (!notFrozen) blockedReason = "Member pass is currently frozen.";
  else if (!cooldownPassed) blockedReason = "14-day outreach cooldown has not elapsed.";
  else if (!outsideQuietHours) blockedReason = "Quiet hours active (22:00 - 07:00 PKT).";
  else if (!outsidePrayerTime) blockedReason = "Prayer time congregation active.";

  return {
    eligible:
      optIn &&
      activeStatus &&
      notFrozen &&
      cooldownPassed &&
      outsideQuietHours &&
      outsidePrayerTime,
    blockedReason,
    checks: {
      optIn,
      activeStatus,
      notFrozen,
      cooldownPassed,
      outsideQuietHours,
      outsidePrayerTime,
    },
  };
}

/**
 * Medical & Health safety filter:
 * Checks if a member reply mentions pain, injury, surgery, or medical symptoms.
 */
export function checkMedicalKeyword(text: string): {
  isMedical: boolean;
  matchedKeyword?: string;
} {
  const medicalKeywords = [
    "pain",
    "injury",
    "injured",
    "hurt",
    "sprain",
    "doctor",
    "surgery",
    "hospital",
    "shoulder",
    "back pain",
    "knee",
    "daktar",
    "chot",
    "dard",
    "bimar",
  ];

  const lower = text.toLowerCase();
  for (const kw of medicalKeywords) {
    if (lower.includes(kw)) {
      return { isMedical: true, matchedKeyword: kw };
    }
  }

  return { isMedical: false };
}
