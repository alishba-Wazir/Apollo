"use client";

import React, { useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore, Branch } from "@/lib/apollo-demo-store";
import { StatCard } from "@/components/ui/StatCard";
import { useRouter } from "next/navigation";
import {
  Globe,
  Building2,
  Users,
  Dumbbell,
  Wrench,
  TrendingUp,
  MapPin,
  Clock,
  Phone,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Activity,
  Layers,
  ChevronRight,
  Moon,
  Plus,
  Trash2,
  Edit2,
  Mail,
} from "lucide-react";

export default function AdminNetworkPage() {
  const router = useRouter();
  const {
    branches,
    members,
    trainers,
    payments,
    currentBranchId,
    setCurrentBranchId,
    addBranch,
    updateBranch,
    deleteBranch,
  } = useApolloStore();

  const [selectedBranchModal, setSelectedBranchModal] = useState<Branch | null>(null);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [city, setCity] = useState("Karachi");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState(350);
  const [type, setType] = useState("Mixed Premium Flagship");
  const [hours, setHours] = useState("06:00 - 23:00 PKT");
  const [whatsappNumber, setWhatsappNumber] = useState("+92 300 ");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [equipmentCount, setEquipmentCount] = useState(50);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setName("");
    setCity("Karachi");
    setArea("");
    setAddress("");
    setCapacity(350);
    setType("Mixed Premium Flagship");
    setHours("06:00 - 23:00 PKT");
    setWhatsappNumber("+92 300 8271000");
    setManagerName("");
    setManagerEmail("");
    setEquipmentCount(50);
    setIsAddBranchModalOpen(true);
  };

  const handleOpenEdit = (b: Branch) => {
    setEditingBranch(b);
    setName(b.name);
    setCity(b.city);
    setArea(b.area);
    setAddress(b.address);
    setCapacity(b.capacity);
    setType(b.type);
    setHours(b.hours);
    setWhatsappNumber(b.whatsappNumber);
    setManagerName(b.managerName);
    setManagerEmail(b.managerEmail);
    setEquipmentCount(b.equipmentCount);
    setIsAddBranchModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBranch) {
      updateBranch(editingBranch.id, {
        name,
        city,
        area,
        address,
        capacity: Number(capacity),
        type,
        hours,
        whatsappNumber,
        managerName,
        managerEmail,
        equipmentCount: Number(equipmentCount),
      });
      showToast(`Updated details for ${name}`);
    } else {
      addBranch({
        name,
        city,
        area,
        address,
        capacity: Number(capacity),
        type,
        hours,
        whatsappNumber,
        managerName: managerName || "Assigned Manager",
        managerEmail: managerEmail || "manager@trifit.com.pk",
        equipmentCount: Number(equipmentCount),
        status: "ACTIVE",
      });
      showToast(`Created new branch: ${name}!`);
    }
    setIsAddBranchModalOpen(false);
  };

  const handleDelete = () => {
    if (!branchToDelete) return;
    deleteBranch(branchToDelete.id);
    showToast(`Deleted ${branchToDelete.name}. Members safely reassigned.`);
    setBranchToDelete(null);
  };

  return (
    <AdminPortalLayout activeItem="network">
      <div className="space-y-5">
        
        {/* Unboxed Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)] tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Branch Management</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--text)] border border-[var(--accent)]/30">
                {branches.length} Clubs Operational
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Multi-branch locations, GM assignments, and facility capacity
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="btn primary text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Branch</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-3.5 rounded-2xl bg-[var(--chip)] border border-[var(--accent)]/40 text-[var(--text)] text-[13px] font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 4 Compact Network Overview KPIs — Canonical Executive Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Operational Network"
            value="4 Clubs"
            icon={Building2}
            variant="warning"
            sparklineData={[3, 4, 4, 4, 4]}
            sparklineColor="#FFD60A"
            footerLeft={
              <span className="font-semibold text-[var(--accent)]">
                Karachi & Islamabad
              </span>
            }
            footerRight="Flagships"
          />

          <StatCard
            title="Consolidated Members"
            value="5,124 Active"
            icon={Users}
            variant="warning"
            trend={{
              value: "+8.4%",
              isPositive: true,
            }}
            sparklineData={[4200, 4500, 4800, 5000, 5124]}
            sparklineColor="#FFD60A"
            footerRight="5,440 Enrolled"
          />

          <StatCard
            title="Coaching Roster"
            value="48 Coaches"
            icon={Dumbbell}
            variant="warning"
            sparklineData={[38, 42, 44, 46, 48]}
            sparklineColor="#FFD60A"
            footerLeft={
              <span className="font-semibold text-[var(--text)]">
                REPs Certified
              </span>
            }
            footerRight="Floor & PT"
          />

          <StatCard
            title="Network Gross Collections"
            value="PKR 82.4M"
            icon={TrendingUp}
            variant="warning"
            trend={{
              value: "+14.2%",
              isPositive: true,
              label: "MoM",
            }}
            sparklineData={[68.5, 72.8, 76.2, 79.5, 82.4]}
            sparklineColor="#FFD60A"
            footerRight="Dues + PT + Fuel"
          />
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
          {branches.map((b) => {
            const isCurrentScope = currentBranchId === b.id;
            
            // Hard-bind to official TriFit network metrics
            let branchMembersCount = 1441;
            let branchRevenueFormatted = "PKR 28.0M";
            let branchTrainersCount = 16;
            let branchCapacity = 450;

            if (b.name.includes("Clifton")) {
              branchMembersCount = 1330;
              branchRevenueFormatted = "PKR 21.4M";
              branchTrainersCount = 12;
              branchCapacity = 320;
            } else if (b.name.includes("AJ Tower") || b.name.includes("Islamabad")) {
              branchMembersCount = 1127;
              branchRevenueFormatted = "PKR 18.1M";
              branchTrainersCount = 10;
              branchCapacity = 380;
            } else if (b.name.includes("LuckyOne")) {
              branchMembersCount = 1226;
              branchRevenueFormatted = "PKR 14.9M";
              branchTrainersCount = 10;
              branchCapacity = 350;
            }

            return (
              <div
                key={b.id}
                className={`glass p-5 rounded-3xl transition-all flex flex-col justify-between relative group ${
                  isCurrentScope
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30 shadow-[0_10px_35px_rgba(255,214,10,0.15)]"
                    : "hover:border-[var(--accent)]/50"
                }`}
              >
                {/* Active Scope Pill */}
                {isCurrentScope && (
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--on-accent)] text-[9.5px] font-extrabold uppercase tracking-wider shadow-md">
                    Selected Scope
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-[16px] text-[var(--text)] leading-snug">
                          {b.name}
                        </h3>
                        <div className="text-[11.5px] font-bold text-[var(--accent)] mt-0.5">
                          {b.area}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full chip">
                      {b.city}
                    </span>
                    <span className="text-[10.5px] text-[var(--muted)]">•</span>
                    <span className="text-[10.5px] text-[var(--muted)] truncate">{b.type}</span>
                  </div>

                  <div className="text-[11.5px] text-[var(--muted)] flex items-start gap-1.5 mb-3.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{b.address}</span>
                  </div>

                  {/* Branch Metrics */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-black/15 dark:bg-black/35 border border-[var(--card-border)] text-[11.5px] mb-3.5">
                    <div>
                      <span className="text-[var(--muted)] text-[10px] font-bold tracking-wider block">ACTIVE MEMBERS</span>
                      <span className="text-[15px] font-bold font-display text-[var(--text)]">
                        {branchMembersCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--muted)] text-[10px] font-bold tracking-wider block">MONTHLY REV</span>
                      <span className="text-[15px] font-bold font-display text-[var(--accent)]">
                        {branchRevenueFormatted}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--muted)] text-[10px] font-bold tracking-wider block">COACHES</span>
                      <span className="text-[13px] font-semibold text-[var(--text)]">
                        {branchTrainersCount} Coaches
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--muted)] text-[10px] font-bold tracking-wider block">PEAK HOURLY</span>
                      <span className="text-[13px] font-semibold text-[var(--text)]">
                        {branchCapacity} Cap
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[var(--muted)] mb-3 flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-[var(--accent)] shrink-0" />
                    <span>Manager: {b.managerName}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[var(--line)] flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBranchModal(b)}
                    className="btn text-xs font-bold !h-9 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentBranchId(b.id);
                      showToast(`Switched active scope to ${b.name}`);
                      router.push("/admin");
                    }}
                    className="btn primary text-xs font-bold !h-9 px-4 flex items-center justify-center gap-1 cursor-pointer"
                    title="Scope Dashboard to this Branch"
                  >
                    Manage
                  </button>

                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition-colors cursor-pointer"
                    title="Edit Branch"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {branches.length > 1 && (
                    <button
                      onClick={() => setBranchToDelete(b)}
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Branch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Add / Edit Branch Modal */}
      {isAddBranchModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsAddBranchModalOpen(false)} />
          <div className="relative w-full max-w-xl glass text-[var(--text)] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-[16px] font-bold text-text">
                {editingBranch ? "Edit Branch Location" : "Add TriFit Branch Club"}
              </h3>
              <button onClick={() => setIsAddBranchModalOpen(false)} className="text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-[12.5px]">
              <div>
                <label className="block font-bold text-text mb-1">Branch Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. TriFit Gulberg Heights — Lahore"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-bold"
                  >
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">Area / Neighborhood</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. DHA Phase 6"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-text mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Complete physical location..."
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">Max Member Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">Branch General Manager</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. Kamran Akram"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">Manager Email</label>
                  <input
                    type="email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="e.g. manager@trifit.com.pk"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">WhatsApp Concierge Phone</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">Connected Equipment Units</label>
                  <input
                    type="number"
                    value={equipmentCount}
                    onChange={(e) => setEquipmentCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddBranchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-text-muted hover:text-text font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent text-on-accent font-bold shadow-md hover:bg-accent/90"
                >
                  {editingBranch ? "Save Changes" : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Branch Confirmation Modal */}
      {branchToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md glass text-[var(--text)] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl">
            <h3 className="text-[17px] font-bold text-text">Confirm Branch Deletion?</h3>
            <p className="text-[13px] text-text-muted mt-2">
              Are you sure you want to delete <strong className="text-accent">{branchToDelete.name}</strong>?
              All registered members and trainers at this branch will be safely reassigned to the Seaview Flagship club.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setBranchToDelete(null)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-text-muted hover:text-text"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-[13px] hover:bg-rose-600"
              >
                Delete Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Branch Modal */}
      {selectedBranchModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setSelectedBranchModal(null)} />
          <div className="relative w-full max-w-2xl glass text-[var(--text)] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBranchModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text hover:bg-black/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-[20px] font-extrabold text-text">{selectedBranchModal.name}</h2>
                <div className="text-[13px] font-bold text-accent">{selectedBranchModal.area} • {selectedBranchModal.city}</div>
                <p className="text-[12px] text-text-muted mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{selectedBranchModal.address}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] my-4 text-[12px]">
              <div>
                <span className="text-text-muted block text-[10.5px]">ACTIVE MEMBERS</span>
                <span className="text-[18px] font-black text-text">
                  {members.filter((m) => m.branchId === selectedBranchModal.id).length}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10.5px]">CERTIFIED TRAINERS</span>
                <span className="text-[18px] font-black text-accent">
                  {trainers.filter((t) => t.branchId === selectedBranchModal.id).length}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10.5px]">MAX CAPACITY</span>
                <span className="text-[18px] font-black text-text">
                  {selectedBranchModal.capacity} Members
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10.5px]">EQUIPMENT SENSORS</span>
                <span className="text-[18px] font-black text-emerald-500">
                  {selectedBranchModal.equipmentCount} Units
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-[12.5px] p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)]">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-muted">General Manager:</span>
                <span className="font-bold text-text">{selectedBranchModal.managerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-muted">Manager Email:</span>
                <span className="font-semibold text-text">{selectedBranchModal.managerEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-muted">WhatsApp Concierge:</span>
                <span className="font-mono font-bold text-accent">{selectedBranchModal.whatsappNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Operating Hours:</span>
                <span className="font-mono text-text">{selectedBranchModal.hours}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-border mt-5">
              <button
                onClick={() => setSelectedBranchModal(null)}
                className="px-4 py-2 rounded-xl text-[12.5px] font-semibold text-text-muted hover:text-text"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setCurrentBranchId(selectedBranchModal.id);
                  setSelectedBranchModal(null);
                  router.push("/branch/today");
                }}
                className="px-5 py-2.5 rounded-xl bg-accent text-on-accent text-[12.5px] font-bold shadow-md hover:bg-accent/90 flex items-center gap-2"
              >
                <span>Open Branch Workspace</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPortalLayout>
  );
}
