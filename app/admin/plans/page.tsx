"use client";

import React, { useState, useMemo } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore, MembershipPlan } from "@/lib/apollo-demo-store";
import {
  Ticket,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  Check,
  Crown,
  Dumbbell,
  ShieldCheck,
  ArrowUpRight,
  Flame,
  Users,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

type PlanCategoryFilter = "all" | "Regular" | "Plus";

export default function AdminPlansPage() {
  const { plans, addPlan, updatePlan, deletePlan, togglePlanActive, members } = useApolloStore();

  const [activeCategory, setActiveCategory] = useState<PlanCategoryFilter>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [tier, setTier] = useState<MembershipPlan["tier"]>("STANDARD");
  const [category, setCategory] = useState<"Regular" | "Plus" | "Special">("Regular");
  const [pricePKR, setPricePKR] = useState(52999);
  const [durationMonths, setDurationMonths] = useState(3);
  const [monthlyEquivalentPKR, setMonthlyEquivalentPKR] = useState(17666);
  const [badge, setBadge] = useState("");
  const [includesSummary, setIncludesSummary] = useState("Multi-Gym Access, Guest Passes, and Sauna & Steam");
  const [description, setDescription] = useState("");
  const [facilitiesStr, setFacilitiesStr] = useState("Multi-Gym Access (All Branches), Guest Passes Included, Sauna & Steam Access, Standard Locker Room");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [renewalGraceDays, setRenewalGraceDays] = useState(7);
  const [isActive, setIsActive] = useState(true);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredPlans = useMemo(() => {
    if (activeCategory === "all") return plans;
    return plans.filter((p) => p.category === activeCategory);
  }, [plans, activeCategory]);

  const regularPlansCount = plans.filter((p) => p.category === "Regular").length;
  const plusPlansCount = plans.filter((p) => p.category === "Plus").length;

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setName("TriFit Regular (3 Months)");
    setCode("TF-REG-3M");
    setTier("STANDARD");
    setCategory("Regular");
    setPricePKR(52999);
    setDurationMonths(3);
    setMonthlyEquivalentPKR(17666);
    setBadge("");
    setIncludesSummary("Multi-Gym Access, Guest Passes, and Sauna & Steam");
    setDescription("3 Months Operating — Multi-Gym access across all clubs with guest passes and sauna & steam recovery.");
    setFacilitiesStr("Multi-Gym Access (All Branches), Guest Passes Included, Sauna & Steam Access, Standard Locker Room");
    setDiscountPercent(0);
    setRenewalGraceDays(7);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: MembershipPlan) => {
    setEditingPlan(p);
    setName(p.name);
    setCode(p.code);
    setTier(p.tier);
    setCategory(p.category || "Regular");
    setPricePKR(p.pricePKR);
    setDurationMonths(p.durationMonths);
    setMonthlyEquivalentPKR(p.monthlyEquivalentPKR || Math.round(p.pricePKR / p.durationMonths));
    setBadge(p.badge || "");
    setIncludesSummary(p.includesSummary || "");
    setDescription(p.description);
    setFacilitiesStr(p.includedFacilities.join(", "));
    setDiscountPercent(p.discountPercent);
    setRenewalGraceDays(p.renewalGraceDays);
    setIsActive(p.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facilities = facilitiesStr.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingPlan) {
      updatePlan(editingPlan.id, {
        name,
        code,
        tier,
        category,
        pricePKR: Number(pricePKR),
        durationMonths: Number(durationMonths),
        monthlyEquivalentPKR: Number(monthlyEquivalentPKR),
        badge: badge.trim() || undefined,
        includesSummary: includesSummary.trim() || undefined,
        description,
        includedFacilities: facilities,
        discountPercent: Number(discountPercent),
        renewalGraceDays: Number(renewalGraceDays),
        isActive,
      });
      showToast(`Updated membership plan: ${name}`);
    } else {
      addPlan({
        name,
        code,
        tier,
        category,
        pricePKR: Number(pricePKR),
        durationMonths: Number(durationMonths),
        monthlyEquivalentPKR: Number(monthlyEquivalentPKR),
        badge: badge.trim() || undefined,
        includesSummary: includesSummary.trim() || undefined,
        description,
        includedFacilities: facilities,
        discountPercent: Number(discountPercent),
        renewalGraceDays: Number(renewalGraceDays),
        isActive,
      });
      showToast(`Created new membership plan: ${name}`);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminPortalLayout activeItem="plans">
      <div className="space-y-6">
        
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-[var(--text)] tracking-tight flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>TriFit Membership Plans & Packages</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--text)] border border-[var(--accent)]/30">
                {plans.filter(p => p.isActive).length} Active Packages
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Official TriFit Regular & Plus tiers across 3, 6, and 12-month operating options
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenAdd}
              className="btn primary text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Plan</span>
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

        {/* Overview KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Total Active Plans"
            numericValue={plans.filter((p) => p.isActive).length}
            valueSuffix=" Packages"
            icon={Ticket}
            variant="warning"
            sparklineData={[4, 5, 6, 6, plans.length]}
            sparklineColor="#FFD60A"
            footerLeft={<span className="font-semibold text-[var(--accent)]">Official TriFit Catalog</span>}
            footerRight="Active Tiers"
          />

          <StatCard
            title="Regular Plans"
            numericValue={regularPlansCount}
            valueSuffix=" Options"
            icon={Dumbbell}
            variant="warning"
            sparklineData={[3, 3, 3, 3]}
            sparklineColor="#FFD60A"
            footerLeft={<span className="font-semibold text-[var(--muted)]">3M • 6M • 12M</span>}
            footerRight="Multi-Gym & Sauna"
          />

          <StatCard
            title="Plus Plans"
            numericValue={plusPlansCount}
            valueSuffix=" Options"
            icon={Crown}
            variant="warning"
            sparklineData={[3, 3, 3, 3]}
            sparklineColor="#FFD60A"
            footerLeft={<span className="font-semibold text-[var(--accent)]">Personal Training</span>}
            footerRight="Unlimited Guests"
          />

          <StatCard
            title="Total Enrolled Members"
            numericValue={members.length}
            icon={Users}
            variant="warning"
            trend={{
              value: "+16.8%",
              isPositive: true,
              label: "MoM",
            }}
            sparklineData={[24, 28, 30, 32, members.length]}
            sparklineColor="#FFD60A"
            footerRight="Across 4 Clubs"
          />
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`btn sm text-xs font-bold transition-all ${
              activeCategory === "all" ? "primary" : ""
            }`}
          >
            <span>All Packages ({plans.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory("Regular")}
            className={`btn sm text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === "Regular" ? "primary" : ""
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>🏋️ TriFit Regular Plans (3 Options)</span>
          </button>

          <button
            onClick={() => setActiveCategory("Plus")}
            className={`btn sm text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === "Plus" ? "primary" : ""
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>👑 TriFit Plus Plans (3 Options)</span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPlans.map((p) => {
            const isPlus = p.category === "Plus" || p.tier === "VIP";
            const isPopular = Boolean(p.badge);
            const monthlyCost = p.monthlyEquivalentPKR || Math.round(p.pricePKR / p.durationMonths);

            return (
              <div
                key={p.id}
                className={`glass p-6 rounded-3xl transition-all flex flex-col justify-between relative group ${
                  isPopular
                    ? "border-[var(--accent)] shadow-[0_12px_40px_rgba(255,214,10,0.18)]"
                    : "hover:border-[var(--accent)]/50"
                } ${!p.isActive ? "opacity-60" : ""}`}
              >
                {/* Popular / Best Value Top Badge */}
                {p.badge && (
                  <div className="absolute -top-3 right-5 px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--on-accent)] text-[10px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{p.badge}</span>
                  </div>
                )}

                <div>
                  {/* Top Meta Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--btn-bg)] border border-[var(--btn-border)] text-[var(--accent)]">
                        {p.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full chip">
                        {p.durationMonths} Months Operating
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => togglePlanActive(p.id)}
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                          p.isActive
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-neutral-500/20 text-[var(--muted)]"
                        }`}
                        title="Toggle Active State"
                      >
                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition-colors cursor-pointer"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deletePlan(p.id);
                          showToast(`Deleted plan: ${p.name}`);
                        }}
                        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Plan Name & Inclusions Header */}
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      {isPlus ? (
                        <Crown className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      ) : (
                        <Dumbbell className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      )}
                      <h3 className="font-display font-bold text-[19px] text-[var(--text)] leading-snug">
                        {p.name}
                      </h3>
                    </div>

                    {p.includesSummary && (
                      <div className="mt-2 p-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[11px] text-[var(--muted)]">
                        <strong className="text-[var(--text)] block mb-0.5">Includes:</strong>
                        <span>{p.includesSummary}</span>
                      </div>
                    )}

                    <p className="text-[12px] text-[var(--muted)] mt-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Pricing Box (Space Grotesk 700 + Upfront & Monthly breakdown) */}
                  <div className="my-4 p-4 rounded-2xl bg-[var(--btn-bg)] border border-[var(--card-border)] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">
                        Upfront Package Price
                      </div>
                      <div className="font-display font-bold text-[24px] sm:text-[26px] text-[var(--accent)] leading-tight tracking-tight">
                        PKR {p.pricePKR.toLocaleString()}
                        <span className="text-xs text-[var(--muted)] font-normal ml-1">upfront</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">
                        Monthly Pace
                      </div>
                      <div className="text-[13px] font-bold text-[var(--text)] font-display">
                        PKR {monthlyCost.toLocaleString()}
                        <span className="text-[10px] text-[var(--muted)] font-normal"> / mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities Checklist */}
                  <div className="space-y-2 text-[12px] mb-2">
                    <span className="text-[10px] font-bold uppercase text-[var(--muted)] tracking-wider block">
                      Included In This Membership:
                    </span>
                    {p.includedFacilities.map((fac, i) => (
                      <div key={i} className="flex items-start gap-2 text-[var(--text)]">
                        <div className="w-4 h-4 rounded-full bg-[var(--chip)] text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-tight text-[12px]">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Metadata & Subscribe Action */}
                <div className="mt-5 pt-3 border-t border-[var(--line)] flex items-center justify-between">
                  <div className="text-[11px] text-[var(--muted)] font-mono">
                    <span>Grace: {p.renewalGraceDays}d</span>
                    {p.discountPercent > 0 && (
                      <span className="ml-2 text-[var(--accent)] font-bold">-{p.discountPercent}% OFF</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="btn primary sm text-xs font-bold"
                  >
                    <span>Manage Package</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Add / Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg glass p-6 rounded-3xl z-10 shadow-2xl border border-[var(--card-border)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="font-display font-bold text-[18px] text-[var(--text)]">
                {editingPlan ? "Edit TriFit Membership Package" : "Create TriFit Membership Package"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-[12.5px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Package Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. TriFit Regular (3 Months)"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] font-bold focus:outline-none focus:border-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. TF-REG-3M"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] font-mono font-bold focus:outline-none focus:border-[var(--accent)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] font-bold focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Plus">Plus (VIP)</option>
                    <option value="Special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Upfront Price (PKR)</label>
                  <input
                    type="number"
                    value={pricePKR}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPricePKR(val);
                      if (durationMonths > 0) {
                        setMonthlyEquivalentPKR(Math.round(val / durationMonths));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--accent)] font-black focus:outline-none focus:border-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Duration (Months)</label>
                  <select
                    value={durationMonths}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      setDurationMonths(m);
                      if (m > 0 && pricePKR > 0) {
                        setMonthlyEquivalentPKR(Math.round(pricePKR / m));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] font-bold focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Monthly Equivalent (PKR)</label>
                  <input
                    type="number"
                    value={monthlyEquivalentPKR}
                    onChange={(e) => setMonthlyEquivalentPKR(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] font-bold focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Highlight Badge (Optional)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Most Popular / Best Value"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Inclusions Summary</label>
                <input
                  type="text"
                  value={includesSummary}
                  onChange={(e) => setIncludesSummary(e.target.value)}
                  placeholder="e.g. Multi-Gym Access, Guest Passes, and Sauna & Steam"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">Full Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] text-[12px] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] mb-1">
                  Included Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={facilitiesStr}
                  onChange={(e) => setFacilitiesStr(e.target.value)}
                  placeholder="e.g. Multi-Gym Access, Guest Passes, Sauna & Steam"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] text-[12px] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Renewal Grace Period (Days)</label>
                  <input
                    type="number"
                    value={renewalGraceDays}
                    onChange={(e) => setRenewalGraceDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text)] mb-1">Incentive Discount (%)</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--btn-bg)] border border-[var(--card-border)] text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary sm text-xs font-bold"
                >
                  {editingPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPortalLayout>
  );
}
