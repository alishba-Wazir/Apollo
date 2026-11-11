"use client";

import React, { useState } from "react";
import { X, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { useApolloStore } from "@/lib/apollo-demo-store";
import { ApolloSelect } from "@/components/ui/ApolloSelect";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded?: (memberId: string) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onMemberAdded }) => {
  const { branches, plans, trainers, addMember } = useApolloStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+92 300 ");
  const [cnic, setCnic] = useState("42101-");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [dob, setDob] = useState("1996-01-01");
  const [address, setAddress] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("+92 300 ");
  const [emergencyRelationship, setEmergencyRelationship] = useState("Spouse");
  const [branchId, setBranchId] = useState(branches[0]?.id || "branch-seaview");
  const [planId, setPlanId] = useState(plans[0]?.id || "plan-trifit-regular-12m");
  const [trainerId, setTrainerId] = useState<string>("");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split("T")[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );
  const [fitnessGoal, setFitnessGoal] = useState<
    "Strength & Muscle" | "Fat Loss & Conditioning" | "Endurance & Stamina" | "Athletic Performance" | "Rehabilitation & Mobility"
  >("Strength & Muscle");
  const [fitnessLevel, setFitnessLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "Elite Athlete">("Intermediate");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("A valid email address is required.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg("A valid phone number is required.");
      return;
    }

    const newMember = addMember({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      cnic: cnic.trim(),
      gender,
      dob,
      address: address.trim() || "Karachi, Pakistan",
      emergencyContact: {
        name: emergencyName.trim() || "Emergency Contact",
        phone: emergencyPhone.trim(),
        relationship: emergencyRelationship,
      },
      branchId,
      planId,
      trainerId: trainerId && trainerId !== "NONE" ? trainerId : null,
      status: "ACTIVE",
      joiningDate,
      startDate,
      expiryDate,
      fitnessGoal,
      fitnessLevel,
      studio: "Strength Forge",
      lockerNumber: `L-${Math.floor(100 + Math.random() * 400)}`,
      avatar: gender === "Female"
        ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    });

    onClose();
    if (onMemberAdded) {
      onMemberAdded(newMember.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0D0D0B] text-text border border-slate-200 dark:border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent text-on-accent font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-extrabold text-text">Register New Member</h3>
              <p className="text-[11.5px] text-text-muted">TriFit Enterprise Member Enrollment Form</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-[12.5px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
            <div>
              <label className="block font-bold text-text mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Daniyal Siddiqui"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. daniyal@company.pk"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1">Phone Number (WhatsApp) *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-mono font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1">CNIC Number</label>
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="42101-0000000-0"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1">Gender</label>
              <ApolloSelect
                value={gender}
                onChange={(val) => setGender(val as any)}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
                className="w-full"
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <span className="text-[11.5px] font-bold text-accent uppercase tracking-wider block mb-2">
              Club Assignment & Plan
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
              <div>
                <label className="block font-bold text-text mb-1">Assigned Branch *</label>
                <ApolloSelect
                  value={branchId}
                  onChange={(val) => setBranchId(val)}
                  options={branches.map((b) => ({
                    value: b.id,
                    label: `${b.name} (${b.city})`,
                  }))}
                  searchable={true}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">Membership Plan *</label>
                <ApolloSelect
                  value={planId}
                  onChange={(val) => setPlanId(val)}
                  options={plans.map((p) => ({
                    value: p.id,
                    label: `${p.name} — PKR ${p.pricePKR.toLocaleString()}`,
                  }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">Assign Personal Trainer</label>
                <ApolloSelect
                  value={trainerId}
                  onChange={(val) => setTrainerId(val)}
                  options={[
                    { value: "NONE", label: "None (Self-Guided)" },
                    ...trainers.map((t) => ({
                      value: t.id,
                      label: `${t.name} — ${t.specialty}`,
                    })),
                  ]}
                  searchable={true}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">Primary Fitness Goal</label>
                <ApolloSelect
                  value={fitnessGoal}
                  onChange={(val) => setFitnessGoal(val as any)}
                  options={[
                    { value: "Strength & Muscle", label: "Strength & Muscle" },
                    { value: "Fat Loss & Conditioning", label: "Fat Loss & Conditioning" },
                    { value: "Endurance & Stamina", label: "Endurance & Stamina" },
                    { value: "Athletic Performance", label: "Athletic Performance" },
                    { value: "Rehabilitation & Mobility", label: "Rehabilitation & Mobility" },
                  ]}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <span className="text-[11.5px] font-bold text-accent uppercase tracking-wider block mb-2">
              Validity & Residence
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
              <div>
                <label className="block font-bold text-text mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-text mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Bungalow 42, DHA Phase 6, Karachi"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Imran Khan"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-mono"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-text-muted hover:text-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-accent text-on-accent text-[13px] font-bold shadow-md hover:bg-accent/90 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
