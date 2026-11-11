"use client";

import React, { useState, useMemo } from "react";
import { AdminPortalLayout } from "@/components/layout/AdminPortalLayout";
import { useApolloStore } from "@/lib/apollo-demo-store";
import {
  FileBarChart2,
  Download,
  Calendar,
  Building2,
  Users,
  CreditCard,
  QrCode,
  Dumbbell,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  Printer,
  FileCode,
  Table as TableIcon,
  ArrowDownToLine,
  Check,
} from "lucide-react";

type ReportType =
  | "BRANCH_PERFORMANCE"
  | "MEMBER_GROWTH"
  | "REVENUE"
  | "ATTENDANCE"
  | "TRAINER_PERFORMANCE"
  | "RENEWALS";

type ExportFormat = "CSV" | "EXCEL" | "PDF" | "JSON";

export default function AdminReportsPage() {
  const { branches, members, trainers, payments, attendance } = useApolloStore();
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("BRANCH_PERFORMANCE");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("CSV");
  const [dateRange, setDateRange] = useState("THIS_MONTH");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const REPORT_CARDS = [
    {
      id: "BRANCH_PERFORMANCE" as const,
      title: "Branch Operational Performance",
      desc: "Comparative capacity utilization, member density, and manager details per club.",
      icon: Building2,
      recordsCount: branches.length,
    },
    {
      id: "MEMBER_GROWTH" as const,
      title: "Member Growth & Acquisition",
      desc: "New enrollments, tier distribution, active statuses, and expiration timelines.",
      icon: Users,
      recordsCount: members.length,
    },
    {
      id: "REVENUE" as const,
      title: "Consolidated Revenue & Collections",
      desc: "IBFT bank transfers, front-desk POS receipts, refund audits, and tax numbers.",
      icon: CreditCard,
      recordsCount: payments.length,
    },
    {
      id: "ATTENDANCE" as const,
      title: "Turnstile Gate Passage & Visits",
      desc: "Biometric and QR check-in timestamps, hourly peak curves, and gate telemetry.",
      icon: QrCode,
      recordsCount: attendance.length,
    },
    {
      id: "TRAINER_PERFORMANCE" as const,
      title: "Coach Roster & Session Load",
      desc: "PT client allocations, ratings, weekly hours coached, and commission distributions.",
      icon: Dumbbell,
      recordsCount: trainers.length,
    },
    {
      id: "RENEWALS" as const,
      title: "Membership Renewals & Expirations",
      desc: "Members due for renewal within 7-30 days and win-back retention targets.",
      icon: FileBarChart2,
      recordsCount: members.filter((m) => m.status === "ACTIVE").length,
    },
  ];

  // Helper to extract typed data for any report
  const getReportData = (type: ReportType) => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let title = "";

    if (type === "BRANCH_PERFORMANCE") {
      title = "Branch Operational Performance";
      headers = ["Branch ID", "Branch Name", "City", "Area", "Capacity", "Manager Name", "Manager Email"];
      rows = branches.map((b) => [b.id, b.name, b.city, b.area, b.capacity, b.managerName, b.managerEmail]);
    } else if (type === "MEMBER_GROWTH") {
      title = "Member Growth & Acquisition";
      headers = ["Member ID", "Code", "Name", "Email", "Phone", "Branch ID", "Status", "Joined", "Expires"];
      rows = members.map((m) => [m.id, m.memberCode, m.name, m.email, m.phone, m.branchId, m.status, m.joiningDate, m.expiryDate]);
    } else if (type === "REVENUE") {
      title = "Consolidated Revenue & Collections";
      headers = ["Invoice No", "Member Name", "Branch ID", "Plan", "Amount PKR", "Payment Method", "Status", "Date"];
      rows = payments.map((p) => [p.invoiceNo, p.memberName, p.branchId, p.planName, `PKR ${p.amountPKR.toLocaleString()}`, p.paymentMethod, p.status, p.timestamp]);
    } else if (type === "ATTENDANCE") {
      title = "Turnstile Gate Passage & Visits";
      headers = ["Record ID", "Member Name", "Member Code", "Branch", "Gate", "Method", "Check-in Time"];
      rows = attendance.map((a) => [a.id, a.memberName, a.memberCode, a.branchName, a.gateName, a.method, a.checkInTime]);
    } else if (type === "TRAINER_PERFORMANCE") {
      title = "Coach Roster & Session Load";
      headers = ["Trainer ID", "Name", "Email", "Specialty", "Rating", "Clients Count", "Weekly Hours", "Rate PKR"];
      rows = trainers.map((t) => [t.id, t.name, t.email, t.specialty, `${t.rating} ★`, t.activeClientsCount, `${t.weeklyHours}h/wk`, `PKR ${t.hourlyRatePKR.toLocaleString()}`]);
    } else {
      title = "Membership Renewals & Expirations";
      headers = ["Member ID", "Name", "Email", "Phone", "Status", "Expiry Date"];
      rows = members.map((m) => [m.id, m.name, m.email, m.phone, m.status, m.expiryDate]);
    }

    return { headers, rows, title };
  };

  const triggerFileDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (type: ReportType = selectedReportType, format: ExportFormat = selectedFormat) => {
    const { headers, rows, title } = getReportData(type);
    const today = new Date().toISOString().split("T")[0];
    const baseFilename = `TriFit_${type.toLowerCase()}_${today}`;

    if (format === "CSV") {
      const csvRows = [
        headers.map((h) => `"${h}"`).join(","),
        ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")),
      ];
      const csvContent = "\uFEFF" + csvRows.join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      triggerFileDownload(blob, `${baseFilename}.csv`);
      showToast(`✓ Downloaded ${title} as CSV`);
    } else if (format === "EXCEL") {
      const excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${type}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
        <body style="font-family: Calibri, Arial, sans-serif;">
          <h2 style="color: #B45309; margin-bottom: 4px;">Apollo Enterprise Fitness — ${title}</h2>
          <p style="font-size: 11px; color: #555; margin-top: 0;">Confidential CEO Executive Report • Generated on ${new Date().toLocaleString("en-PK")}</p>
          <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #ddd; font-size: 12px;">
            <tr style="background-color: #FFD91C; color: #000; font-weight: bold;">
              ${headers.map((h) => `<th style="padding: 8px 12px; border: 1px solid #ccc;">${h}</th>`).join("")}
            </tr>
            ${rows.map((r) => `<tr>${r.map((c) => `<td style="padding: 6px 12px; border: 1px solid #eee;">${c}</td>`).join("")}</tr>`).join("")}
          </table>
        </body>
        </html>
      `;
      const blob = new Blob([excelContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
      triggerFileDownload(blob, `${baseFilename}.xls`);
      showToast(`✓ Downloaded ${title} as Excel (.xls)`);
    } else if (format === "JSON") {
      const jsonRows = rows.map((r) => {
        const item: Record<string, any> = {};
        headers.forEach((h, i) => {
          item[h] = r[i];
        });
        return item;
      });
      const jsonContent = JSON.stringify(
        {
          report: title,
          reportCode: type,
          generatedAt: new Date().toISOString(),
          recordCount: jsonRows.length,
          data: jsonRows,
        },
        null,
        2
      );
      const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
      triggerFileDownload(blob, `${baseFilename}.json`);
      showToast(`✓ Downloaded ${title} as JSON`);
    } else if (format === "PDF") {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Apollo Report - ${title}</title>
              <style>
                @media print {
                  @page { size: landscape; margin: 12mm; }
                  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #0f172a; margin: 0; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #FFD91C; padding-bottom: 14px; margin-bottom: 20px; }
                .brand { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
                .subtitle { font-size: 11px; color: #64748b; margin-top: 2px; }
                .badge { background: #FFD91C; color: #000; font-weight: 800; font-size: 11px; padding: 6px 12px; border-radius: 6px; letter-spacing: 0.5px; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
                th { background: #0f172a; color: #FFD91C; text-align: left; padding: 8px 10px; font-weight: 700; border: 1px solid #1e293b; }
                td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #f1f5f9; }
                tr:nth-child(even) { background-color: #f8fafc; }
                .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <div class="brand">APOLLO ENTERPRISE FITNESS — ${title}</div>
                  <div class="subtitle">Confidential Executive Board Summary • FBR & SRB Compliant • Generated: ${new Date().toLocaleString("en-PK")}</div>
                </div>
                <div class="badge">CEO EXECUTIVE BRIEF</div>
              </div>
              <table>
                <thead>
                  <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
                </thead>
                <tbody>
                  ${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}
                </tbody>
              </table>
              <div class="footer">
                <span>Apollo Enterprise Fitness Network (Karachi & Islamabad Clubs)</span>
                <span>Page 1 of 1 • System Verified Telemetry</span>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 300);
        showToast(`✓ Opened Print / PDF dialog for ${title}`);
      }
    }
  };

  const currentPreviewData = useMemo(() => {
    return getReportData(selectedReportType);
  }, [selectedReportType, branches, members, trainers, payments, attendance]);

  const activeCardInfo = REPORT_CARDS.find((c) => c.id === selectedReportType) || REPORT_CARDS[0];

  return (
    <AdminPortalLayout activeItem="reports">
      <div className="space-y-6">
        {/* Unboxed Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
                <FileBarChart2 className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Executive Reports & Data Export</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--chip)] text-[var(--accent)] border border-[var(--accent)]/30">
                Multi-Format CEO Engine
              </span>
            </div>
            <span className="text-xs text-[var(--muted)] mt-0.5 block">
              Choose your format, select any operational report, and download verified datasets instantly
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => handleDownload(selectedReportType, selectedFormat)}
              className="btn primary !py-2 !px-4 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download {selectedFormat} ({activeCardInfo.recordsCount} Records)</span>
            </button>
          </div>
        </div>

        {/* CEO Format Selector Bar */}
        <div className="glass p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--muted)] shrink-0">
              Select Download Format:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedFormat("CSV")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === "CSV"
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                    : "bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV (.csv)</span>
              </button>

              <button
                onClick={() => setSelectedFormat("EXCEL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === "EXCEL"
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                    : "bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Excel (.xls)</span>
              </button>

              <button
                onClick={() => setSelectedFormat("PDF")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === "PDF"
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                    : "bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF / Print</span>
              </button>

              <button
                onClick={() => setSelectedFormat("JSON")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedFormat === "JSON"
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                    : "bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON Data</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-[var(--muted)] font-mono">
            <span>Filter Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-slate-800 dark:text-neutral-200 font-sans text-xs font-semibold"
            >
              <option value="THIS_MONTH">This Month (Nov 2026)</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="Q4_CONSOLIDATED">Q4 2026 Consolidated</option>
              <option value="ALL_TIME">All-Time Database Ledger</option>
            </select>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-[#FFD91C] text-[13px] font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 6 Report Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_CARDS.map((card) => {
            const isSelected = selectedReportType === card.id;
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                onClick={() => setSelectedReportType(card.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500"
                    : "bg-white dark:bg-[#0D0D0B] border-slate-200 dark:border-white/10 hover:border-amber-500/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected
                          ? "bg-[#FFD91C] text-slate-950 font-bold"
                          : "bg-slate-100 dark:bg-white/10 text-amber-600 dark:text-[#FFD91C]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-neutral-200">
                      {card.recordsCount} Records
                    </span>
                  </div>

                  <h3 className="card-title text-[var(--text)] mt-3.5">
                    {card.title}
                  </h3>
                  <p className="body-label text-xs text-[var(--muted)] mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Card Action Row: Select on card click, or direct Download button */}
                <div className="mt-5 pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? "text-[var(--accent)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {isSelected ? "Active Preview" : "Click to Preview"}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReportType(card.id);
                      handleDownload(card.id, selectedFormat);
                    }}
                    title={`Download ${card.title} in ${selectedFormat}`}
                    className="btn primary !py-1.5 !px-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {selectedFormat}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Report Live Data Preview Table */}
        <div className="glass p-5 rounded-2xl space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="card-title text-[var(--text)]">
                  Live Data Preview: {currentPreviewData.title}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Ready to Export
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Showing sample rows from the verified enterprise dataset • Format: <strong>{selectedFormat}</strong>
              </p>
            </div>

            <button
              onClick={() => handleDownload(selectedReportType, selectedFormat)}
              className="btn primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Download Full {selectedFormat} Report</span>
            </button>
          </div>

          {/* Interactive Preview Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-neutral-400 border-b border-slate-200 dark:border-white/10 font-bold">
                <tr>
                  {currentPreviewData.headers.map((h, i) => (
                    <th key={i} className="p-3 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11.5px]">
                {currentPreviewData.rows.slice(0, 6).map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="p-3 text-slate-800 dark:text-neutral-200 whitespace-nowrap"
                      >
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 pt-1">
            <span>
              Showing preview of <strong>{Math.min(6, currentPreviewData.rows.length)}</strong> of{" "}
              <strong>{currentPreviewData.rows.length}</strong> total records.
            </span>
            <span className="font-mono text-[11px]">
              Encoded: UTF-8 BOM • RFC 4180 / Excel Compatible
            </span>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
