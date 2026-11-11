import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export interface AuthenticatedUserSession {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "BRANCH_MANAGER" | "TRAINER" | "MEMBER";
  branchId: string | null;
  branchName?: string;
  branchCity?: string;
  trainerId?: string | null;
  memberId?: string | null;
}

/**
 * Enforce branch scoping on the server side:
 * - Admin has global network-wide access across all branches.
 * - Branch Manager can ONLY access their own assigned branchId.
 * - Trainer can access their assigned branch.
 * - Member can access their assigned branch.
 * Throws a BranchAccessError with 403 status code if violation occurs.
 */
export function enforceBranchScope(
  user: AuthenticatedUserSession,
  targetBranchId?: string | null
): { allowed: boolean; effectiveBranchId: string | null } {
  if (user.role === "ADMIN") {
    // Admin can access any branch or all branches (null target)
    return { allowed: true, effectiveBranchId: targetBranchId || null };
  }

  if (user.role === "BRANCH_MANAGER" || user.role === "TRAINER" || user.role === "MEMBER") {
    if (!user.branchId) {
      throw new BranchAccessError(`${user.role} has no assigned branch.`, 403);
    }
    // If targetBranchId is specified, it MUST match the user's assigned branch
    if (targetBranchId && targetBranchId !== user.branchId) {
      throw new BranchAccessError(
        `Forbidden: Access to branch ${targetBranchId} is restricted for role ${user.role}. Scope restricted to ${user.branchId}.`,
        403
      );
    }
    return { allowed: true, effectiveBranchId: user.branchId };
  }

  throw new BranchAccessError("Unauthorized role.", 401);
}

/**
 * Enforce member scoping on the server side:
 * - Admin and Branch Manager (within branch) can access member records.
 * - Member can ONLY access their own memberId.
 */
export function enforceMemberScope(
  user: AuthenticatedUserSession,
  targetMemberId: string
): { allowed: boolean; effectiveMemberId?: string } {
  if (user.role === "ADMIN") {
    return { allowed: true, effectiveMemberId: targetMemberId };
  }

  if (user.role === "MEMBER") {
    const effectiveMemberId = user.memberId || user.id;
    if (effectiveMemberId !== targetMemberId) {
      throw new BranchAccessError(
        `Forbidden: Members cannot view or modify other members' private records.`,
        403
      );
    }
    return { allowed: true, effectiveMemberId };
  }

  if (user.role === "BRANCH_MANAGER" || user.role === "TRAINER") {
    return { allowed: true, effectiveMemberId: targetMemberId };
  }

  throw new BranchAccessError("Unauthorized access to member data.", 403);
}

/**
 * Enforce trainer scoping on the server side:
 * - Admin can access all trainers.
 * - Trainer can ONLY access their own trainer record and clients.
 */
export function enforceTrainerScope(
  user: AuthenticatedUserSession,
  targetTrainerId: string
): { allowed: boolean } {
  if (user.role === "ADMIN") {
    return { allowed: true };
  }

  if (user.role === "TRAINER") {
    const effectiveTrainerId = user.trainerId || user.id;
    if (effectiveTrainerId !== targetTrainerId) {
      throw new BranchAccessError(
        `Forbidden: Trainers cannot access another coach's earnings or clients.`,
        403
      );
    }
    return { allowed: true };
  }

  if (user.role === "BRANCH_MANAGER") {
    return { allowed: true };
  }

  throw new BranchAccessError("Unauthorized access to trainer data.", 403);
}

export class BranchAccessError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 403) {
    super(message);
    this.name = "BranchAccessError";
    this.statusCode = statusCode;
  }
}

/**
 * Audit log recording helper:
 * Records who did what, when, from which role, target, and details.
 */
export async function logAuditEvent(params: {
  userId: string;
  role: string;
  action: string;
  target: string;
  details?: string;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId,
        role: params.role,
        action: params.action,
        target: params.target,
        details: params.details || null,
        at: new Date(),
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR] Failed to record audit log:", error);
    return null;
  }
}
