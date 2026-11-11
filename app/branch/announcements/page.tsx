"use client";

import React, { useState } from "react";
import { BranchPortalLayout } from "@/components/layout/BranchPortalLayout";
import { useApolloStore } from "@/lib/apollo-demo-store";
import {
  Megaphone,
  Plus,
  Bell,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Building2,
  Sparkles,
  Send,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  category: "Facility Notice" | "Class Schedule" | "Maintenance Alert" | "Special Event";
  content: string;
  publishedAt: string;
  priority: "High" | "Standard" | "Urgent";
  broadcastTarget: "All Members" | "Female Section Only" | "Morning Shift Only";
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Signature Studios Heart-Rate Tracking & MyZone Belt Integration",
    category: "Facility Notice",
    content: "MyZone telemetry belts are now live across all 5 TriFit Signature Studios. Connect your device via Bluetooth at reception or directly to the studio display screens.",
    publishedAt: "Today, 08:00 AM",
    priority: "High",
    broadcastTarget: "All Members",
  },
  {
    id: "ann-2",
    title: "Olympic Sauna & Steam Room Routine Maintenance",
    category: "Maintenance Alert",
    content: "The male thermal hydrotherapy suite will undergo certified sterilization from 13:00 to 15:00 today. The main swimming lap pool and cold plunge tubs remain fully operational.",
    publishedAt: "Yesterday, 04:30 PM",
    priority: "Standard",
    broadcastTarget: "All Members",
  },
  {
    id: "ann-3",
    title: "New High-Intensity Spin & RPM Masterclass with Coach Alishba",
    category: "Class Schedule",
    content: "Additional 45-minute evening spin cycling sessions have been added on Tuesday and Thursday at 19:30 in Studio 2. Reserve via the mobile member app.",
    publishedAt: "2 days ago",
    priority: "Standard",
    broadcastTarget: "All Members",
  },
];

export default function BranchAnnouncementsPage() {
  const { branches, selectedBranch } = useApolloStore();
  const activeBranch = selectedBranch || branches[0];

  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Announcement["category"]>("Facility Notice");
  const [newContent, setNewContent] = useState("");
  const [newPriority, setNewPriority] = useState<Announcement["priority"]>("Standard");
  const [newTarget, setNewTarget] = useState<Announcement["broadcastTarget"]>("All Members");

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newItem: Announcement = {
      id: `ann-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      content: newContent,
      publishedAt: "Just now",
      priority: newPriority,
      broadcastTarget: newTarget,
    };

    setAnnouncements([newItem, ...announcements]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewContent("");
    showNotification("Announcement broadcast dispatched to Member App & Club screens!");
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    showNotification("Announcement removed from active board.");
  };

  return (
    <BranchPortalLayout activeItem="announcements">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500 dark:text-[#FFD91C] shrink-0" />
                <span>Club Announcements & Alerts</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {announcements.length} Published • {activeBranch.name}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              Publish real-time mobile push notifications, locker room display alerts, and facility schedules
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="h-9 px-3.5 bg-amber-400 hover:bg-amber-300 dark:bg-[#FFD91C] dark:hover:bg-[#f5cf12] text-slate-950 font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Announcement</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {successToast && (
          <div className="p-3.5 rounded-[14px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12.5px] font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="glass-panel p-5 rounded-[22px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10.5px] font-black uppercase bg-amber-400/20 text-amber-700 dark:text-[#FFD91C] border border-amber-400/40">
                    {ann.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      ann.priority === "Urgent"
                        ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                        : "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                    }`}
                  >
                    {ann.priority} Priority
                  </span>
                  <span className="text-[11px] text-slate-400">•</span>
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
                    Target: {ann.broadcastTarget}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">{ann.publishedAt}</span>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-1.5 rounded-[8px] hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-[17px] font-[800] text-slate-900 dark:text-white">
                {ann.title}
              </h3>

              <p className="text-[13px] text-slate-600 dark:text-neutral-300 leading-relaxed">
                {ann.content}
              </p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel p-6 rounded-[24px] bg-white dark:bg-[#0D0D0B] border border-slate-200 dark:border-white/10 shadow-2xl max-w-lg w-full space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-[17px] font-[800] text-slate-900 dark:text-white">
                  Compose Club Announcement
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-3.5 text-[12.5px]">
                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Announcement Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Studio Schedule Update Notice..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    >
                      <option value="Facility Notice">Facility Notice</option>
                      <option value="Class Schedule">Class Schedule</option>
                      <option value="Maintenance Alert">Maintenance Alert</option>
                      <option value="Special Event">Special Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                      Priority Level
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    >
                      <option value="Standard">Standard</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Broadcast Target
                  </label>
                  <select
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    <option value="All Members">All Members</option>
                    <option value="Female Section Only">Female Section Only</option>
                    <option value="Morning Shift Only">Morning Shift Only</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-neutral-300 block mb-1">
                    Message Body *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter detailed notice content..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-[10px] border border-slate-200 dark:border-white/10 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-[10px] bg-amber-400 dark:bg-[#FFD91C] text-slate-950 font-black shadow-sm"
                  >
                    Broadcast Now
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
