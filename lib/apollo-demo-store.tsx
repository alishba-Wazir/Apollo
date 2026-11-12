"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

// ==========================================
// DATA TYPES
// ==========================================

export interface Branch {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  status: "ACTIVE" | "MAINTENANCE" | "COMING_SOON";
  type: string;
  hours: string;
  whatsappNumber: string;
  capacity: number;
  managerName: string;
  managerEmail: string;
  equipmentCount: number;
}

export type MemberStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "EXPIRED" | "SUSPENDED";

export interface Member {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  branchId: string;
  planId: string;
  trainerId: string | null;
  status: MemberStatus;
  joiningDate: string;
  startDate: string;
  expiryDate: string;
  fitnessGoal: "Strength & Muscle" | "Fat Loss & Conditioning" | "Endurance & Stamina" | "Athletic Performance" | "Rehabilitation & Mobility";
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced" | "Elite Athlete";
  studio: string;
  lockerNumber: string;
  avatar: string;
  bioScanCount: number;
  totalCheckins: number;
  lastCheckin: string | null;
  lastCheckedOut: string | null;
  notes?: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  bio: string;
  avatar: string;
  activeClientsCount: number;
  completedSessions: number;
  weeklyHours: number;
  hourlyRatePKR: number;
  commissionRate: number; // percentage
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Branch Manager" | "Assistant Manager" | "Front Desk Lead" | "Operations Officer" | "Maintenance Lead" | "Nutritionist";
  branchId: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  joinDate: string;
  shift: "Morning (06:00 - 14:00)" | "Evening (14:00 - 22:00)" | "Full Day";
}

export interface MembershipPlan {
  id: string;
  name: string;
  code: string;
  tier: "VIP" | "PRO" | "STANDARD" | "SPECIAL";
  pricePKR: number;
  durationMonths: number;
  description: string;
  includedFacilities: string[];
  discountPercent: number;
  renewalGraceDays: number;
  isActive: boolean;
  memberCount?: number;
  monthlyEquivalentPKR?: number;
  category?: "Regular" | "Plus" | "Special";
  badge?: string;
  includesSummary?: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceNo: string;
  memberId: string;
  memberName: string;
  branchId: string;
  planName: string;
  amountPKR: number;
  paymentMethod: "IBFT_BANK" | "CREDIT_CARD" | "CASH" | "JAZZCASH_EASYPAISA";
  status: "COMPLETED" | "PENDING" | "REFUNDED" | "FAILED";
  timestamp: string;
  bankReference?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  branchId: string;
  branchName: string;
  checkInTime: string;
  checkOutTime: string | null;
  method: "TURNSTILE_FACE" | "QR_CODE" | "MANUAL_DESK";
  gateName: string;
}

export interface GymClass {
  id: string;
  name: string;
  studio: string;
  branchId: string;
  trainerId: string;
  trainerName: string;
  startTime: string; // "07:00 AM"
  endTime: string;
  daysOfWeek: string[];
  capacity: number;
  bookedCount: number;
  category: "HIIT" | "Spin & RPM" | "Yoga & Pilates" | "Strength" | "Combat / Boxing";
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export interface ExerciseItem {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  targetMuscle: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  trainerId: string;
  assignedMemberId: string | null;
  goal: string;
  experienceLevel: string;
  durationMinutes: number;
  daysPerWeek: number;
  targetMuscleGroups: string[];
  equipmentNeeded: string[];
  exercises: ExerciseItem[];
  isAiGenerated: boolean;
  createdAt: string;
}

export interface MemberAssessment {
  id: string;
  memberId: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number;
  muscleMassKg: number;
  visceralFat: number;
  bmi: number;
  bloodPressure: string;
  notes: string;
}

// Social Hub Models
export type SocialPlatform = "Instagram" | "Facebook" | "TikTok" | "YouTube" | "LinkedIn";
export type PostContentType = "Image" | "Video" | "Story" | "Reel" | "Promotional" | "Announcement" | "Member Spotlight" | "Trainer Spotlight";
export type PostStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "REJECTED";

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  handle: string;
  displayName: string;
  isConnected: boolean;
  followersCount: number;
  engagementRate: number;
  avatarUrl: string;
  lastSynced: string;
}

export interface SocialPost {
  id: string;
  title: string;
  caption: string;
  contentType: PostContentType;
  platform: SocialPlatform;
  mediaUrl: string;
  hashtags: string[];
  branchId: string | null;
  campaignId: string | null;
  status: PostStatus;
  createdAt: string;
  scheduledFor: string | null;
  publishedAt: string | null;
  approvedBy?: string;
  rejectionReason?: string;
  likes: number;
  commentsCount: number;
  shares: number;
  reach: number;
  impressions: number;
}

export interface SocialCampaign {
  id: string;
  name: string;
  goal: "Brand Awareness" | "Member Acquisition" | "Seasonal Special" | "Personal Training Push" | "Corporate Partnerships";
  branchId: string | null;
  startDate: string;
  endDate: string;
  budgetPKR: number;
  spentPKR: number;
  impressions: number;
  reach: number;
  conversions: number;
  status: "ACTIVE" | "SCHEDULED" | "COMPLETED" | "PAUSED";
}

export interface SocialMessage {
  id: string;
  platform: SocialPlatform;
  senderName: string;
  senderHandle: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  replyText?: string;
  repliedAt?: string;
  isComment: boolean;
  postTitle?: string;
}

// ==========================================
// INITIAL SEED DATA (TriFit Reference)
// ==========================================

const SEED_BRANCHES: Branch[] = [
  {
    id: "branch-seaview",
    name: "TriFit Seaview DHA — Karachi",
    city: "Karachi",
    area: "DHA Phase 6 (Flagship)",
    address: "Sea View Road, Phase 6, DHA, Karachi",
    status: "ACTIVE",
    type: "Mixed Premium Flagship",
    hours: "06:00 - 23:00 PKT",
    whatsappNumber: "+92 300 8271001",
    capacity: 450,
    managerName: "Kamran Akram",
    managerEmail: "kamran.akram@trifit.com.pk",
    equipmentCount: 68,
  },
  {
    id: "branch-clifton",
    name: "TriFit Clifton — Karachi",
    city: "Karachi",
    area: "Block 4, Clifton",
    address: "Park Towers Vicinity, Block 4, Clifton, Karachi",
    status: "ACTIVE",
    type: "Mixed Luxury Club",
    hours: "06:00 - 23:00 PKT",
    whatsappNumber: "+92 300 8271002",
    capacity: 320,
    managerName: "Farhan Siddiqui",
    managerEmail: "farhan.s@trifit.com.pk",
    equipmentCount: 52,
  },
  {
    id: "branch-luckyone",
    name: "TriFit LuckyOne Mall — Karachi",
    city: "Karachi",
    area: "Federal B Area",
    address: "LuckyOne Mall, 2nd Floor, Rashid Minhas Road, Karachi",
    status: "ACTIVE",
    type: "Mixed Family & Athletes",
    hours: "06:00 - 23:00 PKT",
    whatsappNumber: "+92 300 8271003",
    capacity: 350,
    managerName: "Ayesha Qureshi",
    managerEmail: "ayesha.q@trifit.com.pk",
    equipmentCount: 58,
  },
  {
    id: "branch-ajtower",
    name: "TriFit AJ Tower — Gulberg Greens, Islamabad",
    city: "Islamabad",
    area: "Gulberg Greens",
    address: "AJ Tower, Civic Center, Gulberg Greens, Islamabad",
    status: "ACTIVE",
    type: "Mixed Executive Club",
    hours: "06:00 - 23:00 PKT",
    whatsappNumber: "+92 300 8271004",
    capacity: 380,
    managerName: "Bilal Hashmi",
    managerEmail: "bilal.h@trifit.com.pk",
    equipmentCount: 62,
  },
];

const SEED_TRAINERS: Trainer[] = [
  {
    id: "tr-tariq",
    name: "Coach Tariq Mahmood",
    email: "tariq.mahmood@trifit.com.pk",
    phone: "+92 321 8234101",
    branchId: "branch-seaview",
    specialty: "Olympic Weightlifting & Strength",
    experienceYears: 8,
    rating: 4.9,
    bio: "CSCS certified strength specialist with 8 years of high-performance coaching.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 14,
    completedSessions: 840,
    weeklyHours: 36,
    hourlyRatePKR: 4500,
    commissionRate: 40,
    status: "ACTIVE",
  },
  {
    id: "tr-alishba",
    name: "Coach Alishba Noor",
    email: "alishba.noor@trifit.com.pk",
    phone: "+92 321 8234102",
    branchId: "branch-seaview",
    specialty: "HIIT & Female Athletic Conditioning",
    experienceYears: 6,
    rating: 4.95,
    bio: "Master trainer in functional metabolic conditioning and posture correction.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 16,
    completedSessions: 920,
    weeklyHours: 38,
    hourlyRatePKR: 5000,
    commissionRate: 40,
    status: "ACTIVE",
  },
  {
    id: "tr-bilal",
    name: "Coach Bilal Aslam",
    email: "bilal.aslam@trifit.com.pk",
    phone: "+92 321 8234103",
    branchId: "branch-clifton",
    specialty: "Body Composition & Hypertrophy",
    experienceYears: 7,
    rating: 4.85,
    bio: "Bodybuilding coach specializing in lean muscle gain and nutrition macros.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 12,
    completedSessions: 650,
    weeklyHours: 32,
    hourlyRatePKR: 4200,
    commissionRate: 35,
    status: "ACTIVE",
  },
  {
    id: "tr-zeeshan",
    name: "Coach Zeeshan Qureshi",
    email: "zeeshan.q@trifit.com.pk",
    phone: "+92 321 8234104",
    branchId: "branch-clifton",
    specialty: "Crossfit & Mobility",
    experienceYears: 5,
    rating: 4.8,
    bio: "Crossfit Level 2 coach focused on functional mobility, agility, and power.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 10,
    completedSessions: 490,
    weeklyHours: 30,
    hourlyRatePKR: 3800,
    commissionRate: 35,
    status: "ACTIVE",
  },
  {
    id: "tr-sara",
    name: "Coach Sara Farooq",
    email: "sara.farooq@trifit.com.pk",
    phone: "+92 321 8234105",
    branchId: "branch-luckyone",
    specialty: "Pilates & Core Stability",
    experienceYears: 6,
    rating: 4.92,
    bio: "Certified Pilates reformer and Matwork instructor with rehab experience.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 15,
    completedSessions: 780,
    weeklyHours: 35,
    hourlyRatePKR: 4500,
    commissionRate: 40,
    status: "ACTIVE",
  },
  {
    id: "tr-hamza",
    name: "Coach Hamza Malik",
    email: "hamza.malik@trifit.com.pk",
    phone: "+92 321 8234106",
    branchId: "branch-luckyone",
    specialty: "Endurance & Calisthenics",
    experienceYears: 4,
    rating: 4.75,
    bio: "Former triathlete coaching cardiovascular endurance and bodyweight control.",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 9,
    completedSessions: 390,
    weeklyHours: 28,
    hourlyRatePKR: 3500,
    commissionRate: 30,
    status: "ACTIVE",
  },
  {
    id: "tr-danial",
    name: "Coach Danial Khan",
    email: "danial.khan@trifit.com.pk",
    phone: "+92 321 8234107",
    branchId: "branch-ajtower",
    specialty: "Powerlifting & Tactical Fitness",
    experienceYears: 9,
    rating: 4.9,
    bio: "National powerlifting record holder and head strength coach in Islamabad.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 18,
    completedSessions: 1100,
    weeklyHours: 40,
    hourlyRatePKR: 5000,
    commissionRate: 45,
    status: "ACTIVE",
  },
  {
    id: "tr-maryam",
    name: "Coach Maryam Siddiqui",
    email: "maryam.s@trifit.com.pk",
    phone: "+92 321 8234108",
    branchId: "branch-ajtower",
    specialty: "Vinyasa Yoga & Breathwork",
    experienceYears: 5,
    rating: 4.88,
    bio: "Yoga Alliance RYT-500 instructor specializing in stress relief and flexibility.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 11,
    completedSessions: 520,
    weeklyHours: 30,
    hourlyRatePKR: 4000,
    commissionRate: 35,
    status: "ACTIVE",
  },
  {
    id: "tr-waleed-q",
    name: "Coach Waleed Q.",
    email: "waleed.q@trifit.com.pk",
    phone: "+92 321 8234109",
    branchId: "branch-seaview",
    specialty: "Strength & Hypertrophy",
    experienceYears: 6,
    rating: 4.6,
    bio: "Strength & Hypertrophy specialist. Client roster currently scheduled for retention audit.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 32,
    completedSessions: 720,
    weeklyHours: 36,
    hourlyRatePKR: 4500,
    commissionRate: 35,
    status: "ACTIVE",
  },
  {
    id: "tr-sarah-siddiqui",
    name: "Coach Sarah Siddiqui",
    email: "sarah.siddiqui@trifit.com.pk",
    phone: "+92 321 8234110",
    branchId: "branch-seaview",
    specialty: "Vinyasa Flow",
    experienceYears: 7,
    rating: 4.98,
    bio: "Lead Vinyasa instructor with elite 98.8% client retention and zero cancellations.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    activeClientsCount: 26,
    completedSessions: 890,
    weeklyHours: 35,
    hourlyRatePKR: 4800,
    commissionRate: 40,
    status: "ACTIVE",
  },
];

const SEED_STAFF: Staff[] = [
  { id: "st-1", name: "Kamran Akram", email: "kamran.a@trifit.com.pk", phone: "+92 300 1110001", role: "Branch Manager", branchId: "branch-seaview", status: "ACTIVE", joinDate: "2023-01-15", shift: "Full Day" },
  { id: "st-2", name: "Zubair Hashmi", email: "zubair.h@trifit.com.pk", phone: "+92 300 1110002", role: "Front Desk Lead", branchId: "branch-seaview", status: "ACTIVE", joinDate: "2023-03-10", shift: "Morning (06:00 - 14:00)" },
  { id: "st-3", name: "Murtaza Ali", email: "murtaza.a@trifit.com.pk", phone: "+92 300 1110003", role: "Maintenance Lead", branchId: "branch-seaview", status: "ACTIVE", joinDate: "2023-02-01", shift: "Morning (06:00 - 14:00)" },
  { id: "st-4", name: "Farhan Siddiqui", email: "farhan.s@trifit.com.pk", phone: "+92 300 1110004", role: "Branch Manager", branchId: "branch-clifton", status: "ACTIVE", joinDate: "2023-05-12", shift: "Full Day" },
  { id: "st-5", name: "Noman Baig", email: "noman.b@trifit.com.pk", phone: "+92 300 1110005", role: "Front Desk Lead", branchId: "branch-clifton", status: "ACTIVE", joinDate: "2023-06-20", shift: "Evening (14:00 - 22:00)" },
  { id: "st-6", name: "Ayesha Qureshi", email: "ayesha.q@trifit.com.pk", phone: "+92 300 1110006", role: "Branch Manager", branchId: "branch-luckyone", status: "ACTIVE", joinDate: "2023-07-01", shift: "Full Day" },
  { id: "st-7", name: "Suleman Raza", email: "suleman.r@trifit.com.pk", phone: "+92 300 1110007", role: "Operations Officer", branchId: "branch-luckyone", status: "ACTIVE", joinDate: "2023-08-15", shift: "Morning (06:00 - 14:00)" },
  { id: "st-8", name: "Bilal Hashmi", email: "bilal.h@trifit.com.pk", phone: "+92 300 1110008", role: "Branch Manager", branchId: "branch-ajtower", status: "ACTIVE", joinDate: "2023-04-10", shift: "Full Day" },
  { id: "st-9", name: "Saad Sheikh", email: "saad.s@trifit.com.pk", phone: "+92 300 1110009", role: "Front Desk Lead", branchId: "branch-ajtower", status: "ACTIVE", joinDate: "2023-09-01", shift: "Evening (14:00 - 22:00)" },
  { id: "st-10", name: "Dr. Hina Rizvi", email: "dr.hina@trifit.com.pk", phone: "+92 300 1110010", role: "Nutritionist", branchId: "branch-seaview", status: "ACTIVE", joinDate: "2023-06-01", shift: "Morning (06:00 - 14:00)" },
];

const SEED_PLANS: MembershipPlan[] = [
  // ─────────────────────────────────────────────────────────────
  // 🏋️ TriFit Regular Plans (3 Options)
  // Includes: Multi-Gym Access, Guest Passes, and Sauna & Steam
  // ─────────────────────────────────────────────────────────────
  {
    id: "plan-trifit-regular-3m",
    name: "TriFit Regular (3 Months)",
    code: "TF-REG-3M",
    tier: "STANDARD",
    category: "Regular",
    pricePKR: 52999,
    durationMonths: 3,
    monthlyEquivalentPKR: 17666,
    includesSummary: "Multi-Gym Access, Guest Passes, and Sauna & Steam",
    description: "3 Months Operating — Multi-Gym access across all clubs with guest passes and sauna & steam recovery.",
    includedFacilities: [
      "Multi-Gym Access (All Branches)",
      "Guest Passes Included",
      "Sauna & Steam Access",
      "Standard Locker Room",
      "Fitness Floor & Strength Rigs",
    ],
    discountPercent: 0,
    renewalGraceDays: 7,
    isActive: true,
  },
  {
    id: "plan-trifit-regular-6m",
    name: "TriFit Regular (6 Months)",
    code: "TF-REG-6M",
    tier: "STANDARD",
    category: "Regular",
    pricePKR: 84999,
    durationMonths: 6,
    monthlyEquivalentPKR: 14167,
    includesSummary: "Multi-Gym Access, Guest Passes, and Sauna & Steam",
    description: "6 Months Operating — Multi-Gym access across all clubs with guest passes and sauna & steam recovery.",
    includedFacilities: [
      "Multi-Gym Access (All Branches)",
      "Guest Passes Included",
      "Sauna & Steam Access",
      "Standard Locker Room",
      "Fitness Floor & Cardio Zone",
      "Mid-Term Fitness Checkup",
    ],
    discountPercent: 5,
    renewalGraceDays: 10,
    isActive: true,
  },
  {
    id: "plan-trifit-regular-12m",
    name: "TriFit Regular (12 Months)",
    code: "TF-REG-12M",
    tier: "PRO",
    category: "Regular",
    badge: "Most Popular / Best Value",
    pricePKR: 122999,
    durationMonths: 12,
    monthlyEquivalentPKR: 10250,
    includesSummary: "Multi-Gym Access, Guest Passes, and Sauna & Steam",
    description: "12 Months Operating (Most Popular / Best Value) — Full year multi-club access, guest passes, and sauna/steam.",
    includedFacilities: [
      "Multi-Gym Access (All Branches)",
      "Guest Passes Included",
      "Sauna & Steam Access",
      "Studio Group Classes Suite",
      "Standard Locker Room",
      "Bi-Annual InBody 3D Scan",
    ],
    discountPercent: 15,
    renewalGraceDays: 14,
    isActive: true,
  },

  // ─────────────────────────────────────────────────────────────
  // 👑 TriFit Plus Plans (3 Options)
  // Includes: All Regular Features, Personal Training, and Unlimited Guests
  // ─────────────────────────────────────────────────────────────
  {
    id: "plan-trifit-plus-3m",
    name: "TriFit Plus (3 Months)",
    code: "TF-PLUS-3M",
    tier: "VIP",
    category: "Plus",
    pricePKR: 65999,
    durationMonths: 3,
    monthlyEquivalentPKR: 22000,
    includesSummary: "All Regular Features, Personal Training, and Unlimited Guests",
    description: "3 Months Operating — All regular features plus 1-on-1 Personal Training and unlimited guest invites.",
    includedFacilities: [
      "All Regular Features Included",
      "Personal Training Sessions",
      "Unlimited Guest Privileges",
      "Multi-Gym Access (All Branches)",
      "Sauna & Steam Suite",
      "Executive VIP Locker Access",
    ],
    discountPercent: 0,
    renewalGraceDays: 7,
    isActive: true,
  },
  {
    id: "plan-trifit-plus-6m",
    name: "TriFit Plus (6 Months)",
    code: "TF-PLUS-6M",
    tier: "VIP",
    category: "Plus",
    pricePKR: 105999,
    durationMonths: 6,
    monthlyEquivalentPKR: 17667,
    includesSummary: "All Regular Features, Personal Training, and Unlimited Guests",
    description: "6 Months Operating — Complete plus membership with dedicated Personal Training and unlimited guests.",
    includedFacilities: [
      "All Regular Features Included",
      "Personal Training Sessions",
      "Unlimited Guest Privileges",
      "Multi-Gym Access (All Branches)",
      "Sauna & Steam Suite",
      "VIP Locker Suite",
      "Nutrition & Macro Consultation",
    ],
    discountPercent: 10,
    renewalGraceDays: 10,
    isActive: true,
  },
  {
    id: "plan-trifit-plus-12m",
    name: "TriFit Plus (12 Months)",
    code: "TF-PLUS-12M",
    tier: "VIP",
    category: "Plus",
    badge: "Best Value",
    pricePKR: 155999,
    durationMonths: 12,
    monthlyEquivalentPKR: 13000,
    includesSummary: "All Regular Features, Personal Training, and Unlimited Guests",
    description: "12 Months Operating (Best Value) — Ultimate VIP experience with Personal Training, unlimited guests, and private suite.",
    includedFacilities: [
      "All Regular Features Included",
      "Personal Training (Recurring Monthly)",
      "Unlimited Guest Privileges",
      "Multi-Gym Access (All Branches)",
      "Sauna & Steam Suite",
      "Private VIP Locker",
      "Monthly 3D Body Scan",
      "Complimentary Valet Parking",
    ],
    discountPercent: 20,
    renewalGraceDays: 14,
    isActive: true,
  },
];

// Generate 32 realistic members with complete relations
const SEED_MEMBERS: Member[] = [
  {
    id: "mem-01",
    memberCode: "TF-10201",
    name: "Zaid Khan",
    email: "zaid.khan@trifit.com",
    phone: "+92 300 2345671",
    cnic: "42101-1234567-1",
    gender: "Male",
    dob: "1994-06-15",
    address: "Bungalow 42, Khyaban-e-Shamsheer, DHA Phase 5, Karachi",
    emergencyContact: { name: "Imran Khan (Father)", relationship: "Father", phone: "+92 300 9876541" },
    branchId: "branch-seaview",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-tariq",
    status: "ACTIVE",
    joiningDate: "2023-02-10",
    startDate: "2024-01-01",
    expiryDate: "2024-12-31",
    fitnessGoal: "Strength & Muscle",
    fitnessLevel: "Advanced",
    studio: "Strength Forge",
    lockerNumber: "L-101",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 6,
    totalCheckins: 142,
    lastCheckin: "Today at 08:30 AM",
    lastCheckedOut: "Today at 10:15 AM",
    notes: "Focusing on 200kg deadlift target. Recovering from minor hamstring tightness.",
  },
  {
    id: "mem-02",
    memberCode: "TF-10202",
    name: "Ayesha Malik",
    email: "ayesha.malik@outlook.com",
    phone: "+92 300 2345672",
    cnic: "42101-1234567-2",
    gender: "Female",
    dob: "1996-09-22",
    address: "Apartment 7B, Creek Vistas, DHA Phase 8, Karachi",
    emergencyContact: { name: "Zehra Malik (Sister)", relationship: "Sister", phone: "+92 300 9876542" },
    branchId: "branch-seaview",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-alishba",
    status: "ACTIVE",
    joiningDate: "2023-04-18",
    startDate: "2024-01-15",
    expiryDate: "2025-01-15",
    fitnessGoal: "Fat Loss & Conditioning",
    fitnessLevel: "Intermediate",
    studio: "Cardio Loft",
    lockerNumber: "L-204",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 4,
    totalCheckins: 98,
    lastCheckin: "Today at 09:15 AM",
    lastCheckedOut: null,
    notes: "Consistently attending morning metabolic conditioning. Goal: 15% body fat reduction.",
  },
  {
    id: "mem-03",
    memberCode: "TF-10203",
    name: "Omer Sheikh",
    email: "omer.sheikh@techpk.io",
    phone: "+92 300 2345673",
    cnic: "42101-1234567-3",
    gender: "Male",
    dob: "1990-11-04",
    address: "House 12, Street 8, Bath Island, Clifton, Karachi",
    emergencyContact: { name: "Farida Sheikh (Wife)", relationship: "Spouse", phone: "+92 300 9876543" },
    branchId: "branch-clifton",
    planId: "plan-trifit-regular-12m",
    trainerId: "tr-bilal",
    status: "ACTIVE",
    joiningDate: "2023-06-01",
    startDate: "2023-06-01",
    expiryDate: "2024-11-20",
    fitnessGoal: "Strength & Muscle",
    fitnessLevel: "Intermediate",
    studio: "Strength Forge",
    lockerNumber: "C-014",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 5,
    totalCheckins: 110,
    lastCheckin: "Yesterday at 06:45 PM",
    lastCheckedOut: "Yesterday at 08:20 PM",
    notes: "Membership expiring in 12 days. Sent renewal reminder WhatsApp.",
  },
  {
    id: "mem-04",
    memberCode: "TF-10204",
    name: "Fatima Farooq",
    email: "fatima.f@gmail.com",
    phone: "+92 300 2345674",
    cnic: "42101-1234567-4",
    gender: "Female",
    dob: "1998-03-14",
    address: "Villa 88, Tipu Sultan Road, Karachi",
    emergencyContact: { name: "Dr. Farooq (Father)", relationship: "Father", phone: "+92 300 9876544" },
    branchId: "branch-clifton",
    planId: "plan-trifit-plus-3m",
    trainerId: "tr-zeeshan",
    status: "ACTIVE",
    joiningDate: "2023-08-12",
    startDate: "2024-02-01",
    expiryDate: "2024-12-01",
    fitnessGoal: "Rehabilitation & Mobility",
    fitnessLevel: "Beginner",
    studio: "Studio Alpha",
    lockerNumber: "C-082",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 2,
    totalCheckins: 45,
    lastCheckin: "Today at 10:00 AM",
    lastCheckedOut: "Today at 11:30 AM",
    notes: "Improving shoulder posture and lower back stability.",
  },
  {
    id: "mem-05",
    memberCode: "TF-10205",
    name: "Hamza Baig",
    email: "hamza.baig@luckymail.pk",
    phone: "+92 300 2345675",
    cnic: "42101-1234567-5",
    gender: "Male",
    dob: "1992-01-30",
    address: "Block 14, Gulshan-e-Iqbal, Karachi",
    emergencyContact: { name: "Sania Baig (Wife)", relationship: "Spouse", phone: "+92 300 9876545" },
    branchId: "branch-luckyone",
    planId: "plan-trifit-regular-3m",
    trainerId: "tr-hamza",
    status: "ACTIVE",
    joiningDate: "2023-09-05",
    startDate: "2024-03-01",
    expiryDate: "2024-11-28",
    fitnessGoal: "Endurance & Stamina",
    fitnessLevel: "Intermediate",
    studio: "Olympic Arena",
    lockerNumber: "L1-022",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 3,
    totalCheckins: 72,
    lastCheckin: "Today at 07:10 AM",
    lastCheckedOut: "Today at 08:35 AM",
    notes: "Preparing for Karachi Half Marathon in December.",
  },
  {
    id: "mem-06",
    memberCode: "TF-10206",
    name: "Zainab Abbasi",
    email: "zainab.abbasi@gmail.com",
    phone: "+92 300 2345676",
    cnic: "42101-1234567-6",
    gender: "Female",
    dob: "1995-07-19",
    address: "Block 7, Federal B Area, Karachi",
    emergencyContact: { name: "Tariq Abbasi (Brother)", relationship: "Brother", phone: "+92 300 9876546" },
    branchId: "branch-luckyone",
    planId: "plan-trifit-regular-6m",
    trainerId: "tr-sara",
    status: "ACTIVE",
    joiningDate: "2023-10-10",
    startDate: "2024-01-10",
    expiryDate: "2024-12-10",
    fitnessGoal: "Fat Loss & Conditioning",
    fitnessLevel: "Beginner",
    studio: "Studio Alpha",
    lockerNumber: "L1-094",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 3,
    totalCheckins: 58,
    lastCheckin: "Yesterday at 04:30 PM",
    lastCheckedOut: "Yesterday at 05:45 PM",
    notes: "Student member at IBA Karachi.",
  },
  {
    id: "mem-07",
    memberCode: "TF-10207",
    name: "Shahmir Raza",
    email: "shahmir.raza@islamabad.org",
    phone: "+92 300 2345677",
    cnic: "61101-1234567-1",
    gender: "Male",
    dob: "1988-12-08",
    address: "Sector F-7/2, Street 19, Islamabad",
    emergencyContact: { name: "Khadija Raza (Wife)", relationship: "Spouse", phone: "+92 300 9876547" },
    branchId: "branch-ajtower",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-danial",
    status: "ACTIVE",
    joiningDate: "2023-03-25",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Athletic Performance",
    fitnessLevel: "Advanced",
    studio: "Strength Forge",
    lockerNumber: "AJ-001",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 8,
    totalCheckins: 168,
    lastCheckin: "Today at 06:15 AM",
    lastCheckedOut: "Today at 08:00 AM",
    notes: "Corporate executive. Consistent 6 AM powerlifting lifter.",
  },
  {
    id: "mem-08",
    memberCode: "TF-10208",
    name: "Dr. Mahnoor Tareen",
    email: "dr.mahnoor@shifa.org",
    phone: "+92 300 2345678",
    cnic: "61101-1234567-2",
    gender: "Female",
    dob: "1991-04-12",
    address: "Gulberg Greens, Executive Enclave, Islamabad",
    emergencyContact: { name: "Dr. Tareen (Father)", relationship: "Father", phone: "+92 300 9876548" },
    branchId: "branch-ajtower",
    planId: "plan-trifit-regular-12m",
    trainerId: "tr-maryam",
    status: "ACTIVE",
    joiningDate: "2023-05-30",
    startDate: "2024-02-15",
    expiryDate: "2025-02-15",
    fitnessGoal: "Rehabilitation & Mobility",
    fitnessLevel: "Intermediate",
    studio: "Cardio Loft",
    lockerNumber: "AJ-055",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 4,
    totalCheckins: 88,
    lastCheckin: "Yesterday at 07:00 PM",
    lastCheckedOut: "Yesterday at 08:15 PM",
    notes: "Surgeon focusing on core balance and posture endurance.",
  },
  {
    id: "mem-09",
    memberCode: "TF-10209",
    name: "Bilal Zubairi",
    email: "b.zubairi@gmail.com",
    phone: "+92 300 2345679",
    cnic: "42101-1234567-7",
    gender: "Male",
    dob: "1985-05-18",
    address: "DHA Phase 2 Ext, Karachi",
    emergencyContact: { name: "Rabia Zubairi (Wife)", relationship: "Spouse", phone: "+92 300 9876549" },
    branchId: "branch-seaview",
    planId: "plan-trifit-regular-3m",
    trainerId: "tr-tariq",
    status: "EXPIRED",
    joiningDate: "2023-01-10",
    startDate: "2024-09-01",
    expiryDate: "2024-10-01",
    fitnessGoal: "Fat Loss & Conditioning",
    fitnessLevel: "Beginner",
    studio: "Cardio Loft",
    lockerNumber: "L-301",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 2,
    totalCheckins: 34,
    lastCheckin: "22 days ago",
    lastCheckedOut: "22 days ago",
    notes: "Subscription expired. Marked for Apollo Win-back campaign.",
  },
  {
    id: "mem-10",
    memberCode: "TF-10210",
    name: "Sania Mirza Khan",
    email: "sania.mirza@hotmail.com",
    phone: "+92 300 2345680",
    cnic: "42101-1234567-8",
    gender: "Female",
    dob: "1997-08-25",
    address: "Block 2, Clifton, Karachi",
    emergencyContact: { name: "Mrs. Mirza (Mother)", relationship: "Mother", phone: "+92 300 9876550" },
    branchId: "branch-clifton",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-zeeshan",
    status: "SUSPENDED",
    joiningDate: "2023-07-20",
    startDate: "2024-03-01",
    expiryDate: "2024-12-31",
    fitnessGoal: "Athletic Performance",
    fitnessLevel: "Advanced",
    studio: "Olympic Arena",
    lockerNumber: "C-112",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 5,
    totalCheckins: 85,
    lastCheckin: "15 days ago",
    lastCheckedOut: "15 days ago",
    notes: "Frozen for 30 days due to knee arthroscopy. Expected return Dec 1.",
  },
  // Members 11 to 32 generated with complete realistic data
  {
    id: "mem-11",
    memberCode: "TF-10211",
    name: "Danyal Vohra",
    email: "danyal.v@vohragroup.com",
    phone: "+92 300 2345681",
    cnic: "42101-1234567-9",
    gender: "Male",
    dob: "1987-02-14",
    address: "DHA Phase 6, Karachi",
    emergencyContact: { name: "Ahmed Vohra (Brother)", relationship: "Brother", phone: "+92 300 9876551" },
    branchId: "branch-seaview",
    planId: "plan-trifit-regular-12m",
    trainerId: "tr-tariq",
    status: "ACTIVE",
    joiningDate: "2023-03-01",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Strength & Muscle",
    fitnessLevel: "Intermediate",
    studio: "Strength Forge",
    lockerNumber: "L-045",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 4,
    totalCheckins: 114,
    lastCheckin: "Today at 07:45 AM",
    lastCheckedOut: "Today at 09:10 AM",
  },
  {
    id: "mem-12",
    memberCode: "TF-10212",
    name: "Hira Mansoor",
    email: "hira.m@gmail.com",
    phone: "+92 300 2345682",
    cnic: "42101-1234568-0",
    gender: "Female",
    dob: "1993-10-11",
    address: "Khyaban-e-Muhafiz, DHA Phase 6, Karachi",
    emergencyContact: { name: "Mansoor Ali (Spouse)", relationship: "Spouse", phone: "+92 300 9876552" },
    branchId: "branch-seaview",
    planId: "plan-trifit-plus-3m",
    trainerId: "tr-alishba",
    status: "ACTIVE",
    joiningDate: "2023-04-10",
    startDate: "2024-02-01",
    expiryDate: "2025-02-01",
    fitnessGoal: "Fat Loss & Conditioning",
    fitnessLevel: "Intermediate",
    studio: "Studio Alpha",
    lockerNumber: "L-198",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 3,
    totalCheckins: 79,
    lastCheckin: "Today at 09:30 AM",
    lastCheckedOut: "Today at 10:45 AM",
  },
  {
    id: "mem-13",
    memberCode: "TF-10213",
    name: "Arsalan Khawaja",
    email: "arsalan.k@khawaja.com",
    phone: "+92 300 2345683",
    cnic: "42101-1234568-1",
    gender: "Male",
    dob: "1991-03-29",
    address: "Old Clifton, Karachi",
    emergencyContact: { name: "Sadia Khawaja (Wife)", relationship: "Spouse", phone: "+92 300 9876553" },
    branchId: "branch-clifton",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-bilal",
    status: "ACTIVE",
    joiningDate: "2023-05-15",
    startDate: "2024-01-15",
    expiryDate: "2025-01-15",
    fitnessGoal: "Strength & Muscle",
    fitnessLevel: "Advanced",
    studio: "Strength Forge",
    lockerNumber: "C-005",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 6,
    totalCheckins: 130,
    lastCheckin: "Yesterday at 05:30 PM",
    lastCheckedOut: "Yesterday at 07:00 PM",
  },
  {
    id: "mem-14",
    memberCode: "TF-10214",
    name: "Natasha Pirzada",
    email: "natasha.p@artdesign.pk",
    phone: "+92 300 2345684",
    cnic: "42101-1234568-2",
    gender: "Female",
    dob: "1994-12-05",
    address: "Block 4, Clifton, Karachi",
    emergencyContact: { name: "Asim Pirzada (Brother)", relationship: "Brother", phone: "+92 300 9876554" },
    branchId: "branch-clifton",
    planId: "plan-trifit-regular-3m",
    trainerId: null,
    status: "ACTIVE",
    joiningDate: "2023-08-01",
    startDate: "2024-04-01",
    expiryDate: "2024-12-01",
    fitnessGoal: "Endurance & Stamina",
    fitnessLevel: "Beginner",
    studio: "Cardio Loft",
    lockerNumber: "C-099",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 2,
    totalCheckins: 41,
    lastCheckin: "3 days ago",
    lastCheckedOut: "3 days ago",
  },
  {
    id: "mem-15",
    memberCode: "TF-10215",
    name: "Mustafa Jilani",
    email: "mustafa.j@jilani.pk",
    phone: "+92 300 2345685",
    cnic: "42101-1234568-3",
    gender: "Male",
    dob: "1996-07-07",
    address: "Gulshan-e-Iqbal Block 6, Karachi",
    emergencyContact: { name: "Rashid Jilani (Father)", relationship: "Father", phone: "+92 300 9876555" },
    branchId: "branch-luckyone",
    planId: "plan-trifit-regular-12m",
    trainerId: "tr-hamza",
    status: "ACTIVE",
    joiningDate: "2023-06-20",
    startDate: "2023-06-20",
    expiryDate: "2024-12-20",
    fitnessGoal: "Endurance & Stamina",
    fitnessLevel: "Intermediate",
    studio: "Olympic Arena",
    lockerNumber: "L1-034",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 4,
    totalCheckins: 89,
    lastCheckin: "Today at 08:00 AM",
    lastCheckedOut: "Today at 09:15 AM",
  },
  {
    id: "mem-16",
    memberCode: "TF-10216",
    name: "Rameen Tariq",
    email: "rameen.t@gmail.com",
    phone: "+92 300 2345686",
    cnic: "42101-1234568-4",
    gender: "Female",
    dob: "1999-04-18",
    address: "Federal B Area Block 12, Karachi",
    emergencyContact: { name: "Tariq Aziz (Father)", relationship: "Father", phone: "+92 300 9876556" },
    branchId: "branch-luckyone",
    planId: "plan-trifit-regular-6m",
    trainerId: "tr-sara",
    status: "ACTIVE",
    joiningDate: "2023-09-15",
    startDate: "2024-02-01",
    expiryDate: "2024-12-01",
    fitnessGoal: "Rehabilitation & Mobility",
    fitnessLevel: "Beginner",
    studio: "Studio Alpha",
    lockerNumber: "L1-102",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 2,
    totalCheckins: 52,
    lastCheckin: "Yesterday at 03:00 PM",
    lastCheckedOut: "Yesterday at 04:15 PM",
  },
  {
    id: "mem-17",
    memberCode: "TF-10217",
    name: "Usman Ghani",
    email: "usman.ghani@gov.pk",
    phone: "+92 300 2345687",
    cnic: "61101-1234568-5",
    gender: "Male",
    dob: "1983-08-14",
    address: "Sector G-6/3, Islamabad",
    emergencyContact: { name: "Samina Ghani (Wife)", relationship: "Spouse", phone: "+92 300 9876557" },
    branchId: "branch-ajtower",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-danial",
    status: "ACTIVE",
    joiningDate: "2023-02-15",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Strength & Muscle",
    fitnessLevel: "Advanced",
    studio: "Strength Forge",
    lockerNumber: "AJ-012",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 7,
    totalCheckins: 155,
    lastCheckin: "Today at 06:30 AM",
    lastCheckedOut: "Today at 07:45 AM",
  },
  {
    id: "mem-18",
    memberCode: "TF-10218",
    name: "Zoya Qureshi",
    email: "zoya.q@isbcorp.com",
    phone: "+92 300 2345688",
    cnic: "61101-1234568-6",
    gender: "Female",
    dob: "1992-06-30",
    address: "Gulberg Greens Block D, Islamabad",
    emergencyContact: { name: "Adeel Qureshi (Husband)", relationship: "Spouse", phone: "+92 300 9876558" },
    branchId: "branch-ajtower",
    planId: "plan-trifit-regular-12m",
    trainerId: "tr-maryam",
    status: "ACTIVE",
    joiningDate: "2023-05-10",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Rehabilitation & Mobility",
    fitnessLevel: "Intermediate",
    studio: "Studio Alpha",
    lockerNumber: "AJ-077",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 3,
    totalCheckins: 67,
    lastCheckin: "Yesterday at 06:15 PM",
    lastCheckedOut: "Yesterday at 07:30 PM",
  },
  {
    id: "mem-19",
    memberCode: "TF-10219",
    name: "Adeel Chohan",
    email: "adeel.chohan@gmail.com",
    phone: "+92 300 2345689",
    cnic: "42101-1234568-7",
    gender: "Male",
    dob: "1989-11-20",
    address: "Khayaban-e-Bukhari, DHA Phase 6, Karachi",
    emergencyContact: { name: "Nazia Chohan (Wife)", relationship: "Spouse", phone: "+92 300 9876559" },
    branchId: "branch-seaview",
    planId: "plan-trifit-regular-3m",
    trainerId: null,
    status: "PENDING",
    joiningDate: "2024-11-01",
    startDate: "2024-11-01",
    expiryDate: "2024-12-01",
    fitnessGoal: "Fat Loss & Conditioning",
    fitnessLevel: "Beginner",
    studio: "Cardio Loft",
    lockerNumber: "L-220",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 1,
    totalCheckins: 2,
    lastCheckin: "Yesterday at 11:00 AM",
    lastCheckedOut: "Yesterday at 12:15 PM",
  },
  {
    id: "mem-20",
    memberCode: "TF-10220",
    name: "Sarah Siddiqui",
    email: "sarah.s@fashionpk.com",
    phone: "+92 300 2345690",
    cnic: "42101-1234568-8",
    gender: "Female",
    dob: "1995-02-17",
    address: "Block 5, Clifton, Karachi",
    emergencyContact: { name: "Omar Siddiqui (Father)", relationship: "Father", phone: "+92 300 9876560" },
    branchId: "branch-clifton",
    planId: "plan-trifit-plus-3m",
    trainerId: "tr-zeeshan",
    status: "ACTIVE",
    joiningDate: "2023-11-10",
    startDate: "2024-03-01",
    expiryDate: "2025-03-01",
    fitnessGoal: "Fat Loss & Conditioning",
    fitnessLevel: "Intermediate",
    studio: "Studio Alpha",
    lockerNumber: "C-063",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 4,
    totalCheckins: 74,
    lastCheckin: "Today at 10:15 AM",
    lastCheckedOut: "Today at 11:30 AM",
  },
  {
    id: "mem-21",
    memberCode: "TF-10221",
    name: "Waleed Anis",
    email: "waleed.anis@anisgroup.pk",
    phone: "+92 300 2345691",
    cnic: "42101-1234568-9",
    gender: "Male",
    dob: "1993-05-04",
    address: "KDA Scheme 1, Karachi",
    emergencyContact: { name: "Anis Ahmed (Father)", relationship: "Father", phone: "+92 300 9876561" },
    branchId: "branch-luckyone",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-hamza",
    status: "ACTIVE",
    joiningDate: "2023-07-01",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Strength & Muscle",
    fitnessLevel: "Advanced",
    studio: "Olympic Arena",
    lockerNumber: "L1-011",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 5,
    totalCheckins: 118,
    lastCheckin: "Today at 08:45 AM",
    lastCheckedOut: "Today at 10:00 AM",
  },
  {
    id: "mem-22",
    memberCode: "TF-10222",
    name: "Amber Haroon",
    email: "amber.h@mediaisb.com",
    phone: "+92 300 2345692",
    cnic: "61101-1234568-0",
    gender: "Female",
    dob: "1990-09-09",
    address: "Sector E-7, Islamabad",
    emergencyContact: { name: "Haroon Rashid (Father)", relationship: "Father", phone: "+92 300 9876562" },
    branchId: "branch-ajtower",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-maryam",
    status: "ACTIVE",
    joiningDate: "2023-04-05",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Rehabilitation & Mobility",
    fitnessLevel: "Intermediate",
    studio: "Studio Alpha",
    lockerNumber: "AJ-024",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 6,
    totalCheckins: 104,
    lastCheckin: "Yesterday at 05:00 PM",
    lastCheckedOut: "Yesterday at 06:15 PM",
  },
  {
    id: "mem-23",
    memberCode: "TF-10223",
    name: "Fahad Mustafa Alvi",
    email: "fahad.alvi@alvis.pk",
    phone: "+92 300 2345693",
    cnic: "42101-1234569-1",
    gender: "Male",
    dob: "1986-12-19",
    address: "DHA Phase 5, Karachi",
    emergencyContact: { name: "Sadia Alvi (Wife)", relationship: "Spouse", phone: "+92 300 9876563" },
    branchId: "branch-seaview",
    planId: "plan-trifit-plus-6m",
    trainerId: "tr-tariq",
    status: "ACTIVE",
    joiningDate: "2024-02-15",
    startDate: "2024-03-01",
    expiryDate: "2024-12-31",
    fitnessGoal: "Strength & Muscle",
    fitnessLevel: "Intermediate",
    studio: "Strength Forge",
    lockerNumber: "L-088",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 3,
    totalCheckins: 62,
    lastCheckin: "Today at 09:00 AM",
    lastCheckedOut: "Today at 10:15 AM",
  },
  {
    id: "mem-24",
    memberCode: "TF-10224",
    name: "Komal Naqvi",
    email: "komal.naqvi@lawfirm.com",
    phone: "+92 300 2345694",
    cnic: "42101-1234569-2",
    gender: "Female",
    dob: "1994-01-28",
    address: "Block 8, Clifton, Karachi",
    emergencyContact: { name: "Ali Naqvi (Brother)", relationship: "Brother", phone: "+92 300 9876564" },
    branchId: "branch-clifton",
    planId: "plan-trifit-regular-12m",
    trainerId: "tr-bilal",
    status: "ACTIVE",
    joiningDate: "2023-09-01",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Fat Loss & Conditioning",
    fitnessLevel: "Intermediate",
    studio: "Cardio Loft",
    lockerNumber: "C-042",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 4,
    totalCheckins: 81,
    lastCheckin: "Today at 08:15 AM",
    lastCheckedOut: "Today at 09:30 AM",
  },
  {
    id: "mem-25",
    memberCode: "TF-10225",
    name: "Taimur Hassan",
    email: "taimur.hassan@financepk.com",
    phone: "+92 300 2345695",
    cnic: "42101-1234569-3",
    gender: "Male",
    dob: "1992-07-14",
    address: "Dhoraji Colony, Karachi",
    emergencyContact: { name: "Farah Hassan (Wife)", relationship: "Spouse", phone: "+92 300 9876565" },
    branchId: "branch-luckyone",
    planId: "plan-trifit-regular-3m",
    trainerId: "tr-sara",
    status: "INACTIVE",
    joiningDate: "2023-08-10",
    startDate: "2024-05-01",
    expiryDate: "2024-10-15",
    fitnessGoal: "Endurance & Stamina",
    fitnessLevel: "Beginner",
    studio: "Olympic Arena",
    lockerNumber: "L1-067",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 1,
    totalCheckins: 19,
    lastCheckin: "25 days ago",
    lastCheckedOut: "25 days ago",
  },
  {
    id: "mem-26",
    memberCode: "TF-10226",
    name: "Sohail Afzal",
    email: "sohail.afzal@islamabadclub.pk",
    phone: "+92 300 2345696",
    cnic: "61101-1234569-4",
    gender: "Male",
    dob: "1980-03-03",
    address: "Gulberg Greens Sector B, Islamabad",
    emergencyContact: { name: "Afzal Khan (Father)", relationship: "Father", phone: "+92 300 9876566" },
    branchId: "branch-ajtower",
    planId: "plan-trifit-regular-12m",
    trainerId: "tr-danial",
    status: "ACTIVE",
    joiningDate: "2023-01-20",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Strength & Muscle",
    fitnessLevel: "Advanced",
    studio: "Strength Forge",
    lockerNumber: "AJ-009",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 9,
    totalCheckins: 182,
    lastCheckin: "Today at 07:15 AM",
    lastCheckedOut: "Today at 08:30 AM",
  },
  {
    id: "mem-27",
    memberCode: "TF-10227",
    name: "Aima Baig Mirza",
    email: "aima.mirza@artistpk.com",
    phone: "+92 300 2345697",
    cnic: "42101-1234569-5",
    gender: "Female",
    dob: "1997-11-15",
    address: "DHA Phase 8, Karachi",
    emergencyContact: { name: "Raza Mirza (Brother)", relationship: "Brother", phone: "+92 300 9876567" },
    branchId: "branch-seaview",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-alishba",
    status: "ACTIVE",
    joiningDate: "2023-05-18",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Fat Loss & Conditioning",
    fitnessLevel: "Intermediate",
    studio: "Cardio Loft",
    lockerNumber: "L-018",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 5,
    totalCheckins: 109,
    lastCheckin: "Today at 09:45 AM",
    lastCheckedOut: null,
  },
  {
    id: "mem-28",
    memberCode: "TF-10228",
    name: "Shahzad Roy Niazi",
    email: "shahzad.niazi@niazicorp.com",
    phone: "+92 300 2345698",
    cnic: "42101-1234569-6",
    gender: "Male",
    dob: "1988-04-24",
    address: "Clifton Block 2, Karachi",
    emergencyContact: { name: "Niazi Begum (Mother)", relationship: "Mother", phone: "+92 300 9876568" },
    branchId: "branch-clifton",
    planId: "plan-trifit-regular-3m",
    trainerId: "tr-zeeshan",
    status: "ACTIVE",
    joiningDate: "2023-10-01",
    startDate: "2024-02-01",
    expiryDate: "2024-12-01",
    fitnessGoal: "Athletic Performance",
    fitnessLevel: "Advanced",
    studio: "Strength Forge",
    lockerNumber: "C-071",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 4,
    totalCheckins: 93,
    lastCheckin: "Yesterday at 06:00 PM",
    lastCheckedOut: "Yesterday at 07:30 PM",
  },
  {
    id: "mem-29",
    memberCode: "TF-10229",
    name: "Mehwish Hayat Abbasi",
    email: "mehwish.abbasi@gmail.com",
    phone: "+92 300 2345699",
    cnic: "42101-1234569-7",
    gender: "Female",
    dob: "1994-08-08",
    address: "Gulshan Block 13D, Karachi",
    emergencyContact: { name: "Hayat Khan (Father)", relationship: "Father", phone: "+92 300 9876569" },
    branchId: "branch-luckyone",
    planId: "plan-trifit-plus-3m",
    trainerId: "tr-sara",
    status: "ACTIVE",
    joiningDate: "2023-11-20",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Rehabilitation & Mobility",
    fitnessLevel: "Intermediate",
    studio: "Studio Alpha",
    lockerNumber: "L1-081",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 3,
    totalCheckins: 70,
    lastCheckin: "Today at 10:30 AM",
    lastCheckedOut: "Today at 11:45 AM",
  },
  {
    id: "mem-30",
    memberCode: "TF-10230",
    name: "Babar Azam Qidwai",
    email: "babar.qidwai@cricketclub.pk",
    phone: "+92 300 2345700",
    cnic: "61101-1234569-8",
    gender: "Male",
    dob: "1995-10-15",
    address: "Sector F-10/4, Islamabad",
    emergencyContact: { name: "Azam Qidwai (Father)", relationship: "Father", phone: "+92 300 9876570" },
    branchId: "branch-ajtower",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-danial",
    status: "ACTIVE",
    joiningDate: "2023-06-14",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Athletic Performance",
    fitnessLevel: "Elite Athlete",
    studio: "Olympic Arena",
    lockerNumber: "AJ-004",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 7,
    totalCheckins: 147,
    lastCheckin: "Today at 06:45 AM",
    lastCheckedOut: "Today at 08:15 AM",
  },
  {
    id: "mem-31",
    memberCode: "TF-10231",
    name: "Farhan Saeed Jaffri",
    email: "farhan.jaffri@musicpk.com",
    phone: "+92 300 2345701",
    cnic: "42101-1234569-9",
    gender: "Male",
    dob: "1991-09-14",
    address: "Khyaban-e-Hilal, DHA Phase 6, Karachi",
    emergencyContact: { name: "Saeed Jaffri (Father)", relationship: "Father", phone: "+92 300 9876571" },
    branchId: "branch-seaview",
    planId: "plan-trifit-regular-12m",
    trainerId: "tr-tariq",
    status: "ACTIVE",
    joiningDate: "2023-04-01",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Endurance & Stamina",
    fitnessLevel: "Intermediate",
    studio: "Cardio Loft",
    lockerNumber: "L-064",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 4,
    totalCheckins: 102,
    lastCheckin: "Yesterday at 07:15 PM",
    lastCheckedOut: "Yesterday at 08:30 PM",
  },
  {
    id: "mem-32",
    memberCode: "TF-10232",
    name: "Urwa Hocane Rizvi",
    email: "urwa.rizvi@producers.pk",
    phone: "+92 300 2345702",
    cnic: "42101-1234570-0",
    gender: "Female",
    dob: "1993-07-02",
    address: "Clifton Marine Drive, Karachi",
    emergencyContact: { name: "Mawra Rizvi (Sister)", relationship: "Sister", phone: "+92 300 9876572" },
    branchId: "branch-clifton",
    planId: "plan-trifit-plus-12m",
    trainerId: "tr-bilal",
    status: "ACTIVE",
    joiningDate: "2023-07-15",
    startDate: "2024-01-01",
    expiryDate: "2025-01-01",
    fitnessGoal: "Fat Loss & Conditioning",
    fitnessLevel: "Intermediate",
    studio: "Studio Alpha",
    lockerNumber: "C-019",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bioScanCount: 5,
    totalCheckins: 112,
    lastCheckin: "Today at 10:45 AM",
    lastCheckedOut: null,
  },
];

const SEED_PAYMENTS: PaymentTransaction[] = [
  { id: "pay-101", invoiceNo: "INV-2024-0891", memberId: "mem-01", memberName: "Zaid Khan", branchId: "branch-seaview", planName: "Black Diamond VIP All-Access", amountPKR: 35000, paymentMethod: "IBFT_BANK", status: "COMPLETED", timestamp: "2024-11-01 10:14 AM", bankReference: "HBL-TRX-99812", notes: "Annual renewal first month installment" },
  { id: "pay-102", invoiceNo: "INV-2024-0892", memberId: "mem-02", memberName: "Ayesha Malik", branchId: "branch-seaview", planName: "Black Diamond VIP All-Access", amountPKR: 35000, paymentMethod: "CREDIT_CARD", status: "COMPLETED", timestamp: "2024-11-02 04:30 PM", bankReference: "MCB-CC-4412", notes: "Monthly recurring credit card auto-charge" },
  { id: "pay-103", invoiceNo: "INV-2024-0893", memberId: "mem-03", memberName: "Omer Sheikh", branchId: "branch-clifton", planName: "Platinum Pro Annual", amountPKR: 240000, paymentMethod: "IBFT_BANK", status: "COMPLETED", timestamp: "2024-10-15 01:20 PM", bankReference: "MEEZAN-9921", notes: "12-month advance platinum VIP pass" },
  { id: "pay-104", invoiceNo: "INV-2024-0894", memberId: "mem-04", memberName: "Fatima Farooq", branchId: "branch-clifton", planName: "Ladies Morning Exclusive", amountPKR: 16000, paymentMethod: "JAZZCASH_EASYPAISA", status: "COMPLETED", timestamp: "2024-11-03 11:05 AM", bankReference: "JC-881928", notes: "Ladies morning package with reformer pilates" },
  { id: "pay-105", invoiceNo: "INV-2024-0895", memberId: "mem-05", memberName: "Hamza Baig", branchId: "branch-luckyone", planName: "Prime Executive Monthly", amountPKR: 22000, paymentMethod: "CASH", status: "COMPLETED", timestamp: "2024-11-04 06:15 PM", notes: "Cash paid at front desk counter" },
  { id: "pay-106", invoiceNo: "INV-2024-0896", memberId: "mem-07", memberName: "Shahmir Raza", branchId: "branch-ajtower", planName: "Black Diamond VIP All-Access", amountPKR: 35000, paymentMethod: "IBFT_BANK", status: "COMPLETED", timestamp: "2024-11-01 09:00 AM", bankReference: "SCB-88319", notes: "Corporate package bank wire transfer" },
  { id: "pay-107", invoiceNo: "INV-2024-0897", memberId: "mem-08", memberName: "Dr. Mahnoor Tareen", branchId: "branch-ajtower", planName: "Platinum Pro Annual", amountPKR: 240000, paymentMethod: "CREDIT_CARD", status: "COMPLETED", timestamp: "2024-10-20 03:40 PM", bankReference: "UBL-CC-9901" },
  { id: "pay-108", invoiceNo: "INV-2024-0898", memberId: "mem-09", memberName: "Bilal Zubairi", branchId: "branch-seaview", planName: "Prime Executive Monthly", amountPKR: 22000, paymentMethod: "IBFT_BANK", status: "FAILED", timestamp: "2024-10-02 02:15 PM", notes: "Bank transaction bounced - NSF" },
  { id: "pay-109", invoiceNo: "INV-2024-0899", memberId: "mem-10", memberName: "Sania Mirza Khan", branchId: "branch-clifton", planName: "Black Diamond VIP All-Access", amountPKR: 35000, paymentMethod: "CREDIT_CARD", status: "REFUNDED", timestamp: "2024-10-25 11:30 AM", notes: "Prorated refund approved due to verified medical surgery" },
  { id: "pay-110", invoiceNo: "INV-2024-0900", memberId: "mem-13", memberName: "Arsalan Khawaja", branchId: "branch-clifton", planName: "Black Diamond VIP All-Access", amountPKR: 35000, paymentMethod: "IBFT_BANK", status: "COMPLETED", timestamp: "2024-11-05 10:45 AM", bankReference: "BAFL-11029" },
  { id: "pay-111", invoiceNo: "INV-2024-0901", memberId: "mem-17", memberName: "Usman Ghani", branchId: "branch-ajtower", planName: "Black Diamond VIP All-Access", amountPKR: 35000, paymentMethod: "IBFT_BANK", status: "COMPLETED", timestamp: "2024-11-05 08:30 AM", bankReference: "NBP-44910" },
  { id: "pay-112", invoiceNo: "INV-2024-0902", memberId: "mem-21", memberName: "Waleed Anis", branchId: "branch-luckyone", planName: "Black Diamond VIP All-Access", amountPKR: 35000, paymentMethod: "CREDIT_CARD", status: "COMPLETED", timestamp: "2024-11-06 02:10 PM", bankReference: "HBL-CC-7719" },
];

const SEED_ATTENDANCE: AttendanceRecord[] = [
  { id: "att-01", memberId: "mem-01", memberName: "Zaid Khan", memberCode: "TF-10201", branchId: "branch-seaview", branchName: "TriFit Seaview DHA — Karachi", checkInTime: "Today at 08:30 AM", checkOutTime: "Today at 10:15 AM", method: "TURNSTILE_FACE", gateName: "Turnstile Gate Alpha" },
  { id: "att-02", memberId: "mem-02", memberName: "Ayesha Malik", memberCode: "TF-10202", branchId: "branch-seaview", branchName: "TriFit Seaview DHA — Karachi", checkInTime: "Today at 09:15 AM", checkOutTime: null, method: "QR_CODE", gateName: "Turnstile Gate Bravo" },
  { id: "att-03", memberId: "mem-04", memberName: "Fatima Farooq", memberCode: "TF-10204", branchId: "branch-clifton", branchName: "TriFit Clifton — Karachi", checkInTime: "Today at 10:00 AM", checkOutTime: "Today at 11:30 AM", method: "MANUAL_DESK", gateName: "Front Desk Reception" },
  { id: "att-04", memberId: "mem-05", memberName: "Hamza Baig", memberCode: "TF-10205", branchId: "branch-luckyone", branchName: "TriFit LuckyOne Mall — Karachi", checkInTime: "Today at 07:10 AM", checkOutTime: "Today at 08:35 AM", method: "TURNSTILE_FACE", gateName: "Gate 1 Main Entry" },
  { id: "att-05", memberId: "mem-07", memberName: "Shahmir Raza", memberCode: "TF-10207", branchId: "branch-ajtower", branchName: "TriFit AJ Tower — Gulberg Greens, Islamabad", checkInTime: "Today at 06:15 AM", checkOutTime: "Today at 08:00 AM", method: "TURNSTILE_FACE", gateName: "Executive Gate 01" },
  { id: "att-06", memberId: "mem-11", memberName: "Danyal Vohra", memberCode: "TF-10211", branchId: "branch-seaview", branchName: "TriFit Seaview DHA — Karachi", checkInTime: "Today at 07:45 AM", checkOutTime: "Today at 09:10 AM", method: "QR_CODE", gateName: "Turnstile Gate Alpha" },
  { id: "att-07", memberId: "mem-12", memberName: "Hira Mansoor", memberCode: "TF-10212", branchId: "branch-seaview", branchName: "TriFit Seaview DHA — Karachi", checkInTime: "Today at 09:30 AM", checkOutTime: "Today at 10:45 AM", method: "TURNSTILE_FACE", gateName: "Ladies Studio Gate" },
  { id: "att-08", memberId: "mem-15", memberName: "Mustafa Jilani", memberCode: "TF-10215", branchId: "branch-luckyone", branchName: "TriFit LuckyOne Mall — Karachi", checkInTime: "Today at 08:00 AM", checkOutTime: "Today at 09:15 AM", method: "TURNSTILE_FACE", gateName: "Gate 2 Mall Entry" },
  { id: "att-09", memberId: "mem-17", memberName: "Usman Ghani", memberCode: "TF-10217", branchId: "branch-ajtower", branchName: "TriFit AJ Tower — Gulberg Greens, Islamabad", checkInTime: "Today at 06:30 AM", checkOutTime: "Today at 07:45 AM", method: "TURNSTILE_FACE", gateName: "Executive Gate 02" },
  { id: "att-10", memberId: "mem-21", memberName: "Waleed Anis", memberCode: "TF-10221", branchId: "branch-luckyone", branchName: "TriFit LuckyOne Mall — Karachi", checkInTime: "Today at 08:45 AM", checkOutTime: "Today at 10:00 AM", method: "QR_CODE", gateName: "Gate 1 Main Entry" },
  { id: "att-11", memberId: "mem-23", memberName: "Fahad Mustafa Alvi", memberCode: "TF-10223", branchId: "branch-seaview", branchName: "TriFit Seaview DHA — Karachi", checkInTime: "Today at 09:00 AM", checkOutTime: "Today at 10:15 AM", method: "TURNSTILE_FACE", gateName: "Turnstile Gate Alpha" },
  { id: "att-12", memberId: "mem-24", memberName: "Komal Naqvi", memberCode: "TF-10224", branchId: "branch-clifton", branchName: "TriFit Clifton — Karachi", checkInTime: "Today at 08:15 AM", checkOutTime: "Today at 09:30 AM", method: "TURNSTILE_FACE", gateName: "Main Turnstile" },
  { id: "att-13", memberId: "mem-26", memberName: "Sohail Afzal", memberCode: "TF-10226", branchId: "branch-ajtower", branchName: "TriFit AJ Tower — Gulberg Greens, Islamabad", checkInTime: "Today at 07:15 AM", checkOutTime: "Today at 08:30 AM", method: "TURNSTILE_FACE", gateName: "Executive Gate 01" },
  { id: "att-14", memberId: "mem-27", memberName: "Aima Baig Mirza", memberCode: "TF-10227", branchId: "branch-seaview", branchName: "TriFit Seaview DHA — Karachi", checkInTime: "Today at 09:45 AM", checkOutTime: null, method: "QR_CODE", gateName: "Turnstile Gate Bravo" },
  { id: "att-15", memberId: "mem-30", memberName: "Babar Azam Qidwai", memberCode: "TF-10230", branchId: "branch-ajtower", branchName: "TriFit AJ Tower — Gulberg Greens, Islamabad", checkInTime: "Today at 06:45 AM", checkOutTime: "Today at 08:15 AM", method: "TURNSTILE_FACE", gateName: "Executive Gate 02" },
  { id: "att-16", memberId: "mem-32", memberName: "Urwa Hocane Rizvi", memberCode: "TF-10232", branchId: "branch-clifton", branchName: "TriFit Clifton — Karachi", checkInTime: "Today at 10:45 AM", checkOutTime: null, method: "QR_CODE", gateName: "Main Turnstile" },
];

const SEED_CLASSES: GymClass[] = [
  { id: "cls-1", name: "HIIT Arena 360", studio: "Studio Alpha", branchId: "branch-seaview", trainerId: "tr-alishba", trainerName: "Coach Alishba Noor", startTime: "07:00 AM", endTime: "08:00 AM", daysOfWeek: ["Mon", "Wed", "Fri"], capacity: 25, bookedCount: 22, category: "HIIT", status: "SCHEDULED" },
  { id: "cls-2", name: "Les Mills RPM Spin", studio: "Cardio Loft", branchId: "branch-seaview", trainerId: "tr-tariq", trainerName: "Coach Tariq Mahmood", startTime: "08:30 AM", endTime: "09:15 AM", daysOfWeek: ["Tue", "Thu", "Sat"], capacity: 30, bookedCount: 28, category: "Spin & RPM", status: "SCHEDULED" },
  { id: "cls-3", name: "Vinyasa Flow & Breath", studio: "Studio Alpha", branchId: "branch-clifton", trainerId: "tr-zeeshan", trainerName: "Coach Zeeshan Qureshi", startTime: "09:30 AM", endTime: "10:30 AM", daysOfWeek: ["Mon", "Wed", "Fri"], capacity: 20, bookedCount: 18, category: "Yoga & Pilates", status: "SCHEDULED" },
  { id: "cls-4", name: "Power Barbell Club", studio: "Strength Forge", branchId: "branch-clifton", trainerId: "tr-bilal", trainerName: "Coach Bilal Aslam", startTime: "06:30 PM", endTime: "07:30 PM", daysOfWeek: ["Mon", "Wed", "Fri"], capacity: 16, bookedCount: 16, category: "Strength", status: "SCHEDULED" },
  { id: "cls-5", name: "Reformer Core Sculpt", studio: "Studio Alpha", branchId: "branch-luckyone", trainerId: "tr-sara", trainerName: "Coach Sara Farooq", startTime: "10:00 AM", endTime: "11:00 AM", daysOfWeek: ["Mon", "Tue", "Thu"], capacity: 15, bookedCount: 14, category: "Yoga & Pilates", status: "SCHEDULED" },
  { id: "cls-6", name: "Crossfit Beast Mode", studio: "Olympic Arena", branchId: "branch-luckyone", trainerId: "tr-hamza", trainerName: "Coach Hamza Malik", startTime: "06:00 PM", endTime: "07:00 PM", daysOfWeek: ["Tue", "Thu", "Sat"], capacity: 25, bookedCount: 20, category: "HIIT", status: "SCHEDULED" },
  { id: "cls-7", name: "Tactical Strength & Conditioning", studio: "Strength Forge", branchId: "branch-ajtower", trainerId: "tr-danial", trainerName: "Coach Danial Khan", startTime: "06:30 AM", endTime: "07:30 AM", daysOfWeek: ["Mon", "Wed", "Fri"], capacity: 20, bookedCount: 19, category: "Strength", status: "SCHEDULED" },
  { id: "cls-8", name: "Restorative Yin Yoga", studio: "Studio Alpha", branchId: "branch-ajtower", trainerId: "tr-maryam", trainerName: "Coach Maryam Siddiqui", startTime: "06:00 PM", endTime: "07:00 PM", daysOfWeek: ["Tue", "Thu"], capacity: 20, bookedCount: 15, category: "Yoga & Pilates", status: "SCHEDULED" },
];

const SEED_WORKOUTS: WorkoutPlan[] = [
  {
    id: "wk-01",
    title: "Apex Hypertrophy Push Routine",
    trainerId: "tr-tariq",
    assignedMemberId: "mem-01",
    goal: "Hypertrophy & Upper Body Power",
    experienceLevel: "Advanced",
    durationMinutes: 60,
    daysPerWeek: 4,
    targetMuscleGroups: ["Chest", "Shoulders", "Triceps"],
    equipmentNeeded: ["Barbell", "Incline Dumbbells", "Cable Station"],
    isAiGenerated: true,
    createdAt: "2024-11-01",
    exercises: [
      { name: "Incline Barbell Bench Press", sets: 4, reps: "8-10", restSeconds: 90, targetMuscle: "Upper Chest", difficulty: "Advanced", instructions: "Lower to upper sternum with 3-second eccentric contraction." },
      { name: "Flat Dumbbell Press", sets: 3, reps: "10-12", restSeconds: 75, targetMuscle: "Mid Chest", difficulty: "Intermediate", instructions: "Full stretch at bottom, squeeze pec peaks at lock." },
      { name: "Standing Overhead Military Press", sets: 4, reps: "6-8", restSeconds: 90, targetMuscle: "Anterior Deltoid", difficulty: "Advanced", instructions: "Strict form without back hyperextension, glutes engaged." },
      { name: "Lateral Cable Raises", sets: 4, reps: "15", restSeconds: 60, targetMuscle: "Lateral Deltoid", difficulty: "Intermediate", instructions: "Constant tension with thumbs angled slightly down." },
      { name: "Rope Tricep Pressdown", sets: 3, reps: "12-15", restSeconds: 45, targetMuscle: "Triceps Lateral Head", difficulty: "Beginner", instructions: "Flare ropes outward at full elbow extension." },
    ],
  },
  {
    id: "wk-02",
    title: "Metabolic HIIT Core & Shred",
    trainerId: "tr-alishba",
    assignedMemberId: "mem-02",
    goal: "Fat Loss & Metabolic Conditioning",
    experienceLevel: "Intermediate",
    durationMinutes: 45,
    daysPerWeek: 4,
    targetMuscleGroups: ["Full Body", "Core", "Cardiovascular"],
    equipmentNeeded: ["Kettlebell", "Battle Ropes", "Plyo Box"],
    isAiGenerated: true,
    createdAt: "2024-11-03",
    exercises: [
      { name: "Kettlebell Swings", sets: 4, reps: "20", restSeconds: 45, targetMuscle: "Hamstrings & Glutes", difficulty: "Intermediate", instructions: "Explosive hip hinge driving bell to chest height." },
      { name: "Battle Rope Slams", sets: 4, reps: "30 sec", restSeconds: 30, targetMuscle: "Shoulders & Core", difficulty: "Intermediate", instructions: "Full-body wave propagation with deep athletic squat stance." },
      { name: "Plyo Box Jump Overs", sets: 3, reps: "12", restSeconds: 45, targetMuscle: "Lower Body Power", difficulty: "Intermediate", instructions: "Soft landing on top of box with controlled step-down." },
      { name: "Hanging Leg Raises", sets: 3, reps: "15", restSeconds: 45, targetMuscle: "Lower Abdominals", difficulty: "Advanced", instructions: "Control swing, curl pelvis upward toward chest." },
    ],
  },
];

const SEED_ASSESSMENTS: MemberAssessment[] = [
  { id: "asm-1", memberId: "mem-01", date: "2024-10-15", weightKg: 86.4, bodyFatPercent: 13.8, muscleMassKg: 42.1, visceralFat: 5, bmi: 24.2, bloodPressure: "118/76", notes: "Excellent strength baseline. Lean mass increased by 1.2kg over 60 days." },
  { id: "asm-2", memberId: "mem-01", date: "2024-08-15", weightKg: 85.2, bodyFatPercent: 14.6, muscleMassKg: 40.9, visceralFat: 6, bmi: 23.9, bloodPressure: "120/78", notes: "Initial baseline scan." },
  { id: "asm-3", memberId: "mem-02", date: "2024-10-20", weightKg: 62.1, bodyFatPercent: 21.2, muscleMassKg: 26.5, visceralFat: 4, bmi: 22.1, bloodPressure: "112/72", notes: "Down 3.4kg of fat tissue since baseline. VO2 max improved." },
  { id: "asm-4", memberId: "mem-07", date: "2024-10-28", weightKg: 91.0, bodyFatPercent: 15.2, muscleMassKg: 44.8, visceralFat: 6, bmi: 25.4, bloodPressure: "122/80", notes: "Powerlifter profile. High skeletal muscle mass." },
];

// Social Hub Initial Seed
const SEED_SOCIAL_ACCOUNTS: SocialAccount[] = [
  { id: "soc-ig", platform: "Instagram", handle: "@trifitpakistan", displayName: "TriFit Pakistan Official", isConnected: true, followersCount: 148500, engagementRate: 4.8, avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80", lastSynced: "10 mins ago" },
  { id: "soc-fb", platform: "Facebook", handle: "TriFitPakistan", displayName: "TriFit Pakistan Fitness Clubs", isConnected: true, followersCount: 224000, engagementRate: 3.2, avatarUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&auto=format&fit=crop&q=80", lastSynced: "15 mins ago" },
  { id: "soc-tt", platform: "TikTok", handle: "@trifitpk", displayName: "TriFit PK Fitness", isConnected: true, followersCount: 89200, engagementRate: 6.4, avatarUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&auto=format&fit=crop&q=80", lastSynced: "5 mins ago" },
  { id: "soc-yt", platform: "YouTube", handle: "@TriFitGlobal", displayName: "TriFit Masterclasses", isConnected: false, followersCount: 31400, engagementRate: 2.9, avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80", lastSynced: "2 days ago" },
  { id: "soc-li", platform: "LinkedIn", handle: "company/trifit-pakistan", displayName: "TriFit Enterprise Wellness", isConnected: true, followersCount: 19800, engagementRate: 3.9, avatarUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&auto=format&fit=crop&q=80", lastSynced: "1 hour ago" },
];

const SEED_CAMPAIGNS: SocialCampaign[] = [
  { id: "cmp-1", name: "Seaview Flagship Grand Winter Drive", goal: "Member Acquisition", branchId: "branch-seaview", startDate: "2024-11-01", endDate: "2024-11-30", budgetPKR: 450000, spentPKR: 210000, impressions: 385000, reach: 195000, conversions: 84, status: "ACTIVE" },
  { id: "cmp-2", name: "Corporate Executive Wellness Islamabad", goal: "Corporate Partnerships", branchId: "branch-ajtower", startDate: "2024-10-15", endDate: "2024-11-25", budgetPKR: 350000, spentPKR: 280000, impressions: 210000, reach: 98000, conversions: 38, status: "ACTIVE" },
  { id: "cmp-3", name: "Transform 90 Challenge Clifton", goal: "Personal Training Push", branchId: "branch-clifton", startDate: "2024-11-10", endDate: "2024-12-15", budgetPKR: 250000, spentPKR: 45000, impressions: 112000, reach: 64000, conversions: 29, status: "ACTIVE" },
  { id: "cmp-4", name: "Seasonal Fitness Blueprint Preview", goal: "Seasonal Special", branchId: null, startDate: "2024-12-01", endDate: "2024-12-31", budgetPKR: 200000, spentPKR: 0, impressions: 0, reach: 0, conversions: 0, status: "SCHEDULED" },
];

const SEED_SOCIAL_POSTS: SocialPost[] = [
  {
    id: "pst-1",
    title: "Apex Strength: Incline Dumbbell Form with Coach Tariq",
    caption: "Stop dropping your elbows below 90 degrees. Watch Coach Tariq break down the optimal angle for pec tension at TriFit Seaview Flagship. #TriFitPakistan #StrengthTraining #KarachiFitness #BenchPress",
    contentType: "Reel",
    platform: "Instagram",
    mediaUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    hashtags: ["#TriFitPakistan", "#DHASeaview", "#KarachiGym", "#StrengthClub"],
    branchId: "branch-seaview",
    campaignId: "cmp-1",
    status: "PUBLISHED",
    createdAt: "2026-11-04",
    scheduledFor: null,
    publishedAt: "2026-11-05 11:30 AM",
    approvedBy: "Head Office Admin",
    likes: 4210,
    commentsCount: 184,
    shares: 340,
    reach: 58200,
    impressions: 74500,
  },
  {
    id: "pst-2",
    title: "Member Spotlight: Zaid Khan 200kg Milestone",
    caption: "From recovery to the 200kg deadlift club! Huge shoutout to Black Diamond VIP member Zaid Khan and Coach Tariq at TriFit Seaview. Hard work in silence, results in iron. 💥 #TriFitAthletes #KarachiFit",
    contentType: "Member Spotlight",
    platform: "Instagram",
    mediaUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    hashtags: ["#MemberSpotlight", "#Deadlift", "#TriFitVIP", "#Karachi"],
    branchId: "branch-seaview",
    campaignId: "cmp-1",
    status: "PUBLISHED",
    createdAt: "2026-11-06",
    scheduledFor: null,
    publishedAt: "2026-11-07 05:00 PM",
    approvedBy: "Head Office Admin",
    likes: 3120,
    commentsCount: 96,
    shares: 180,
    reach: 41000,
    impressions: 52000,
  },
  {
    id: "pst-3",
    title: "Islamabad Corporate Wellness Package Launch",
    caption: "Elevate executive focus and employee vitality. TriFit AJ Tower Gulberg Greens is now accepting corporate group enrollments for Q1 2027. Contact our business concierge today. #IslamabadCorporate #GulbergGreens",
    contentType: "Promotional",
    platform: "LinkedIn",
    mediaUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80",
    hashtags: ["#CorporateWellness", "#IslamabadBusiness", "#TriFitExecutive"],
    branchId: "branch-ajtower",
    campaignId: "cmp-2",
    status: "SCHEDULED",
    createdAt: "2026-11-07",
    scheduledFor: "2026-11-11 09:00 AM",
    publishedAt: null,
    approvedBy: "Head Office Admin",
    likes: 0,
    commentsCount: 0,
    shares: 0,
    reach: 0,
    impressions: 0,
  },
  {
    id: "pst-4",
    title: "Women's Reformer Pilates Masterclass Clifton",
    caption: "Posture, core alignment, and breath control. Join Coach Sara Farooq this Saturday at TriFit Clifton. Limited to 12 slots for personalized attention. Book via Apollo app. #PilatesKarachi #CliftonLadies",
    contentType: "Announcement",
    platform: "Facebook",
    mediaUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    hashtags: ["#ReformerPilates", "#CliftonKarachi", "#TriFitLadies"],
    branchId: "branch-clifton",
    campaignId: "cmp-3",
    status: "PENDING_APPROVAL",
    createdAt: "2026-11-08",
    scheduledFor: "2026-11-14 10:00 AM",
    publishedAt: null,
    likes: 0,
    commentsCount: 0,
    shares: 0,
    reach: 0,
    impressions: 0,
  },
  {
    id: "pst-5",
    title: "LuckyOne Mall High-Energy HIIT Reel Draft",
    caption: "When the bass drops in Olympic Arena! High intensity, zero excuses. Check out the 6 PM squad at TriFit LuckyOne Mall! 🔥 #KarachiHIIT #FitnessMotivation #LuckyOneMall",
    contentType: "Reel",
    platform: "TikTok",
    mediaUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=80",
    hashtags: ["#fyp", "#gymtok", "#karachi", "#pakistanfitness"],
    branchId: "branch-luckyone",
    campaignId: null,
    status: "DRAFT",
    createdAt: "2026-11-09",
    scheduledFor: null,
    publishedAt: null,
    likes: 0,
    commentsCount: 0,
    shares: 0,
    reach: 0,
    impressions: 0,
  },
];

const SEED_SOCIAL_MESSAGES: SocialMessage[] = [
  { id: "msg-1", platform: "Instagram", senderName: "Daniyal Tariq", senderHandle: "@daniyal.t", senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80", message: "Hi! What are the monthly charges for Black Diamond VIP at the Seaview Karachi branch?", timestamp: "12 mins ago", status: "UNREAD", isComment: false },
  { id: "msg-2", platform: "Instagram", senderName: "Sarah Ahmed", senderHandle: "@sarah.ahmed99", senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80", message: "Amazing form breakdown! Are Coach Alishba's HIIT classes included in the standard pass?", timestamp: "45 mins ago", status: "REPLIED", replyText: "Hello Sarah! All studio HIIT classes are fully included in Platinum and Black Diamond VIP plans.", repliedAt: "30 mins ago", isComment: true, postTitle: "Apex Strength: Incline Dumbbell Form" },
  { id: "msg-3", platform: "Facebook", senderName: "Malik Usman", senderHandle: "malik.usman.pk", senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80", message: "Is the AJ Tower branch in Gulberg Greens open 24/7 or till 11 PM?", timestamp: "2 hours ago", status: "UNREAD", isComment: false },
  { id: "msg-4", platform: "TikTok", senderName: "Hamza_Liftz", senderHandle: "@hamza_liftz", senderAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80", message: "That deadlift setup is insane bro! What gym is this in Karachi??", timestamp: "3 hours ago", status: "READ", isComment: true, postTitle: "Member Spotlight: Zaid Khan 200kg" },
  { id: "msg-5", platform: "LinkedIn", senderName: "Ayesha Karim (HR Director)", senderHandle: "ayesha-karim-hr", senderAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80", message: "We are interested in corporate memberships for our 65-member team in Islamabad. Can someone share a proposal?", timestamp: "Yesterday", status: "UNREAD", isComment: false },
];

// ==========================================
// CONTEXT & STORE IMPLEMENTATION
// ==========================================

interface ApolloStoreContextType {
  // State
  branches: Branch[];
  members: Member[];
  trainers: Trainer[];
  staff: Staff[];
  plans: MembershipPlan[];
  payments: PaymentTransaction[];
  attendance: AttendanceRecord[];
  classes: GymClass[];
  workouts: WorkoutPlan[];
  assessments: MemberAssessment[];
  socialAccounts: SocialAccount[];
  campaigns: SocialCampaign[];
  socialPosts: SocialPost[];
  socialMessages: SocialMessage[];

  // Selected scope
  currentBranchId: string | null;
  setCurrentBranchId: (id: string | null) => void;
  selectedBranch: Branch | null;

  // CRUD: Branches
  addBranch: (branch: Omit<Branch, "id">) => Branch;
  updateBranch: (id: string, branch: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;

  // CRUD: Members
  addMember: (member: Omit<Member, "id" | "memberCode" | "totalCheckins" | "bioScanCount" | "lastCheckin" | "lastCheckedOut">) => Member;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  changeMemberStatus: (id: string, status: MemberStatus) => void;
  renewMembership: (id: string, monthsToAdd?: number) => void;

  // CRUD: Trainers
  addTrainer: (trainer: Omit<Trainer, "id" | "completedSessions" | "activeClientsCount">) => Trainer;
  updateTrainer: (id: string, trainer: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;
  assignTrainerToMember: (memberId: string, trainerId: string | null) => void;

  // CRUD: Staff
  addStaff: (staff: Omit<Staff, "id">) => Staff;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // CRUD: Membership Plans
  addPlan: (plan: Omit<MembershipPlan, "id">) => MembershipPlan;
  updatePlan: (id: string, plan: Partial<MembershipPlan>) => void;
  deletePlan: (id: string) => void;
  togglePlanActive: (id: string) => void;

  // CRUD: Payments
  recordPayment: (payment: Omit<PaymentTransaction, "id" | "invoiceNo" | "timestamp">) => PaymentTransaction;
  refundPayment: (paymentId: string, reason?: string) => void;

  // Attendance & Check-in
  checkInMember: (memberId: string, gateName?: string, method?: "TURNSTILE_FACE" | "QR_CODE" | "MANUAL_DESK") => AttendanceRecord | null;
  checkOutMember: (memberId: string) => void;

  // Classes
  addClass: (cls: Omit<GymClass, "id" | "bookedCount">) => GymClass;
  updateClass: (id: string, cls: Partial<GymClass>) => void;
  cancelClass: (id: string) => void;

  // Workouts & AI Generator
  generateAiWorkout: (params: {
    goal: string;
    experienceLevel: string;
    durationMinutes: number;
    daysPerWeek: number;
    targetMuscleGroups: string[];
    equipmentNeeded: string[];
    limitations?: string;
  }) => WorkoutPlan;
  saveWorkout: (workout: WorkoutPlan) => void;
  assignWorkoutToClient: (workoutId: string, memberId: string) => void;
  deleteWorkout: (id: string) => void;

  // Assessments
  addAssessment: (assessment: Omit<MemberAssessment, "id">) => MemberAssessment;

  // Social Hub Operations
  toggleSocialAccount: (accountId: string) => void;
  createSocialPost: (post: Omit<SocialPost, "id" | "createdAt" | "likes" | "commentsCount" | "shares" | "reach" | "impressions" | "publishedAt">) => SocialPost;
  updateSocialPost: (id: string, post: Partial<SocialPost>) => void;
  deleteSocialPost: (id: string) => void;
  approveSocialPost: (id: string, approverName?: string) => void;
  rejectSocialPost: (id: string, reason: string) => void;
  publishSocialPost: (id: string) => void;
  createCampaign: (campaign: Omit<SocialCampaign, "id" | "spentPKR" | "impressions" | "reach" | "conversions">) => SocialCampaign;
  updateCampaign: (id: string, campaign: Partial<SocialCampaign>) => void;
  deleteCampaign: (id: string) => void;
  replyToSocialMessage: (messageId: string, replyText: string) => void;
  markSocialMessageRead: (messageId: string) => void;

  // System
  resetDemoData: () => void;

  // Computed KPIs
  stats: {
    totalMembers: number;
    activeMembers: number;
    newMembersThisMonth: number;
    totalTrainers: number;
    totalBranches: number;
    monthlyRevenuePKR: number;
    outstandingPaymentsPKR: number;
    retentionRatePercent: number;
    todayCheckins: number;
    currentInClubCount: number;
    activeCampaignsCount: number;
    totalSocialFollowers: number;
    pendingSocialApprovals: number;
  };
}

const ApolloStoreContext = createContext<ApolloStoreContextType | undefined>(undefined);

const STORAGE_KEY = "apollo_enterprise_demo_state_v1";

export const ApolloStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>(SEED_BRANCHES);
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [trainers, setTrainers] = useState<Trainer[]>(SEED_TRAINERS);
  const [staff, setStaff] = useState<Staff[]>(SEED_STAFF);
  const [plans, setPlans] = useState<MembershipPlan[]>(SEED_PLANS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(SEED_PAYMENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(SEED_ATTENDANCE);
  const [classes, setClasses] = useState<GymClass[]>(SEED_CLASSES);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>(SEED_WORKOUTS);
  const [assessments, setAssessments] = useState<MemberAssessment[]>(SEED_ASSESSMENTS);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(SEED_SOCIAL_ACCOUNTS);
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>(SEED_CAMPAIGNS);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(SEED_SOCIAL_POSTS);
  const [socialMessages, setSocialMessages] = useState<SocialMessage[]>(SEED_SOCIAL_MESSAGES);
  const [currentBranchId, setCurrentBranchId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.branches) setBranches(parsed.branches);
        const validPlanIds = new Set(SEED_PLANS.map((p) => p.id));
        const planMigrationMap: Record<string, string> = {
          "plan-black-diamond": "plan-trifit-plus-12m",
          "plan-platinum-pro": "plan-trifit-regular-12m",
          "plan-prime-monthly": "plan-trifit-regular-3m",
          "plan-student": "plan-trifit-regular-6m",
          "plan-ladies-morning": "plan-trifit-plus-3m",
          "plan-ramadan": "plan-trifit-plus-6m",
        };

        if (parsed.members && Array.isArray(parsed.members)) {
          const sanitizedMembers = parsed.members.map((m: any) => ({
            ...m,
            planId: planMigrationMap[m.planId] || (validPlanIds.has(m.planId) ? m.planId : "plan-trifit-regular-12m"),
          }));
          setMembers(sanitizedMembers);
        }

        if (parsed.plans && Array.isArray(parsed.plans)) {
          const filtered = parsed.plans.filter((p: any) => validPlanIds.has(p.id));
          if (filtered.length === SEED_PLANS.length) {
            setPlans(filtered);
          } else {
            setPlans(SEED_PLANS);
          }
        } else {
          setPlans(SEED_PLANS);
        }
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.classes) setClasses(parsed.classes);
        if (parsed.workouts) setWorkouts(parsed.workouts);
        if (parsed.assessments) setAssessments(parsed.assessments);
        if (parsed.socialAccounts) setSocialAccounts(parsed.socialAccounts);
        if (parsed.campaigns) setCampaigns(parsed.campaigns);
        if (parsed.socialPosts) setSocialPosts(parsed.socialPosts);
        if (parsed.socialMessages) setSocialMessages(parsed.socialMessages);
      }
    } catch (e) {
      console.warn("Failed to load Apollo store from localStorage:", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const dataToSave = {
        branches,
        members,
        trainers,
        staff,
        plans,
        payments,
        attendance,
        classes,
        workouts,
        assessments,
        socialAccounts,
        campaigns,
        socialPosts,
        socialMessages,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("Failed to persist Apollo store:", e);
    }
  }, [
    isHydrated,
    branches,
    members,
    trainers,
    staff,
    plans,
    payments,
    attendance,
    classes,
    workouts,
    assessments,
    socialAccounts,
    campaigns,
    socialPosts,
    socialMessages,
  ]);

  // Selected Branch
  const selectedBranch = useMemo(() => {
    if (!currentBranchId) return null;
    return branches.find((b) => b.id === currentBranchId) || null;
  }, [branches, currentBranchId]);

  // Reset Demo Data
  const resetDemoData = () => {
    setBranches(SEED_BRANCHES);
    setMembers(SEED_MEMBERS);
    setTrainers(SEED_TRAINERS);
    setStaff(SEED_STAFF);
    setPlans(SEED_PLANS);
    setPayments(SEED_PAYMENTS);
    setAttendance(SEED_ATTENDANCE);
    setClasses(SEED_CLASSES);
    setWorkouts(SEED_WORKOUTS);
    setAssessments(SEED_ASSESSMENTS);
    setSocialAccounts(SEED_SOCIAL_ACCOUNTS);
    setCampaigns(SEED_CAMPAIGNS);
    setSocialPosts(SEED_SOCIAL_POSTS);
    setSocialMessages(SEED_SOCIAL_MESSAGES);
    setCurrentBranchId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  // CRUD: Branches
  const addBranch = (branchData: Omit<Branch, "id">): Branch => {
    const newId = `branch-${Date.now()}`;
    const newBranch: Branch = { ...branchData, id: newId };
    setBranches((prev) => [newBranch, ...prev]);
    return newBranch;
  };

  const updateBranch = (id: string, updates: Partial<Branch>) => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBranch = (id: string) => {
    // Reassign members and trainers safely to flagship or null
    setMembers((prev) => prev.map((m) => (m.branchId === id ? { ...m, branchId: "branch-seaview" } : m)));
    setTrainers((prev) => prev.map((t) => (t.branchId === id ? { ...t, branchId: "branch-seaview" } : t)));
    setBranches((prev) => prev.filter((b) => b.id !== id));
    if (currentBranchId === id) setCurrentBranchId(null);
  };

  // CRUD: Members
  const addMember = (
    memberData: Omit<Member, "id" | "memberCode" | "totalCheckins" | "bioScanCount" | "lastCheckin" | "lastCheckedOut">
  ): Member => {
    const newId = `mem-${Date.now()}`;
    const nextCodeNum = 10233 + members.length;
    const newMember: Member = {
      ...memberData,
      id: newId,
      memberCode: `TF-${nextCodeNum}`,
      totalCheckins: 0,
      bioScanCount: 1,
      lastCheckin: null,
      lastCheckedOut: null,
    };
    setMembers((prev) => [newMember, ...prev]);

    // Update trainer client count if assigned
    if (newMember.trainerId) {
      setTrainers((prev) =>
        prev.map((t) => (t.id === newMember.trainerId ? { ...t, activeClientsCount: t.activeClientsCount + 1 } : t))
      );
    }

    // Auto-record initial payment
    const plan = plans.find((p) => p.id === newMember.planId);
    if (plan) {
      const invNo = `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPay: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        invoiceNo: invNo,
        memberId: newId,
        memberName: newMember.name,
        branchId: newMember.branchId,
        planName: plan.name,
        amountPKR: plan.pricePKR,
        paymentMethod: "IBFT_BANK",
        status: "COMPLETED",
        timestamp: "Just now",
        notes: "Initial registration payment",
      };
      setPayments((prev) => [newPay, ...prev]);
    }

    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) => {
      const oldMember = prev.find((m) => m.id === id);
      const updated = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));

      // If trainer changed, adjust trainer client counts
      if (oldMember && updates.trainerId !== undefined && oldMember.trainerId !== updates.trainerId) {
        setTrainers((tPrev) =>
          tPrev.map((t) => {
            if (t.id === oldMember.trainerId) {
              return { ...t, activeClientsCount: Math.max(0, t.activeClientsCount - 1) };
            }
            if (t.id === updates.trainerId) {
              return { ...t, activeClientsCount: t.activeClientsCount + 1 };
            }
            return t;
          })
        );
      }

      return updated;
    });
  };

  const deleteMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (member?.trainerId) {
      setTrainers((tPrev) =>
        tPrev.map((t) => (t.id === member.trainerId ? { ...t, activeClientsCount: Math.max(0, t.activeClientsCount - 1) } : t))
      );
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const changeMemberStatus = (id: string, status: MemberStatus) => {
    updateMember(id, { status });
  };

  const renewMembership = (id: string, monthsToAdd: number = 1) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    // Calculate new expiry date
    const currentExpiry = new Date(member.expiryDate);
    const validExpiry = isNaN(currentExpiry.getTime()) ? new Date() : currentExpiry;
    validExpiry.setMonth(validExpiry.getMonth() + monthsToAdd);
    const newExpiryStr = validExpiry.toISOString().split("T")[0];

    updateMember(id, {
      status: "ACTIVE",
      expiryDate: newExpiryStr,
    });

    // Record renewal transaction
    const plan = plans.find((p) => p.id === member.planId);
    if (plan) {
      const invNo = `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPay: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        invoiceNo: invNo,
        memberId: member.id,
        memberName: member.name,
        branchId: member.branchId,
        planName: plan.name,
        amountPKR: plan.pricePKR,
        paymentMethod: "IBFT_BANK",
        status: "COMPLETED",
        timestamp: "Just now",
        notes: `Membership renewal (+${monthsToAdd} months)`,
      };
      setPayments((prev) => [newPay, ...prev]);
    }
  };

  // CRUD: Trainers
  const addTrainer = (trainerData: Omit<Trainer, "id" | "completedSessions" | "activeClientsCount">): Trainer => {
    const newId = `tr-${Date.now()}`;
    const newTrainer: Trainer = {
      ...trainerData,
      id: newId,
      completedSessions: 0,
      activeClientsCount: 0,
    };
    setTrainers((prev) => [newTrainer, ...prev]);
    return newTrainer;
  };

  const updateTrainer = (id: string, updates: Partial<Trainer>) => {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTrainer = (id: string) => {
    // Unassign this trainer from all members
    setMembers((prev) => prev.map((m) => (m.trainerId === id ? { ...m, trainerId: null } : m)));
    setTrainers((prev) => prev.filter((t) => t.id !== id));
  };

  const assignTrainerToMember = (memberId: string, trainerId: string | null) => {
    updateMember(memberId, { trainerId });
  };

  // CRUD: Staff
  const addStaff = (staffData: Omit<Staff, "id">): Staff => {
    const newId = `st-${Date.now()}`;
    const newStaff: Staff = { ...staffData, id: newId };
    setStaff((prev) => [newStaff, ...prev]);
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  // CRUD: Membership Plans
  const addPlan = (planData: Omit<MembershipPlan, "id">): MembershipPlan => {
    const newId = `plan-${Date.now()}`;
    const newPlan: MembershipPlan = { ...planData, id: newId };
    setPlans((prev) => [...prev, newPlan]);
    return newPlan;
  };

  const updatePlan = (id: string, updates: Partial<MembershipPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePlanActive = (id: string) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  };

  // CRUD: Payments
  const recordPayment = (
    paymentData: Omit<PaymentTransaction, "id" | "invoiceNo" | "timestamp">
  ): PaymentTransaction => {
    const newId = `pay-${Date.now()}`;
    const invNo = `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPay: PaymentTransaction = {
      ...paymentData,
      id: newId,
      invoiceNo: invNo,
      timestamp: "Today at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setPayments((prev) => [newPay, ...prev]);
    return newPay;
  };

  const refundPayment = (paymentId: string, reason: string = "Customer requested refund") => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "REFUNDED",
              notes: `${p.notes ? p.notes + " | " : ""}Refunded: ${reason}`,
            }
          : p
      )
    );
  };

  // Attendance & Check-ins
  const checkInMember = (
    memberId: string,
    gateName: string = "Main Turnstile Gate",
    method: "TURNSTILE_FACE" | "QR_CODE" | "MANUAL_DESK" = "MANUAL_DESK"
  ): AttendanceRecord | null => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return null;

    const branch = branches.find((b) => b.id === member.branchId) || branches[0];
    const timeStr = "Today at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      memberCode: member.memberCode,
      branchId: member.branchId,
      branchName: branch.name,
      checkInTime: timeStr,
      checkOutTime: null,
      method,
      gateName,
    };

    setAttendance((prev) => [newRecord, ...prev]);

    // Update member record
    updateMember(memberId, {
      lastCheckin: timeStr,
      lastCheckedOut: null,
      totalCheckins: member.totalCheckins + 1,
    });

    return newRecord;
  };

  const checkOutMember = (memberId: string) => {
    const timeStr = "Today at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setAttendance((prev) =>
      prev.map((att) => {
        if (att.memberId === memberId && !att.checkOutTime) {
          return { ...att, checkOutTime: timeStr };
        }
        return att;
      })
    );

    updateMember(memberId, {
      lastCheckedOut: timeStr,
    });
  };

  // Classes
  const addClass = (clsData: Omit<GymClass, "id" | "bookedCount">): GymClass => {
    const newId = `cls-${Date.now()}`;
    const newCls: GymClass = { ...clsData, id: newId, bookedCount: 0 };
    setClasses((prev) => [...prev, newCls]);
    return newCls;
  };

  const updateClass = (id: string, updates: Partial<GymClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const cancelClass = (id: string) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, status: "CANCELLED" } : c)));
  };

  // Workouts & AI Generator
  const generateAiWorkout = (params: {
    goal: string;
    experienceLevel: string;
    durationMinutes: number;
    daysPerWeek: number;
    targetMuscleGroups: string[];
    equipmentNeeded: string[];
    limitations?: string;
  }): WorkoutPlan => {
    const exercisesLibrary: Record<string, ExerciseItem[]> = {
      Chest: [
        { name: "Barbell Bench Press", sets: 4, reps: "8-10", restSeconds: 90, targetMuscle: "Chest", difficulty: "Intermediate", instructions: "Touch mid-chest with elbows at 45 degrees. Drive upward with control." },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", restSeconds: 75, targetMuscle: "Upper Chest", difficulty: "Intermediate", instructions: "Maintain upper back arch, full stretch at bottom." },
        { name: "Cable Chest Flyes", sets: 3, reps: "12-15", restSeconds: 60, targetMuscle: "Pectoral Squeeze", difficulty: "Beginner", instructions: "Lead with pinkies, hug around a tree." },
      ],
      Back: [
        { name: "Deadlift (Conventional)", sets: 4, reps: "5", restSeconds: 120, targetMuscle: "Posterior Chain", difficulty: "Advanced", instructions: "Hinge at hips, brace core, pull slack from bar." },
        { name: "Barbell Bent-Over Row", sets: 4, reps: "8-10", restSeconds: 90, targetMuscle: "Lats & Rhomboids", difficulty: "Intermediate", instructions: "Torso at 45 degrees, pull barbell to lower ribcage." },
        { name: "Wide-Grip Lat Pulldown", sets: 3, reps: "10-12", restSeconds: 60, targetMuscle: "Latissimus Dorsi", difficulty: "Beginner", instructions: "Drive elbows down to waist, avoid excessive swinging." },
      ],
      Legs: [
        { name: "Barbell Back Squat", sets: 4, reps: "6-8", restSeconds: 120, targetMuscle: "Quadriceps & Glutes", difficulty: "Advanced", instructions: "Break at hips and knees simultaneously, achieve parallel depth." },
        { name: "Romanian Deadlift", sets: 3, reps: "10-12", restSeconds: 90, targetMuscle: "Hamstrings", difficulty: "Intermediate", instructions: "Soft knee bend, push hips backward until deep hamstring stretch." },
        { name: "Walking Dumbbell Lunges", sets: 3, reps: "12 each", restSeconds: 60, targetMuscle: "Quads & Stabilizers", difficulty: "Intermediate", instructions: "Keep torso upright, 90-degree bend in front knee." },
      ],
      Shoulders: [
        { name: "Standing Overhead Press", sets: 4, reps: "6-8", restSeconds: 90, targetMuscle: "Anterior Delts", difficulty: "Advanced", instructions: "Press vertically over crown of head with tight core." },
        { name: "Dumbbell Lateral Raise", sets: 4, reps: "12-15", restSeconds: 60, targetMuscle: "Lateral Deltoids", difficulty: "Beginner", instructions: "Raise arms to shoulder height with elbows slightly bent." },
        { name: "Face Pulls with Rope", sets: 3, reps: "15-20", restSeconds: 45, targetMuscle: "Rear Delts & Rotator Cuff", difficulty: "Beginner", instructions: "Pull rope towards bridge of nose, rotate thumbs outward." },
      ],
      Core: [
        { name: "Hanging Leg Raises", sets: 3, reps: "12-15", restSeconds: 45, targetMuscle: "Lower Abdominals", difficulty: "Intermediate", instructions: "Lift legs without swinging, curl pelvis upward." },
        { name: "Ab Wheel Rollout", sets: 3, reps: "10", restSeconds: 60, targetMuscle: "Core Stability", difficulty: "Advanced", instructions: "Extend out while maintaining posterior pelvic tilt." },
        { name: "Cable Woodchoppers", sets: 3, reps: "15 each", restSeconds: 45, targetMuscle: "Obliques", difficulty: "Beginner", instructions: "Rotate from torso, arms extended, pivot back foot." },
      ],
    };

    const selectedExercises: ExerciseItem[] = [];
    const muscles = params.targetMuscleGroups.length > 0 ? params.targetMuscleGroups : ["Chest", "Back", "Legs"];

    muscles.forEach((muscle) => {
      const match = exercisesLibrary[muscle] || exercisesLibrary["Chest"];
      selectedExercises.push(...match.slice(0, 2));
    });

    const newWorkout: WorkoutPlan = {
      id: `wk-ai-${Date.now()}`,
      title: `Apollo AI: ${params.goal} Blueprint`,
      trainerId: "tr-tariq",
      assignedMemberId: null,
      goal: params.goal,
      experienceLevel: params.experienceLevel,
      durationMinutes: params.durationMinutes,
      daysPerWeek: params.daysPerWeek,
      targetMuscleGroups: params.targetMuscleGroups,
      equipmentNeeded: params.equipmentNeeded,
      exercises: selectedExercises,
      isAiGenerated: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    return newWorkout;
  };

  const saveWorkout = (workout: WorkoutPlan) => {
    setWorkouts((prev) => {
      const exists = prev.find((w) => w.id === workout.id);
      if (exists) {
        return prev.map((w) => (w.id === workout.id ? workout : w));
      }
      return [workout, ...prev];
    });
  };

  const assignWorkoutToClient = (workoutId: string, memberId: string) => {
    setWorkouts((prev) => prev.map((w) => (w.id === workoutId ? { ...w, assignedMemberId: memberId } : w)));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // Assessments
  const addAssessment = (assessmentData: Omit<MemberAssessment, "id">): MemberAssessment => {
    const newId = `asm-${Date.now()}`;
    const newAsm: MemberAssessment = { ...assessmentData, id: newId };
    setAssessments((prev) => [newAsm, ...prev]);

    // Update member scan count
    updateMember(assessmentData.memberId, {
      bioScanCount: (members.find((m) => m.id === assessmentData.memberId)?.bioScanCount || 1) + 1,
    });

    return newAsm;
  };

  // Social Hub Operations
  const toggleSocialAccount = (accountId: string) => {
    setSocialAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, isConnected: !acc.isConnected } : acc))
    );
  };

  const createSocialPost = (
    postData: Omit<SocialPost, "id" | "createdAt" | "likes" | "commentsCount" | "shares" | "reach" | "impressions" | "publishedAt">
  ): SocialPost => {
    const newId = `pst-${Date.now()}`;
    const newPost: SocialPost = {
      ...postData,
      id: newId,
      createdAt: new Date().toISOString().split("T")[0],
      publishedAt: postData.status === "PUBLISHED" ? "Just now" : null,
      likes: postData.status === "PUBLISHED" ? 140 : 0,
      commentsCount: postData.status === "PUBLISHED" ? 12 : 0,
      shares: postData.status === "PUBLISHED" ? 8 : 0,
      reach: postData.status === "PUBLISHED" ? 1200 : 0,
      impressions: postData.status === "PUBLISHED" ? 1800 : 0,
    };
    setSocialPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updateSocialPost = (id: string, updates: Partial<SocialPost>) => {
    setSocialPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteSocialPost = (id: string) => {
    setSocialPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const approveSocialPost = (id: string, approverName: string = "Head Office Admin") => {
    updateSocialPost(id, {
      status: "APPROVED",
      approvedBy: approverName,
    });
  };

  const rejectSocialPost = (id: string, reason: string) => {
    updateSocialPost(id, {
      status: "REJECTED",
      rejectionReason: reason,
    });
  };

  const publishSocialPost = (id: string) => {
    updateSocialPost(id, {
      status: "PUBLISHED",
      publishedAt: "Just now",
      likes: Math.floor(150 + Math.random() * 300),
      commentsCount: Math.floor(10 + Math.random() * 30),
      shares: Math.floor(5 + Math.random() * 20),
      reach: Math.floor(2500 + Math.random() * 3000),
      impressions: Math.floor(3800 + Math.random() * 4000),
    });
  };

  const createCampaign = (
    campData: Omit<SocialCampaign, "id" | "spentPKR" | "impressions" | "reach" | "conversions">
  ): SocialCampaign => {
    const newId = `cmp-${Date.now()}`;
    const newCamp: SocialCampaign = {
      ...campData,
      id: newId,
      spentPKR: 0,
      impressions: 0,
      reach: 0,
      conversions: 0,
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    return newCamp;
  };

  const updateCampaign = (id: string, updates: Partial<SocialCampaign>) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const replyToSocialMessage = (messageId: string, replyText: string) => {
    setSocialMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              status: "REPLIED",
              replyText,
              repliedAt: "Just now",
            }
          : msg
      )
    );
  };

  const markSocialMessageRead = (messageId: string) => {
    setSocialMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, status: "READ" } : msg))
    );
  };

  // Computed KPIs across entire ecosystem
  const stats = useMemo(() => {
    // Filter by currentBranchId if selected
    const activeBranchFilter = currentBranchId;
    const scopedMembers = activeBranchFilter ? members.filter((m) => m.branchId === activeBranchFilter) : members;
    const scopedPayments = activeBranchFilter ? payments.filter((p) => p.branchId === activeBranchFilter) : payments;
    const scopedAttendance = activeBranchFilter ? attendance.filter((a) => a.branchId === activeBranchFilter) : attendance;
    const scopedTrainers = activeBranchFilter ? trainers.filter((t) => t.branchId === activeBranchFilter) : trainers;

    const totalMembers = scopedMembers.length;
    const activeMembers = scopedMembers.filter((m) => m.status === "ACTIVE").length;
    const newMembersThisMonth = scopedMembers.filter((m) => m.joiningDate >= "2024-10-01").length;
    const totalTrainers = scopedTrainers.length;
    const totalBranches = branches.length;

    const monthlyRevenuePKR = scopedPayments
      .filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amountPKR, 0);

    const outstandingPaymentsPKR = scopedPayments
      .filter((p) => p.status === "FAILED" || p.status === "PENDING")
      .reduce((sum, p) => sum + p.amountPKR, 0);

    const retentionRatePercent = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 92;

    const todayCheckins = scopedAttendance.filter((a) => a.checkInTime.startsWith("Today")).length;
    const currentInClubCount = scopedAttendance.filter(
      (a) => a.checkInTime.startsWith("Today") && a.checkOutTime === null
    ).length;

    const activeCampaignsCount = campaigns.filter((c) => c.status === "ACTIVE").length;
    const totalSocialFollowers = socialAccounts.reduce((sum, acc) => sum + (acc.isConnected ? acc.followersCount : 0), 0);
    const pendingSocialApprovals = socialPosts.filter((p) => p.status === "PENDING_APPROVAL").length;

    return {
      totalMembers,
      activeMembers,
      newMembersThisMonth,
      totalTrainers,
      totalBranches,
      monthlyRevenuePKR,
      outstandingPaymentsPKR,
      retentionRatePercent,
      todayCheckins,
      currentInClubCount,
      activeCampaignsCount,
      totalSocialFollowers,
      pendingSocialApprovals,
    };
  }, [members, payments, attendance, trainers, branches, campaigns, socialAccounts, socialPosts, currentBranchId]);

  return (
    <ApolloStoreContext.Provider
      value={{
        branches,
        members,
        trainers,
        staff,
        plans,
        payments,
        attendance,
        classes,
        workouts,
        assessments,
        socialAccounts,
        campaigns,
        socialPosts,
        socialMessages,

        currentBranchId,
        setCurrentBranchId,
        selectedBranch,

        addBranch,
        updateBranch,
        deleteBranch,

        addMember,
        updateMember,
        deleteMember,
        changeMemberStatus,
        renewMembership,

        addTrainer,
        updateTrainer,
        deleteTrainer,
        assignTrainerToMember,

        addStaff,
        updateStaff,
        deleteStaff,

        addPlan,
        updatePlan,
        deletePlan,
        togglePlanActive,

        recordPayment,
        refundPayment,

        checkInMember,
        checkOutMember,

        addClass,
        updateClass,
        cancelClass,

        generateAiWorkout,
        saveWorkout,
        assignWorkoutToClient,
        deleteWorkout,

        addAssessment,

        toggleSocialAccount,
        createSocialPost,
        updateSocialPost,
        deleteSocialPost,
        approveSocialPost,
        rejectSocialPost,
        publishSocialPost,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        replyToSocialMessage,
        markSocialMessageRead,

        resetDemoData,
        stats,
      }}
    >
      {children}
    </ApolloStoreContext.Provider>
  );
};

export const useApolloStore = () => {
  const context = useContext(ApolloStoreContext);
  if (!context) {
    throw new Error("useApolloStore must be used within an ApolloStoreProvider");
  }
  return context;
};
