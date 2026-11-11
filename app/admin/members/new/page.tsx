"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore, Member } from "@/lib/apollo-demo-store";
import {
  UserPlus,
  ArrowLeft,
  Building2,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Dumbbell,
  ScanLine,
  Phone,
  Mail,
  User,
  Hash,
  Check,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function AddMemberPage() {
  const router = useRouter();
  const { branches, plans, trainers, addMember } = useApolloStore();

  // Form State
  const [fullName, setFullName] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("+92 3");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [emergencyPhone, setEmergencyPhone] = useState("+92 3");

  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || "branch-seaview");
  const [tier, setTier] = useState<"REGULAR" | "PLUS">("PLUS");
  const [durationMonths, setDurationMonths] = useState<3 | 6 | 12>(12);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("trainer-1");
  const [queueFormaScan, setQueueFormaScan] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"PAYFAST" | "BANK_TRANSFER" | "POS_CARD" | "CASH">("PAYFAST");
  const [paymentRef, setPaymentRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Pricing matrix
  const PRICING_MATRIX = {
    REGULAR: { 3: 52999, 6: 84999, 12: 122999 },
    PLUS: { 3: 65999, 6: 105999, 12: 155999 },
  };

  const currentPricePKR = PRICING_MATRIX[tier][durationMonths];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !cnic.trim()) {
      alert("Please provide at least a Full Name and CNIC.");
      return;
    }

    setIsSubmitting(true);

    // Find or fallback planId
    const matchedPlan = plans.find(
      (p) =>
        (tier === "PLUS" ? p.name.includes("Plus") : !p.name.includes("Plus")) &&
        p.name.includes(`${durationMonths}M`)
    ) || plans[0];

    const newId = `mem-${Date.now().toString(36)}`;

    const today = new Date().toISOString().split("T")[0];
    const expiryDateObj = new Date();
    expiryDateObj.setMonth(expiryDateObj.getMonth() + durationMonths);
    const expiryDate = expiryDateObj.toISOString().split("T")[0];

    // Add to store
    addMember({
      name: fullName,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone,
      cnic,
      gender: gender === "MALE" ? "Male" : "Female",
      dob: "1996-05-15",
      address: "Karachi, Pakistan",
      emergencyContact: {
        name: "Emergency Contact",
        phone: emergencyPhone,
        relationship: "Family",
      },
      branchId: selectedBranchId,
      planId: matchedPlan ? matchedPlan.id : "plan-plus-12m",
      trainerId: selectedTrainerId !== "NONE" ? selectedTrainerId : null,
      status: "ACTIVE",
      joiningDate: today,
      startDate: today,
      expiryDate,
      fitnessGoal: "Strength & Muscle",
      fitnessLevel: "Intermediate",
      studio: "HIIT Studio",
      lockerNumber: `L-${Math.floor(Math.random() * 80) + 10}`,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    });

    setSuccessId(newId);

    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to the member dossier
      router.push(`/admin/members`);
    }, 900);
  };

  return (
    <AdminPortalLayout activeItem="members">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16">
        {/* Navigation Breadcrumb & Back Bar */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <Link
            href="/admin/members"
            className="btn !py-2 !px-3.5 text-xs text-[var(--muted)] hover:text-[var(--text)] flex items-center gap-2 group transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Members CRM</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <span>Admin</span>
            <span>/</span>
            <span>Members</span>
            <span>/</span>
            <span className="text-[var(--accent)] font-semibold">New Registration</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[var(--accent)] text-[var(--on-accent)]">
                <UserPlus className="w-5 h-5" />
              </span>
              <h1 className="admin-page-title text-2xl font-bold tracking-tight text-[var(--text)]">
                Register New Member
              </h1>
            </div>
            <p className="body-label text-xs sm:text-sm mt-1 text-[var(--muted)]">
              Enterprise multi-branch enrollment for TriFit Pakistan. Generates biometric profile & dues ledger.
            </p>
          </div>
          <span className="admin-chip self-start sm:self-auto text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Biometric Gate Sync Active
          </span>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Personal & Identity Information */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <User className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">
                1. Member Identity & Contact (Pakistan Verification)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamza Malik"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/10 focus:border-[var(--accent)] text-xs text-[var(--text)] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  CNIC Number (13 digits) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="42201-XXXXXXX-X"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/10 focus:border-[var(--accent)] text-xs font-mono text-[var(--text)] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Phone (WhatsApp Notifications) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/10 focus:border-[var(--accent)] text-xs font-mono text-[var(--text)] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">Email Address</label>
                <input
                  type="email"
                  placeholder="hamza.malik@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/10 focus:border-[var(--accent)] text-xs text-[var(--text)] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender("MALE")}
                    className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                      gender === "MALE"
                        ? "bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)]"
                        : "bg-white/5 border-white/10 text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("FEMALE")}
                    className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                      gender === "FEMALE"
                        ? "bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)]"
                        : "bg-white/5 border-white/10 text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">Emergency Contact</label>
                <input
                  type="tel"
                  placeholder="+92 321 9876543"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/10 focus:border-[var(--accent)] text-xs font-mono text-[var(--text)] outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Club & Subscription Package */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Building2 className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">
                2. Branch Allocation & Subscription Package
              </h2>
            </div>

            {/* Branch Selection */}
            <div>
              <label className="block font-semibold mb-2 text-xs text-[var(--text)]">Home Flagship Club</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedBranchId === b.id
                        ? "bg-[var(--accent)]/15 border-[var(--accent)] shadow-sm"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="font-bold text-[var(--text)] truncate">{b.name.replace("TriFit ", "")}</div>
                    <div className="text-[11px] text-[var(--muted)] mt-0.5">{b.city}</div>
                    <div className="text-[10px] font-mono text-[var(--accent)] mt-1.5 flex items-center gap-1">
                      {selectedBranchId === b.id && <Check className="w-3 h-3" />}
                      <span>{selectedBranchId === b.id ? "Assigned Club" : "Select Club"}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Selection: TriFit Regular vs TriFit Plus */}
            <div className="pt-2">
              <label className="block font-semibold mb-2 text-xs text-[var(--text)]">Membership Tier</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTier("REGULAR")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    tier === "REGULAR"
                      ? "bg-[var(--accent)]/15 border-[var(--accent)] shadow-md"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[var(--text)]">TriFit Regular</span>
                    {tier === "REGULAR" && <Check className="w-4 h-4 text-[var(--accent)]" />}
                  </div>
                  <p className="text-xs text-[var(--muted)]">
                    Gym floor, cardio arena, locker facilities, complimentary orientation.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setTier("PLUS")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    tier === "PLUS"
                      ? "bg-[var(--accent)]/20 border-[var(--accent)] shadow-md ring-1 ring-[var(--accent)]"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--text)]">TriFit Plus</span>
                      <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[var(--accent)] text-[var(--on-accent)]">
                        RECOMMENDED
                      </span>
                    </div>
                    {tier === "PLUS" && <Check className="w-4 h-4 text-[var(--accent)]" />}
                  </div>
                  <p className="text-xs text-[var(--muted)]">
                    All 5 Signature Studios (HIIT, Stages RPM, Allegro 2 Pilates, Yoga, HYROX) + Fuel Bar discounts + Unlimited Forma 3D Body Scans.
                  </p>
                </button>
              </div>
            </div>

            {/* Duration & Pricing Matrix */}
            <div className="pt-2">
              <label className="block font-semibold mb-2 text-xs text-[var(--text)]">Package Duration</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([3, 6, 12] as const).map((months) => {
                  const isSelected = durationMonths === months;
                  const price = PRICING_MATRIX[tier][months];

                  return (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setDurationMonths(months)}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)] font-bold shadow-md"
                          : "bg-white/5 border-white/10 text-[var(--text)] hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs font-semibold">{months} Months</div>
                      <div className="text-lg font-bold font-mono mt-1">PKR {price.toLocaleString()}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">
                        PKR {Math.round(price / months).toLocaleString()} / mo
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 3: Dedicated Coach & Hardware Features */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Dumbbell className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">
                3. Dedicated Trainer & Forma 3D Hardware Telemetry
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Assign Personal Trainer / Coach
                </label>
                <select
                  value={selectedTrainerId}
                  onChange={(e) => setSelectedTrainerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/10 focus:border-[var(--accent)] text-xs text-[var(--text)] outline-none"
                >
                  <option value="NONE">No Coach Assigned (General Floor)</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} • {t.specialty}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[var(--muted)] mt-1">
                  Coach receives instant WhatsApp notification and client allocation dossier.
                </p>
              </div>

              {/* Forma 3D Kiosk Queue Toggle */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="forma-queue"
                  checked={queueFormaScan}
                  onChange={(e) => setQueueFormaScan(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[var(--accent)] cursor-pointer"
                />
                <label htmlFor="forma-queue" className="cursor-pointer">
                  <div className="font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                    <ScanLine className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Auto-Queue Forma 3D AI Body Scan</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    Triggers initial body composition calibration (body fat %, posture angles, skeletal muscle mesh) upon member&apos;s first RFID/QR turnstile entry.
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 4: Payment Ledger & Submission */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <CreditCard className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">
                4. Dues Payment & Settlement
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "PAYFAST", label: "PayFast Online" },
                    { id: "BANK_TRANSFER", label: "Bank Transfer" },
                    { id: "POS_CARD", label: "POS Credit/Debit" },
                    { id: "CASH", label: "Cash at Desk" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                        paymentMethod === m.id
                          ? "bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)]"
                          : "bg-white/5 border-white/10 text-[var(--muted)] hover:text-[var(--text)]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Transaction Ref / Receipt No. (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-99824 / HBL Slip #401"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 dark:bg-white/5 border border-white/10 focus:border-[var(--accent)] text-xs font-mono text-[var(--text)] outline-none"
                />
                <div className="mt-2 text-right">
                  <span className="text-xs text-[var(--muted)]">Total Payable: </span>
                  <span className="text-base font-bold font-mono text-[var(--accent)]">
                    PKR {currentPricePKR.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/admin/members"
                className="btn !py-2.5 !px-5 text-xs text-[var(--muted)] hover:text-[var(--text)] w-full sm:w-auto text-center"
              >
                Cancel & Return
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn primary !py-2.5 !px-6 text-xs font-bold w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Enrolling Member & Generating Dossier...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Enrollment (PKR {currentPricePKR.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminPortalLayout>
  );
}
