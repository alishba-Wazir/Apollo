"use client";

import React, { useState, useEffect } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  Building2,
  Users,
  Dumbbell,
  Clock,
  CalendarCheck,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type EntityType = "members" | "visits" | "trainers" | "shifts" | "bookings";

interface SampleTemplate {
  name: string;
  icon: React.ReactNode;
  sampleCSV: string;
  description: string;
}

const TEMPLATES: Record<EntityType, SampleTemplate> = {
  members: {
    name: "Members",
    icon: <Users className="w-4 h-4 text-accent" />,
    description: "Import new members with goals, studios, and plans.",
    sampleCSV: `name,phone,goal,studio,plan,language,status
Bilal Qureshi,0300-1122334,Strength,Strength Forge,PRO,en,ACTIVE
Zainab Farooq,0300-2233445,Fat Loss,Cardio Loft,ELITE,ur,ACTIVE
Haris Mehmood,0300-3344556,Hypertrophy,Studio Alpha,STANDARD,en,ACTIVE
Maryam Siddiqui,0300-4455667,Endurance,Cardio Loft,PRO,en,ACTIVE
Usman Tariq,0300-5566778,Recovery,Olympic Arena,PRO,ur,ACTIVE`,
  },
  visits: {
    name: "Visits",
    icon: <Clock className="w-4 h-4 text-accent" />,
    description: "Log turnstile check-ins for existing branch members.",
    sampleCSV: `phone,checkedInAt
0300-1122334,2026-11-06T08:30:00Z
0300-2233445,2026-11-06T09:15:00Z
0300-3344556,2026-11-06T10:00:00Z
0300-4455667,2026-11-06T11:45:00Z`,
  },
  trainers: {
    name: "Trainers",
    icon: <Dumbbell className="w-4 h-4 text-accent" />,
    description: "Register personal coaches and certification validity.",
    sampleCSV: `name,phone,certificateExpiry
Khurram Shehzad,0300-8899001,2027-12-31
Ayesha Malik,0300-8899002,2027-08-15
Faisal Riaz,0300-8899003,2028-01-30`,
  },
  shifts: {
    name: "Trainer Shifts",
    icon: <CalendarCheck className="w-4 h-4 text-accent" />,
    description: "Assign coach floor duty schedules.",
    sampleCSV: `phone,startsAt,endsAt
0300-8899001,2026-11-07T06:00:00Z,2026-11-07T14:00:00Z
0300-8899002,2026-11-07T14:00:00Z,2026-11-07T22:00:00Z`,
  },
  bookings: {
    name: "Bookings",
    icon: <Layers className="w-4 h-4 text-accent" />,
    description: "Schedule personal training sessions.",
    sampleCSV: `memberPhone,trainerPhone,startsAt,status
0300-1122334,0300-8899001,2026-11-07T10:00:00Z,SCHEDULED
0300-2233445,0300-8899002,2026-11-07T16:00:00Z,SCHEDULED`,
  },
};

export default function AdminSyncPage() {
  const { user, selectedBranchId } = useAuth();
  const [selectedEntity, setSelectedEntity] = useState<EntityType>("members");
  const [targetBranch, setTargetBranch] = useState<string>("branch-seaview");
  const [csvInput, setCsvInput] = useState<string>(TEMPLATES.members.sampleCSV);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchSyncHistory();
  }, []);

  const fetchSyncHistory = async () => {
    try {
      const res = await fetch("/api/sync/csv");
      if (res.ok) {
        const json = await res.json();
        setSyncHistory(json.syncLogs || []);
      }
    } catch (e) {
      console.error("Failed to load sync history", e);
    }
  };

  const handleEntityChange = (entity: EntityType) => {
    setSelectedEntity(entity);
    setCsvInput(TEMPLATES[entity].sampleCSV);
    setSyncResult(null);
    setErrorMessage(null);
  };

  const handleImport = async () => {
    if (!csvInput.trim()) {
      setErrorMessage("Please provide CSV content to import.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSyncResult(null);

    try {
      const res = await fetch("/api/sync/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: selectedEntity,
          csvData: csvInput,
          targetBranchId: targetBranch,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error || "Import failed.");
      } else {
        setSyncResult(json.result);
        await fetchSyncHistory();
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Network error while syncing CSV.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const element = document.createElement("a");
    const file = new Blob([TEMPLATES[selectedEntity].sampleCSV], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = `trifit_${selectedEntity}_template.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const rowCount = csvInput.trim().split("\n").length - 1;

  return (
    <AdminPortalLayout activeItem="sync">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-yellow text-[10px] font-bold">PHASE 2 DELIVERABLE</span>
              <span className="text-[12px] text-text-muted">Section 7 Data Sync Engine</span>
            </div>
            <h1 className="text-[26px] font-[900] tracking-tight text-text flex items-center gap-2.5">
              <UploadCloud className="w-6 h-6 text-accent" />
              Data Sync & CSV Ingestion Engine
            </h1>
            <p className="text-[13px] text-text-muted mt-1">
              Import members, visits, trainers, shifts, and bookings with server-side validation and audit logging.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={fetchSyncHistory}
              className="btn-secondary text-[12px] py-2 px-3 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh History</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Import Panel + Live History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Import Workspace (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-5 border border-border space-y-5">
            {/* Step 1: Target Branch & Entity Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-[800] text-text-muted uppercase tracking-wider mb-1.5">
                  1. Target Branch Scope
                </label>
                <div className="relative">
                  <select
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                    className="w-full p-2.5 rounded-[12px] bg-glass border border-border text-text text-[13px] font-bold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <option value="branch-seaview">TRI FIT Seaview Flagship (Karachi)</option>
                    <option value="branch-ajtower">TRI FIT AJ Tower (Islamabad)</option>
                    <option value="branch-sohamall">TRI FIT Soha Mall (Islamabad Ladies)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-[800] text-text-muted uppercase tracking-wider mb-1.5">
                  2. Entity Dataset
                </label>
                <div className="flex items-center gap-1 bg-glass p-1 rounded-[12px] border border-border overflow-x-auto">
                  {(Object.keys(TEMPLATES) as EntityType[]).map((e) => (
                    <button
                      key={e}
                      onClick={() => handleEntityChange(e)}
                      className={`px-2.5 py-1.5 rounded-[9px] text-[11.5px] font-[700] transition-all whitespace-nowrap capitalize ${
                        selectedEntity === e
                          ? "bg-accent text-on-accent font-bold"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Notice & Download */}
            <div className="flex items-center justify-between p-3 rounded-[12px] bg-accent/10 border border-accent/30 text-[12px]">
              <div className="flex items-center gap-2">
                {TEMPLATES[selectedEntity].icon}
                <span className="font-semibold text-text">
                  {TEMPLATES[selectedEntity].description}
                </span>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="text-accent hover:underline font-bold flex items-center gap-1 text-[11.5px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV Template</span>
              </button>
            </div>

            {/* Step 2: CSV Data Textarea with prefilled sample */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-[800] text-text-muted uppercase tracking-wider">
                  3. CSV Content ({Math.max(rowCount, 0)} Records Detected)
                </label>
                <button
                  onClick={() => setCsvInput(TEMPLATES[selectedEntity].sampleCSV)}
                  className="text-[11px] text-text-muted hover:text-accent font-bold"
                >
                  Reset to Standard Template
                </button>
              </div>

              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                rows={8}
                className="w-full p-3.5 rounded-[12px] bg-glass border border-border font-mono text-[12px] text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent leading-relaxed"
                placeholder="Paste CSV rows with headers here..."
              />
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="p-3 rounded-[12px] bg-negative/10 border border-negative/30 text-negative text-[12.5px] font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {syncResult && (
              <div className="p-3.5 rounded-[12px] bg-positive/10 border border-positive/30 text-positive text-[12.5px] font-medium space-y-1">
                <div className="flex items-center gap-2 font-bold text-[13px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Successfully imported {syncResult.imported} {syncResult.entityType}!
                  </span>
                </div>
                <div className="text-[11.5px] text-text-muted">
                  {syncResult.skipped} skipped • Target: {syncResult.branchId} • Audit event logged.
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between border-t border-border/60">
              <span className="text-[11.5px] text-text-muted flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Enforced server-side against branch permissions.</span>
              </span>

              <button
                onClick={handleImport}
                disabled={isSubmitting}
                className="btn-primary text-[13px] py-2.5 px-5 flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isSubmitting ? "Importing Records..." : "Execute CSV Sync"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Sync Audit Trail & Branch Storage (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-5 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-accent" />
                  <h3 className="text-[15px] font-[800] text-text">Recent Sync Activity</h3>
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  {syncHistory.length} Recorded
                </span>
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {syncHistory.length === 0 ? (
                  <div className="py-8 text-center text-text-muted text-[12px]">
                    No sync activity recorded yet. Run your first CSV import!
                  </div>
                ) : (
                  syncHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-[12px] bg-glass border border-border space-y-1 text-[12px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text">{item.target}</span>
                        <span className="text-[10px] font-mono text-text-muted">
                          {new Date(item.at).toLocaleTimeString("en-PK", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted leading-tight">{item.details}</p>
                      <div className="text-[10px] text-accent font-semibold pt-0.5">
                        By {item.user?.name || "Admin"} ({item.user?.role || "ADMIN"})
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Architecture Card */}
            <div className="glass-panel p-4 border border-border text-[11.5px] text-text-muted space-y-1.5">
              <div className="flex items-center gap-1.5 text-accent font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Section 7 Integration Contract</span>
              </div>
              <p>
                APOLLO's swappable sync interface accepts standard CSV exports from any gym management software. The interface is prepared for direct REST/webhook ingestion once TRI FIT APIs are published.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
