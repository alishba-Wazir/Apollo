"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  QrCode,
  Share2,
  X,
  ExternalLink,
} from "lucide-react";
import { useApolloStore } from "@/lib/apollo-demo-store";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "CHECKIN" | "PAYMENT" | "SOCIAL" | "AI_ALERT";
  link: string;
  isRead: boolean;
}

export const NotificationsDropdown: React.FC = () => {
  const router = useRouter();
  const { stats } = useApolloStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Gate Check-in: Zaid Khan",
      description: "Face recognition match at Seaview Turnstile Alpha. Granted VIP access.",
      time: "2 mins ago",
      type: "CHECKIN",
      link: "/admin/members",
      isRead: false,
    },
    {
      id: "notif-2",
      title: "Payment Received: PKR 35,000",
      description: "Ayesha Malik renewed Black Diamond VIP via Credit Card.",
      time: "15 mins ago",
      type: "PAYMENT",
      link: "/admin/finance",
      isRead: false,
    },
    {
      id: "notif-3",
      title: "Social Post Pending Approval",
      description: "Coach Sara Farooq submitted 'Reformer Pilates Masterclass' for approval.",
      time: "40 mins ago",
      type: "SOCIAL",
      link: "/social",
      isRead: false,
    },
    {
      id: "notif-4",
      title: "Apollo AI Win-back Trigger",
      description: "Bilal Zubairi flagged as 22-day absent. High churn risk score (88%).",
      time: "1 hour ago",
      type: "AI_ALERT",
      link: "/admin/brain",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/20"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD91C] opacity-75" />
            <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-[#FFD91C] text-[9px] font-black text-black shadow-sm ring-1 ring-black/40">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[998]" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-3 z-[999] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-text">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-accent/20 text-accent text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-semibold text-accent hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification items */}
            <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
                    );
                    setIsOpen(false);
                    router.push(n.link);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                    n.isRead
                      ? "opacity-75 hover:bg-black/5 dark:hover:bg-white/5"
                      : "bg-accent/10 hover:bg-accent/15 border border-accent/20"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-black/10 dark:bg-white/10 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[12.5px] font-bold text-text leading-tight truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-text-muted shrink-0 font-mono">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-text-muted leading-snug mt-0.5 line-clamp-2">
                      {n.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-2 mt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
              <span>Apollo Live Event Stream</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/admin/notifications");
                }}
                className="flex items-center gap-1 text-accent hover:underline font-semibold"
              >
                <span>View all</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
