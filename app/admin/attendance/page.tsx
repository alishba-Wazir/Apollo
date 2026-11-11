"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAttendancePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect turnstile attendance to Signature Studios
    router.replace("/admin/studios");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="glass p-8 rounded-3xl max-w-md animate-pulse">
        <h2 className="text-xl font-bold font-display text-[var(--text)]">Redirecting to Signature Studios...</h2>
        <p className="text-sm text-[var(--muted)] mt-2">
          Turnstile attendance has been deprecated and replaced with Signature Studios management.
        </p>
      </div>
    </div>
  );
}
