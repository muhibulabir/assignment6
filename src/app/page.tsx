"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchWorkouts, getWorkoutIds, type Workout } from "./lib/fitlog";

const sortOptions = [
  { label: "Duration", value: "duration" },
  { label: "Calories", value: "calories" },
  { label: "Rating", value: "rating" },
] as const;

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>("duration");
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const syncCounters = () => {
      setPlanCount(getWorkoutIds("plan").length);
      setSavedCount(getWorkoutIds("saved").length);
    };

    syncCounters();
    window.addEventListener("fitlog-storage", syncCounters);
    return () => window.removeEventListener("fitlog-storage", syncCounters);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchWorkouts();
        setWorkouts(data);
      } catch {
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const libraryWorkouts = useMemo(() => {
    const sorted = [...workouts];
    if (sortBy === "calories") {
      return sorted.sort((a, b) => b.caloriesBurned - a.caloriesBurned);
    }
    if (sortBy === "rating") {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted.sort((a, b) => b.duration - a.duration);
  }, [sortBy, workouts]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-8">
        <div className="grid items-center gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-5 md:grid-cols-2 md:gap-8 md:p-6">
          <div className="px-1 sm:px-2 md:px-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35rem] text-lime-300 sm:text-sm">Workout Library</p>
            <h1 className="mt-4 max-w-[600px] text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
              Train with intent. Log every set.
            </h1>
            <p className="mt-5 max-w-xl text-base text-zinc-300 sm:text-lg">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.
            </p>
            <a href="#library" className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-lime-300 px-6 py-3 font-semibold text-[#10151d] shadow-lg shadow-lime-300/30 sm:w-auto">
              <span aria-hidden="true">→</span>
              Browse workouts
            </a>
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[16/9] md:aspect-auto md:h-[420px]">
            <Image src="/banner.png" alt="Workout banner" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section id="library" className="mx-auto max-w-7xl px-4 pb-20 pt-6 md:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35rem] text-zinc-400">The Library</p>
            <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl md:text-4xl">The Library</h2>
          </div>

          <div className="flex w-full items-center justify-between gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 sm:w-auto">
            <span className="whitespace-nowrap">Sort By</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as (typeof sortOptions)[number]["value"])}
              className="min-w-0 rounded-full border border-white/10 bg-[#10151d] px-3 py-2 text-white outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="mb-8 text-sm text-zinc-300 sm:text-base">Twelve lifts covering every major muscle group.</p>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 text-zinc-300">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-lime-400/30 border-t-lime-400" />
              <span className="text-sm uppercase tracking-[0.3rem] text-lime-300">Loading workouts…</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {libraryWorkouts.map((workout) => (
              <Link key={workout.id} href={`/workouts/${workout.id}`} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111821] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image src={workout.image} alt={workout.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {workout.muscleGroups.map((group) => (
                      <span key={group} className="rounded-full border border-lime-300/40 bg-lime-300/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-lime-200">
                        {group}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-black uppercase leading-snug text-white">{workout.name}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{workout.equipment}</p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-zinc-200">
                    <div className="rounded-lg bg-[#10151d] p-2">
                      <div className="text-zinc-400">Time</div>
                      <div className="mt-1 font-semibold">{workout.duration} min</div>
                    </div>
                    <div className="rounded-lg bg-[#10151d] p-2">
                      <div className="text-zinc-400">Kcal</div>
                      <div className="mt-1 font-semibold">{workout.caloriesBurned}</div>
                    </div>
                    <div className="rounded-lg bg-[#10151d] p-2">
                      <div className="text-zinc-400">Rating</div>
                      <div className="mt-1 font-semibold">{workout.rating}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
