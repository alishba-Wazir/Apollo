"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth, DEMO_PERSONAS, DemoUser } from "@/lib/auth-context";
import { User, ShieldCheck, ChevronDown } from "lucide-react";

export const PersonaSwitcher: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-[12px] bg-glass border border-border hover:border-accent/60 transition-all text-left select-none text-[12.5px] font-[600]"
        title="Switch Active Persona"
      >
        <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-[10px] font-bold">
          {currentUser.role[0]}
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="leading-tight text-text font-bold text-[12px] flex items-center gap-1">
            {currentUser.name}
          </span>
          <span className="text-[10px] text-accent leading-none font-semibold">
            {currentUser.role}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass-panel z-50 p-2 shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 border-b border-border/60 mb-1">
            <span className="text-[11px] font-[700] text-accent uppercase tracking-wider block">
              Simulated Persona (RBAC)
            </span>
            <span className="text-[11px] text-text-muted">
              Select persona to test role permissions
            </span>
          </div>

          <div className="space-y-1">
            {DEMO_PERSONAS.map((persona) => {
              const active = persona.id === currentUser.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => {
                    setCurrentUser(persona);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-[10px] text-left transition-all text-[12px] ${
                    active
                      ? "bg-accent text-on-accent font-bold"
                      : "hover:bg-glass text-text"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{persona.name}</span>
                    <span
                      className={`text-[10px] ${
                        active ? "text-on-accent/80" : "text-text-muted"
                      }`}
                    >
                      {persona.role} • {persona.email}
                    </span>
                  </div>
                  {active && <ShieldCheck className="w-4 h-4 shrink-0 text-on-accent" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
