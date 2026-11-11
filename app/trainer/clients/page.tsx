"use client";

import React, { useState, useMemo } from "react";
import { TrainerPortalLayout } from "@/components/layout/TrainerPortalLayout";
import { useApolloStore, Member } from "@/lib/apollo-demo-store";
import { MemberDetailModal } from "@/components/members/MemberDetailModal";
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  Search,
  UserCheck,
  UserX,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Phone,
  MessageSquare,
  Activity,
  Check,
  Sliders,
  Award,
} from "lucide-react";
import Link from "next/link";
import { ApolloSelect } from "@/components/ui/ApolloSelect";
import { StatCard } from "@/components/ui/StatCard";

export default function TrainerClientsPage() {
  const {
    members,
    trainers,
    plans,
    assignTrainerToMember,
    checkInMember,
  } = useApolloStore();

  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("tr-tariq");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberForModal, setSelectedMemberForModal] = useState<Member | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Incoming Demo Requests that trainers can accept
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: "req-1",
      name: "Saad Farooqi",
      phone: "+92 300 4491002",
      planName: "Platinum Pro Membership",
      requestedGoal: "Post-rehab lumbar spine & hamstring mobility",
      slot: "07:00 AM Mornings",
    },
    {
      id: "req-2",
      name: "Maryam Jahangir",
      phone: "+92 322 1144990",
      planName: "Black Diamond VIP",
      requestedGoal: "Lean muscle recomposition & wedding shape-up in 90 days",
      slot: "06:00 PM Evenings",
    },
  ]);

  const activeTrainer = useMemo(() => {
    return trainers.find((t) => t.id === selectedTrainerId) || trainers[0];
  }, [trainers, selectedTrainerId]);

  // Clients assigned to selected coach
  const assignedClients = useMemo(() => {
    const list = selectedTrainerId === "all"
      ? members.filter((m) => m.trainerId !== null)
      : members.filter((m) => m.trainerId === selectedTrainerId);

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.memberCode.toLowerCase().includes(q)
    );
  }, [members, selectedTrainerId, searchQuery]);

  const showNotice = (text: string) => {
    setActionNotice(text);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleAcceptRequest = (req: typeof incomingRequests[0]) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== req.id));
    // Find unassigned member or assign first eligible
    const unassigned = members.find((m) => !m.trainerId);
    if (unassigned && selectedTrainerId !== "all") {
      assignTrainerToMember(unassigned.id, selectedTrainerId);
    }
    showNotice(`Accepted ${req.name}! PT client allocation verified and synced.`);
  };

  const handleDeclineRequest = (id: string, name: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== id));
    showNotice(`Declined request from ${name}. Re-routed to Head of Fitness.`);
  };

  const handleQuickLogSession = (member: Member) => {
    checkInMember(member.id, "PT Studio A (1-on-1)", "MANUAL_DESK");
    showNotice(`1-on-1 PT Session logged for ${member.name}. Turnstile & quota updated.`);
  };

  return (
    <TrainerPortalLayout activeItem="clients">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>My PT Clients & Performance</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {selectedTrainerId === "all" ? "All Coaches Combined" : activeTrainer?.name}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Manage client body recomposition journeys, log 1-on-1 training sessions, and review InBody assessments
            </span>
          </div>

          {/* Coach Switcher Dropdown */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Coach:
              </span>
              <ApolloSelect
                value={selectedTrainerId}
                onChange={(val) => setSelectedTrainerId(val)}
                options={[
                  { value: "all", label: "-- All Coaches Across Network --" },
                  ...trainers.map((t) => ({
                    value: t.id,
                    label: `${t.name} (${t.specialty})`,
                  })),
                ]}
                searchable={true}
                size="sm"
                className="w-full sm:w-auto min-w-[200px]"
              />
            </div>

            <Link
              href="/trainer/planner"
              className="h-9 px-3.5 bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] dark:hover:bg-[#f5cf12] text-slate-950 font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Workout Planner</span>
            </Link>
          </div>
        </div>

        {/* Global Notification */}
        {actionNotice && (
          <div className="p-3.5 rounded-[14px] bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-[#FFD91C] text-[12.5px] font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 4 Compact Operational KPIs — High Density */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <StatCard
            title="Assigned PT Clients"
            numericValue={assignedClients.length}
            icon={Users}
            variant="warning"
            sparklineData={[4, 5, 5, 6, 7, assignedClients.length]}
            sparklineColor="#FFD91C"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                Active Roster
              </span>
            }
            footerRight="1-on-1 coaching"
          />

          <StatCard
            title="Pending Requests"
            numericValue={incomingRequests.length}
            icon={Sparkles}
            variant="warning"
            sparklineData={[1, 2, 2, 1, 3, incomingRequests.length]}
            sparklineColor="#F59E0B"
            footerLeft={
              <span className="font-semibold text-amber-600 dark:text-[#FFD91C]">
                Mobile Inbound
              </span>
            }
            footerRight="Needs response"
          />

          <StatCard
            title="InBody Scans"
            numericValue={assignedClients.filter((c) => c.status === "ACTIVE").length}
            icon={Activity}
            variant="warning"
            sparklineData={[3, 4, 4, 5, assignedClients.filter((c) => c.status === "ACTIVE").length]}
            sparklineColor="#FBBF24"
            footerLeft={
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Verified
              </span>
            }
            footerRight="Bio-impedance"
          />

          <StatCard
            title="Session Completion"
            value="96.4%"
            icon={Dumbbell}
            variant="warning"
            trend={{
              value: "+2.1%",
              isPositive: true,
            }}
            sparklineData={[91, 93, 94, 95, 96.4]}
            sparklineColor="#EAB308"
            footerRight="On-time attendance"
          />
        </div>

        {/* Section 1: Incoming Match Requests */}
        {incomingRequests.length > 0 && (
          <div className="glass-panel p-5 rounded-[22px] bg-amber-500/[0.04] border border-amber-500/30 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-[800] text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-[#FFD91C]" />
                  <span>Incoming Personal Training Match Requests</span>
                </h3>
                <p className="text-[12px] text-slate-500 dark:text-neutral-400">
                  Members who selected you at reception or via the Apollo mobile app.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10.5px] font-black uppercase bg-amber-400 text-slate-950">
                {incomingRequests.length} PENDING MATCHES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-[16px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-3 shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[14px] text-slate-900 dark:text-white">
                        {req.name}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-[#FFD91C]">
                        {req.planName}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">{req.phone}</div>
                    <div className="text-[12px] text-slate-700 dark:text-neutral-300 bg-slate-50 dark:bg-white/[0.03] p-2 rounded-[10px] border border-slate-200 dark:border-white/5">
                      🎯 {req.requestedGoal}
                    </div>
                    <div className="text-[11px] text-amber-600 dark:text-[#FFD91C] font-bold">
                      ⏰ Preferred Slot: {req.slot}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => handleDeclineRequest(req.id, req.name)}
                      className="py-1.5 rounded-[9px] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-400 hover:text-rose-500 font-bold text-[11.5px]"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="py-1.5 rounded-[9px] bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-black text-[11.5px] hover:bg-amber-300 shadow-sm"
                    >
                      Accept Client
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Active Clients Roster */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-[18px] font-[900] text-slate-900 dark:text-white">
                Assigned Client Roster ({assignedClients.length})
              </h3>
              <p className="text-[12.5px] text-slate-500 dark:text-neutral-400">
                Tracking training frequency, biometric body scans, and scheduled check-ins.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by client name, code, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-[12px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[12px] focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {assignedClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedClients.map((client) => {
                const plan = plans.find((p) => p.id === client.planId);
                const coach = trainers.find((t) => t.id === client.trainerId);

                return (
                  <div
                    key={client.id}
                    className="glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-colors"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-12 h-12 rounded-[14px] object-cover border border-amber-400/40"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-[15px] font-[800] text-slate-900 dark:text-white leading-tight">
                                {client.name}
                              </h4>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">
                              {client.memberCode} • {client.gender}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400/20 text-amber-700 dark:text-[#FFD91C] border border-amber-400/40">
                          {plan?.name.replace(" Membership", "") || "VIP"}
                        </span>
                      </div>

                      {/* Goal Badge */}
                      <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-[10px] font-extrabold uppercase text-slate-400">
                          Primary Transformation Goal
                        </div>
                        <div className="text-[12px] font-bold text-slate-800 dark:text-neutral-200">
                          🎯 {client.fitnessGoal} ({client.fitnessLevel})
                        </div>
                      </div>

                      {/* Frequency & BioScans */}
                      <div className="grid grid-cols-3 gap-2 text-center pt-3 text-[11px]">
                        <div className="p-2 rounded-[10px] bg-slate-100 dark:bg-white/5">
                          <span className="text-slate-400 text-[10px] block">CHECK-INS</span>
                          <span className="text-[14px] font-black text-slate-900 dark:text-white font-mono">
                            {client.totalCheckins}
                          </span>
                        </div>
                        <div className="p-2 rounded-[10px] bg-slate-100 dark:bg-white/5">
                          <span className="text-slate-400 text-[10px] block">3D SCANS</span>
                          <span className="text-[14px] font-black text-amber-600 dark:text-[#FFD91C] font-mono">
                            {client.bioScanCount}
                          </span>
                        </div>
                        <div className="p-2 rounded-[10px] bg-slate-100 dark:bg-white/5">
                          <span className="text-slate-400 text-[10px] block">LOCKER</span>
                          <span className="text-[14px] font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            #{client.lockerNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedMemberForModal(client)}
                          className="py-1.5 rounded-[10px] bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-[11.5px] transition-all"
                        >
                          View 11-Tab Profile
                        </button>
                        <button
                          onClick={() => handleQuickLogSession(client)}
                          className="py-1.5 rounded-[10px] bg-amber-400 dark:bg-[#FFD91C] hover:bg-amber-300 text-slate-950 font-black text-[11.5px] transition-all shadow-sm"
                        >
                          Log Session
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400 px-1">
                        <span>Coach: {coach?.name || "Unassigned"}</span>
                        <Link
                          href="/trainer/chat"
                          className="text-amber-600 dark:text-[#FFD91C] font-bold hover:underline"
                        >
                          Message
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-[22px] border border-slate-200 dark:border-white/10 space-y-3">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-[15px] font-bold text-slate-800 dark:text-neutral-200">
                No Clients Assigned for Selected Filter
              </div>
              <p className="text-[12.5px] text-slate-500 max-w-sm mx-auto">
                Select a different coach or check the incoming match requests to assign new personal training clients.
              </p>
            </div>
          )}
        </div>

        {/* 11-Tab Member Profile Modal */}
        {selectedMemberForModal && (
          <MemberDetailModal
            member={selectedMemberForModal}
            isOpen={true}
            onClose={() => setSelectedMemberForModal(null)}
          />
        )}
      </div>
    </TrainerPortalLayout>
  );
}
