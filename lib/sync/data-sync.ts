import { prisma } from "@/lib/prisma";
import { logAuditEvent, enforceBranchScope, AuthenticatedUserSession } from "@/lib/server/branch-guard";

export type SyncEntityType = "members" | "visits" | "trainers" | "shifts" | "bookings";

export interface SyncResult {
  entityType: SyncEntityType;
  totalRows: number;
  imported: number;
  skipped: number;
  errors: string[];
  branchId: string;
  timestamp: string;
}

/**
 * Standard CSV line parser handling quotes, commas, and trimmed values.
 */
export function parseCSV(csvContent: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  // Parse headers (normalize to lowercase without spaces/underscores)
  const rawHeaders = splitCSVLine(lines[0]);
  const headers = rawHeaders.map((h) => h.trim().toLowerCase().replace(/[\s_-]+/g, ""));

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    if (values.length === 0) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, index) => {
      rowObj[h] = values[index] ? values[index].trim() : "";
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Core Data Sync Service for TRI FIT
 * Implements section 7 interface for CSV imports.
 */
export class DataSyncService {
  /**
   * Import Members CSV
   * Columns: name, phone, goal, studio, plan, language, status
   */
  public static async importMembers(
    csvContent: string,
    targetBranchId: string,
    user: AuthenticatedUserSession
  ): Promise<SyncResult> {
    enforceBranchScope(user, targetBranchId);

    const { rows } = parseCSV(csvContent);
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const name = r.name || r.membername || r.fullname;
      const phone = r.phone || r.phonenumber || r.mobile;

      if (!name || !phone) {
        skipped++;
        errors.push(`Row ${i + 1}: Missing required name or phone.`);
        continue;
      }

      try {
        await prisma.member.create({
          data: {
            branchId: targetBranchId,
            name,
            phone,
            goal: r.goal || "Fitness",
            studio: r.studio || "Studio Alpha",
            planId: (r.plan || r.planid || "PRO").toUpperCase(),
            language: r.language === "ur" ? "ur" : "en",
            status: (r.status || "ACTIVE").toUpperCase(),
          },
        });
        imported++;
      } catch (err: any) {
        skipped++;
        errors.push(`Row ${i + 1} (${name}): ${err.message || "Insert failed"}`);
      }
    }

    await logAuditEvent({
      userId: user.id,
      role: user.role,
      action: "DATA_SYNC_IMPORT",
      target: `branch:${targetBranchId}:members`,
      details: `Imported ${imported} members (${skipped} skipped) via CSV.`,
    });

    return {
      entityType: "members",
      totalRows: rows.length,
      imported,
      skipped,
      errors,
      branchId: targetBranchId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Import Visits CSV
   * Columns: memberid (or phone), checkedinat
   */
  public static async importVisits(
    csvContent: string,
    targetBranchId: string,
    user: AuthenticatedUserSession
  ): Promise<SyncResult> {
    enforceBranchScope(user, targetBranchId);

    const { rows } = parseCSV(csvContent);
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const memberIdentifier = r.memberid || r.phone || r.memberphone;
      const dateStr = r.checkedinat || r.checkin || r.date || r.time;

      if (!memberIdentifier) {
        skipped++;
        errors.push(`Row ${i + 1}: Missing member identifier.`);
        continue;
      }

      // Locate member in this branch
      const member = await prisma.member.findFirst({
        where: {
          branchId: targetBranchId,
          OR: [{ id: memberIdentifier }, { phone: memberIdentifier }],
        },
      });

      if (!member) {
        skipped++;
        errors.push(`Row ${i + 1}: Member not found in branch for '${memberIdentifier}'.`);
        continue;
      }

      const checkedInAt = dateStr ? new Date(dateStr) : new Date();

      try {
        await prisma.visit.create({
          data: {
            memberId: member.id,
            branchId: targetBranchId,
            checkedInAt,
          },
        });
        imported++;
      } catch (err: any) {
        skipped++;
        errors.push(`Row ${i + 1}: ${err.message || "Visit insert failed"}`);
      }
    }

    await logAuditEvent({
      userId: user.id,
      role: user.role,
      action: "DATA_SYNC_IMPORT",
      target: `branch:${targetBranchId}:visits`,
      details: `Imported ${imported} visits (${skipped} skipped) via CSV.`,
    });

    return {
      entityType: "visits",
      totalRows: rows.length,
      imported,
      skipped,
      errors,
      branchId: targetBranchId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Import Trainers CSV
   * Columns: name, phone, certificateexpiry
   */
  public static async importTrainers(
    csvContent: string,
    targetBranchId: string,
    user: AuthenticatedUserSession
  ): Promise<SyncResult> {
    enforceBranchScope(user, targetBranchId);

    const { rows } = parseCSV(csvContent);
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const name = r.name || r.trainername;
      const phone = r.phone || r.phonenumber;
      const expiry = r.certificateexpiry || r.expiry;

      if (!name || !phone) {
        skipped++;
        errors.push(`Row ${i + 1}: Missing trainer name or phone.`);
        continue;
      }

      const certificateExpiry = expiry
        ? new Date(expiry)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year default

      try {
        await prisma.trainer.create({
          data: {
            branchId: targetBranchId,
            name,
            phone,
            certificateExpiry,
          },
        });
        imported++;
      } catch (err: any) {
        skipped++;
        errors.push(`Row ${i + 1}: ${err.message || "Trainer insert failed"}`);
      }
    }

    await logAuditEvent({
      userId: user.id,
      role: user.role,
      action: "DATA_SYNC_IMPORT",
      target: `branch:${targetBranchId}:trainers`,
      details: `Imported ${imported} trainers (${skipped} skipped) via CSV.`,
    });

    return {
      entityType: "trainers",
      totalRows: rows.length,
      imported,
      skipped,
      errors,
      branchId: targetBranchId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Import Shifts CSV
   * Columns: trainerid (or trainerphone), startsat, endsat
   */
  public static async importShifts(
    csvContent: string,
    targetBranchId: string,
    user: AuthenticatedUserSession
  ): Promise<SyncResult> {
    enforceBranchScope(user, targetBranchId);

    const { rows } = parseCSV(csvContent);
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const trainerIdentifier = r.trainerid || r.phone || r.trainerphone;
      const startsStr = r.startsat || r.start;
      const endsStr = r.endsat || r.end;

      if (!trainerIdentifier || !startsStr || !endsStr) {
        skipped++;
        errors.push(`Row ${i + 1}: Missing trainer identifier or start/end times.`);
        continue;
      }

      const trainer = await prisma.trainer.findFirst({
        where: {
          branchId: targetBranchId,
          OR: [{ id: trainerIdentifier }, { phone: trainerIdentifier }],
        },
      });

      if (!trainer) {
        skipped++;
        errors.push(`Row ${i + 1}: Trainer not found for '${trainerIdentifier}'.`);
        continue;
      }

      try {
        await prisma.trainerShift.create({
          data: {
            trainerId: trainer.id,
            startsAt: new Date(startsStr),
            endsAt: new Date(endsStr),
          },
        });
        imported++;
      } catch (err: any) {
        skipped++;
        errors.push(`Row ${i + 1}: ${err.message || "Shift insert failed"}`);
      }
    }

    await logAuditEvent({
      userId: user.id,
      role: user.role,
      action: "DATA_SYNC_IMPORT",
      target: `branch:${targetBranchId}:shifts`,
      details: `Imported ${imported} shifts (${skipped} skipped) via CSV.`,
    });

    return {
      entityType: "shifts",
      totalRows: rows.length,
      imported,
      skipped,
      errors,
      branchId: targetBranchId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Import Bookings CSV
   * Columns: memberid (or memberphone), trainerid (or trainerphone), startsat, status
   */
  public static async importBookings(
    csvContent: string,
    targetBranchId: string,
    user: AuthenticatedUserSession
  ): Promise<SyncResult> {
    enforceBranchScope(user, targetBranchId);

    const { rows } = parseCSV(csvContent);
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const memberIdentifier = r.memberid || r.memberphone || r.phone;
      const trainerIdentifier = r.trainerid || r.trainerphone;
      const startsStr = r.startsat || r.start || r.date;

      if (!memberIdentifier || !trainerIdentifier || !startsStr) {
        skipped++;
        errors.push(`Row ${i + 1}: Missing member, trainer, or booking time.`);
        continue;
      }

      const [member, trainer] = await Promise.all([
        prisma.member.findFirst({
          where: {
            branchId: targetBranchId,
            OR: [{ id: memberIdentifier }, { phone: memberIdentifier }],
          },
        }),
        prisma.trainer.findFirst({
          where: {
            branchId: targetBranchId,
            OR: [{ id: trainerIdentifier }, { phone: trainerIdentifier }],
          },
        }),
      ]);

      if (!member) {
        skipped++;
        errors.push(`Row ${i + 1}: Member '${memberIdentifier}' not found.`);
        continue;
      }

      if (!trainer) {
        skipped++;
        errors.push(`Row ${i + 1}: Trainer '${trainerIdentifier}' not found.`);
        continue;
      }

      try {
        await prisma.booking.create({
          data: {
            memberId: member.id,
            trainerId: trainer.id,
            startsAt: new Date(startsStr),
            status: (r.status || "SCHEDULED").toUpperCase(),
          },
        });
        imported++;
      } catch (err: any) {
        skipped++;
        errors.push(`Row ${i + 1}: ${err.message || "Booking insert failed"}`);
      }
    }

    await logAuditEvent({
      userId: user.id,
      role: user.role,
      action: "DATA_SYNC_IMPORT",
      target: `branch:${targetBranchId}:bookings`,
      details: `Imported ${imported} bookings (${skipped} skipped) via CSV.`,
    });

    return {
      entityType: "bookings",
      totalRows: rows.length,
      imported,
      skipped,
      errors,
      branchId: targetBranchId,
      timestamp: new Date().toISOString(),
    };
  }
}
