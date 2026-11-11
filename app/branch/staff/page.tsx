"use client";

import React, { useState, useMemo } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import { useApolloStore, Staff } from "@/lib/apollo-demo-store";
import {
  UserCog,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Trash2,
  Building2,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export default function BranchStaffPage() {
  const {
    branches,
    selectedBranch,
    staff,
    addStaff,
    updateStaff,
    deleteStaff,
  } = useApolloStore();

  const activeBranch = selectedBranch || branches[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [shiftFilter, setShiftFilter] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Operations Officer" as Staff["role"],
    shift: "Morning (06:00 - 14:00)" as Staff["shift"],
    status: "ACTIVE" as Staff["status"],
  });

  const branchStaff = useMemo(() => {
    return staff.filter((s) => s.branchId === activeBranch.id);
  }, [staff, activeBranch.id]);

  const filteredStaff = useMemo(() => {
    return branchStaff.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchShift = shiftFilter === "ALL" || s.shift.startsWith(shiftFilter);
      return matchSearch && matchShift;
    });
  }, [branchStaff, searchQuery, shiftFilter]);

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addStaff({
      ...formData,
      branchId: activeBranch.id,
      joinDate: new Date().toISOString().slice(0, 10),
    });

    setShowAddModal(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Operations Officer",
      shift: "Morning (06:00 - 14:00)",
      status: "ACTIVE",
    });
  };

  return (
    <BranchPortalLayout activeItem="staff">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <UserCog className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Branch Staff & Shift Schedule</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {branchStaff.length} Team Members • {activeBranch.name}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Manage front desk officers, floor supervisors, and maintenance technicians for this club
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="h-9 px-3.5 bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] dark:hover:bg-[#f5cf12] text-slate-950 font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff Member</span>
            </button>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="glass-panel p-4 rounded-[18px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, role, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-[10px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[12.5px] focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(["ALL", "Morning", "Evening", "Full Day"] as const).map((sh) => (
              <button
                key={sh}
                onClick={() => setShiftFilter(sh)}
                className={`px-3 py-1.5 rounded-[9px] text-[11px] font-bold transition-all whitespace-nowrap ${
                  shiftFilter === sh
                    ? "bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-black"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400"
                }`}
              >
                {sh} Shifts
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              className="glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-[16px] font-[800] text-slate-900 dark:text-white">
                      {member.name}
                    </h4>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-[#FFD91C]">
                      {member.role}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      member.status === "ACTIVE"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11.5px] text-slate-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-neutral-200">
                      Shift: {member.shift}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Joined {member.joinDate}</span>
                <button
                  onClick={() => deleteStaff(member.id)}
                  className="p-1.5 rounded-[8px] hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Remove staff member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Staff Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel p-6 rounded-[24px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-[17px] font-[800] text-slate-900 dark:text-white">
                  Add Club Staff Member
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-3.5 text-[12.5px]">
                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                      Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Operational Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    <option value="Operations Officer">Operations Officer</option>
                    <option value="Front Desk Lead">Front Desk Lead</option>
                    <option value="Assistant Manager">Assistant Manager</option>
                    <option value="Maintenance Lead">Maintenance Lead</option>
                    <option value="Nutritionist">Nutritionist</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Assigned Shift
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                    <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-[10px] border border-slate-200 dark:border-white/10 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-[10px] bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-black shadow-sm"
                  >
                    Save Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BranchPortalLayout>
  );
}
