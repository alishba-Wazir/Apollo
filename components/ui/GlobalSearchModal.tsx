"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApolloStore } from "@/lib/apollo-demo-store";
import {
  Search,
  X,
  Users,
  Dumbbell,
  Building2,
  Calendar,
  Share2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { members, trainers, branches, classes, socialPosts, setCurrentBranchId } = useApolloStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedMembers = members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.memberCode.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.cnic.includes(q)
      )
      .slice(0, 4);

    const matchedTrainers = trainers
      .filter((t) => t.name.toLowerCase().includes(q) || t.specialty.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedBranches = branches
      .filter((b) => b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q) || b.area.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedClasses = classes
      .filter((c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedPosts = socialPosts
      .filter((p) => p.title.toLowerCase().includes(q) || p.caption.toLowerCase().includes(q))
      .slice(0, 3);

    return {
      members: matchedMembers,
      trainers: matchedTrainers,
      branches: matchedBranches,
      classes: matchedClasses,
      posts: matchedPosts,
    };
  }, [query, members, trainers, branches, classes, socialPosts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0D0D0B] dark:bg-[#0D0D0B] text-white border border-white/10 dark:border-white/15 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-accent shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members, trainers, branches, classes, social posts..."
            autoFocus
            className="flex-1 bg-transparent text-[15px] text-white placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-white/10 text-neutral-300 rounded border border-white/15">
            ESC
          </kbd>
        </div>

        {/* Search Results / Quick Suggestions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!results ? (
            <div className="py-6 text-center text-neutral-400">
              <p className="text-[13px]">Type a member name, trainer, branch, or class...</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-neutral-500">
                <span>Quick:</span>
                <button
                  onClick={() => setQuery("Zaid")}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-accent font-mono"
                >
                  Zaid Khan
                </button>
                <button
                  onClick={() => setQuery("Seaview")}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-accent font-mono"
                >
                  Seaview Flagship
                </button>
                <button
                  onClick={() => setQuery("Tariq")}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-accent font-mono"
                >
                  Coach Tariq
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Members */}
              {results.members.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-accent uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Members ({results.members.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.members.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onClose();
                          router.push(`/admin/members?highlight=${m.id}`);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                          />
                          <div>
                            <div className="text-[13px] font-bold text-white group-hover:text-accent flex items-center gap-2">
                              <span>{m.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                                {m.memberCode}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-400">
                              {m.fitnessGoal} • {m.status}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-accent transform group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trainers */}
              {results.trainers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-accent uppercase tracking-wider mb-2">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>Trainers ({results.trainers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.trainers.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onClose();
                          router.push(`/admin/trainers`);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                          />
                          <div>
                            <div className="text-[13px] font-bold text-white group-hover:text-accent">
                              {t.name}
                            </div>
                            <div className="text-[11px] text-neutral-400">
                              {t.specialty} • ⭐ {t.rating}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-accent transform group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Branches */}
              {results.branches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-accent uppercase tracking-wider mb-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Branches ({results.branches.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.branches.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setCurrentBranchId(b.id);
                          onClose();
                          router.push(`/branch/today`);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-all group"
                      >
                        <div>
                          <div className="text-[13px] font-bold text-white group-hover:text-accent">
                            {b.name}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {b.area} • Capacity {b.capacity}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/20 text-accent">
                          Switch Scope
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes */}
              {results.classes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-accent uppercase tracking-wider mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Classes ({results.classes.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.classes.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onClose();
                          router.push(`/admin/classes`);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-all group"
                      >
                        <div>
                          <div className="text-[13px] font-bold text-white group-hover:text-accent">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {c.studio} • {c.startTime} • {c.trainerName}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                          {c.bookedCount}/{c.capacity} Booked
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Posts */}
              {results.posts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-accent uppercase tracking-wider mb-2">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Social Hub Content ({results.posts.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.posts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          router.push(`/social`);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-all group"
                      >
                        <div>
                          <div className="text-[13px] font-bold text-white group-hover:text-accent">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {p.platform} • {p.status}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-accent" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {results.members.length === 0 &&
                results.trainers.length === 0 &&
                results.branches.length === 0 &&
                results.classes.length === 0 &&
                results.posts.length === 0 && (
                  <div className="py-8 text-center text-neutral-400 text-[13px]">
                    No matches found for &quot;{query}&quot;. Try searching with a different term.
                  </div>
                )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-white/10 text-[11px] text-neutral-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Enterprise Global Search</span>
            <span>•</span>
            <span className="text-accent">TriFit Live Shared Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.2 rounded bg-white/10 text-white font-mono text-[10px]">ESC</kbd>
            <span>to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
