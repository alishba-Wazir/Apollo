"use client";

import React, { useState } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore } from "@/lib/apollo-demo-store";
import {
  Bell,
  CheckCircle2,
  QrCode,
  CreditCard,
  Share2,
  Sparkles,
  Trash2,
  Filter,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "CHECKIN" | "PAYMENT" | "SOCIAL" | "AI_ALERT";
  isRead: boolean;
}

export default function AdminNotificationsPage() {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      title: "VIP Gate Passage Verified: Zaid Khan",
      description: "Zaid Khan verified via 3D facial recognition at TriFit Seaview Turnstile Alpha.",
      time: "5 mins ago",
      type: "CHECKIN",
      isRead: false,
    },
    {
      id: "n-2",
      title: "IBFT Payment Received: PKR 35,000",
      description: "Arsalan Khawaja renewed Black Diamond VIP plan. Bank reference BAFL-11029 verified.",
      time: "25 mins ago",
      type: "PAYMENT",
      isRead: false,
    },
    {
      id: "n-3",
      title: "Social Post Pending Admin Approval",
      description: "Coach Sara Farooq submitted 'Reformer Core Sculpt Masterclass' for review.",
      time: "1 hour ago",
      type: "SOCIAL",
      isRead: false,
    },
    {
      id: "n-4",
      title: "Apollo AI Churn Risk Alert",
      description: "Bilal Zubairi (TF-10209) absent for 22 days. Personalized loyalty incentive proposed.",
      time: "2 hours ago",
      type: "AI_ALERT",
      isRead: true,
    },
    {
      id: "n-5",
      title: "Equipment Maintenance Logged",
      description: "LifeFitness Treadmill #04 belt tension calibrated at TriFit Clifton by Murtaza Ali.",
      time: "Yesterday at 04:30 PM",
      type: "CHECKIN",
      isRead: true,
    },
    {
      id: "n-6",
      title: "New Member Enrolled: Fatima Farooq",
      description: "Fatima Farooq enrolled in Ladies Morning plan at Clifton branch.",
      time: "Yesterday at 11:15 AM",
      type: "PAYMENT",
      isRead: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "ALL") return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "CHECKIN":
        return <QrCode className="w-4 h-4 text-emerald-400" />;
      case "PAYMENT":
        return <CreditCard className="w-4 h-4 text-accent" />;
      case "SOCIAL":
        return <Share2 className="w-4 h-4 text-sky-400" />;
      case "AI_ALERT":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <AdminPortalLayout activeItem="notifications">
      <div className="space-y-5">
        
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <Bell className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Notifications & Security Feed</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                {notifications.filter(n => !n.isRead).length} Unread Alerts
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Turnstile overrides, financial transactions, social approvals, and automated AI notifications
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={markAllRead}
              className="btn !py-2 !px-3.5 text-xs font-semibold cursor-pointer"
            >
              Mark All Read
            </button>
            <button
              onClick={clearAll}
              className="btn !py-2 !px-3.5 text-xs font-semibold text-rose-400 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
            >
              Clear Feed
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["ALL", "CHECKIN", "PAYMENT", "SOCIAL", "AI_ALERT"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                filterType === type
                  ? "bg-accent text-on-accent shadow-sm"
                  : "bg-black/5 dark:bg-white/5 text-text-muted hover:text-text"
              }`}
            >
              {type === "ALL"
                ? "All Alerts"
                : type === "CHECKIN"
                ? "Turnstile Passes"
                : type === "PAYMENT"
                ? "Payments"
                : type === "SOCIAL"
                ? "Social Hub"
                : "Apollo AI"}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-text-muted glass-panel rounded-2xl">
              No notifications matching the selected filter.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  n.isRead
                    ? "bg-black/5 dark:bg-white/5 border-border opacity-75"
                    : "bg-accent/10 border-accent/30 shadow-sm"
                }`}
              >
                <div className="p-2.5 rounded-xl bg-black/10 dark:bg-white/10 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[14px] font-bold text-text truncate">{n.title}</h4>
                    <span className="text-[11px] font-mono text-text-muted shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[12.5px] text-text-muted mt-1 leading-relaxed">
                    {n.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </AdminPortalLayout>
  );
}
