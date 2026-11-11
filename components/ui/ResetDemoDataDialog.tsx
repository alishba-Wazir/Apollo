"use client";

import React, { useState } from "react";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { useApolloStore } from "@/lib/apollo-demo-store";

interface ResetDemoDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetDemoDataDialog: React.FC<ResetDemoDataDialogProps> = ({ isOpen, onClose }) => {
  const { resetDemoData } = useApolloStore();
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsResetting(true);
    setTimeout(() => {
      resetDemoData();
      setIsResetting(false);
      onClose();
      // Reload page to re-seed all states cleanly
      window.location.reload();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0D0D0B] text-text border border-slate-200 dark:border-white/15 rounded-2xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.7)] z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-[17px] font-bold text-text">Reset Workspace Cache?</h3>
          <p className="text-[13px] text-text-muted mt-2 leading-relaxed">
            This will reset all branch telemetry, member attendance logs, and schedules
            back to the synchronized <strong className="text-accent">TriFit Enterprise baseline</strong>.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-on-accent text-[13px] font-bold shadow-md hover:bg-accent/90 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
            <span>{isResetting ? "Resetting..." : "Confirm Reset"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
