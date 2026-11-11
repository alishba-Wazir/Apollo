"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BranchPrayerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/branch/today");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="glass p-8 rounded-3xl max-w-md animate-pulse">
        <h2 className="text-xl font-bold font-display text-[var(--text)]">Redirecting to Branch Operations...</h2>
        <p className="text-sm text-[var(--muted)] mt-2">
          Prayer timetable module has been removed.
        </p>
      </div>
    </div>
  );
}
