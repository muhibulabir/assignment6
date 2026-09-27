"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { getWorkoutIds } from "../lib/fitlog";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const syncCounters = () => {
      setPlanCount(getWorkoutIds("plan").length);
      setSavedCount(getWorkoutIds("saved").length);
    };

    syncCounters();
    window.addEventListener("fitlog-storage", syncCounters);
    return () => window.removeEventListener("fitlog-storage",syncCounters);
  },[]);

  const active = pathname?.startsWith("/my-plan") ? "my-plan" : "workout";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d1117] text-white">
      <nav className="sticky top-0 z-30 border-b border-white/10 bg-[#0d1117]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative h-9 w-9 overflow-hidden rounded-full sm:h-10 sm:w-10">
                <Image src="/logo.png" alt="Logo" fill className="object-cover" sizes="40px" />
              </span>
              <span className="text-lg font-black uppercase tracking-[0.15em] text-white sm:text-xl">FitLog</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase md:hidden">
              <Link href="/my-plan" className="rounded-full bg-lime-300 px-2.5 py-1.5 text-[#10151d]">
                {planCount} Plan
              </Link>
              <Link href="/my-plan" className="rounded-full border border-white/40 px-2.5 py-1.5 text-white">
                {savedCount} Saved
              </Link>
            </div>
          </div>

          <div className="hidden items-center gap-10 text-sm font-medium text-zinc-300 md:flex">
            <Link href="/" className={active === "workout" ? "text-lime-300 underline underline-offset-8" : "transition hover:text-white"}>
              Workout
            </Link>
            <Link href="/my-plan" className={active === "my-plan" ? "text-lime-300 underline underline-offset-8" : "transition hover:text-white"}>
              My Plan
            </Link>
          </div>

          <div className="hidden items-center gap-3 text-xs font-semibold uppercase md:flex">
            <Link href="/my-plan" className="rounded-full bg-lime-300 px-3 py-2 text-[#10151d]">
              {planCount} Plan
            </Link>
            <Link href="/my-plan" className="rounded-full border border-white/40 px-3 py-2 text-white">
              {savedCount} Saved
            </Link>
          </div>
        </div>
      </nav>
      {children}
      <footer className="border-t border-white/10 bg-[#0a0f14]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center text-sm text-zinc-300 md:flex-row md:px-8 md:text-left">
          <div className="flex items-center gap-3">
            <span className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image src="/logo.png" alt="FitLog" fill className="object-cover" sizes="32px" />
            </span>
            <span className="text-lg font-black uppercase tracking-[0.2em] text-white">FITLOG</span>
          </div>
          <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
        </div>
      </footer>
    </main>
  );
}
