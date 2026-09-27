"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchWorkouts, getWorkoutIds, removeWorkoutId, type Workout } from "../lib/fitlog";

export default function MyPlanPage() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"plan" | "saved">("plan");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [planIds, setPlanIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    const syncState = () => {
      setPlanIds(getWorkoutIds("plan"));
      setSavedIds(getWorkoutIds("saved"));
    };

    syncState();
    window.addEventListener("fitlog-storage", syncState);
    return () => window.removeEventListener("fitlog-storage", syncState);
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

  const visibleItems = useMemo(() => {
    const ids = tab === "plan" ? planIds : savedIds;
    return workouts.filter((item) => ids.includes(item.id));
  }, [planIds, savedIds, tab, workouts]);

  const summary = useMemo(() => {
    const totals = visibleItems.reduce(
      (acc, workout) => {
        acc.minutes += workout.duration;
        acc.calories += workout.caloriesBurned;
        return acc;
      },
      { minutes: 0, calories: 0 },
    );

    return {
      exercises: visibleItems.length,
      minutes: totals.minutes,
      calories: totals.calories,
    };
  }, [visibleItems]);

  const notify = (message: string) => {
    if (typeof window === "undefined") return;
    const toast = document.createElement("div");
    toast.className = "fixed right-4 top-4 z-50 rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  };

  const removeItem = (id: number) => {
    removeWorkoutId(tab, id);
    if (tab === "plan") {
      setPlanIds((current) => current.filter((value) => value !== id));
    } else {
      setSavedIds((current) => current.filter((value) => value !== id));
    }
    notify(tab === "plan" ? "Removed from plan" : "Removed from saved");
  };

  const markDone = (id: number) => {
    removeWorkoutId("plan", id);
    setPlanIds((current) => current.filter((value) => value !== id));
    notify("Workout marked as done");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4rem] text-lime-300">My Plan</p>
          <h1 className="mt-2 text-3xl font-black uppercase sm:text-4xl md:text-5xl">My Plan</h1>
        </div>
        <div className="text-sm text-zinc-300 md:text-right">Cap of five lifts for today. Finish them, then load more.</div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.3rem] text-zinc-400">Exercises</p>
          <p className="mt-3 text-3xl font-black">{summary.exercises}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.3rem] text-zinc-400">Minutes</p>
          <p className="mt-3 text-3xl font-black">{summary.minutes}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.3rem] text-zinc-400">Calories</p>
          <p className="mt-3 text-3xl font-black">{summary.calories}</p>
        </div>
      </div>

      <div className="mb-8 flex gap-3 overflow-x-auto border-b border-white/10 pb-1">
        <button
          className={tab === "plan" ? "border-b-2 border-lime-300 px-3 pb-3 text-sm font-semibold uppercase tracking-[0.2em] text-lime-300" : "px-3 pb-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400"}
          onClick={() => setTab("plan")}
        >
          Today&apos;s Plan
        </button>
        <button
          className={tab === "saved" ? "border-b-2 border-lime-300 px-3 pb-3 text-sm font-semibold uppercase tracking-[0.2em] text-lime-300" : "px-3 pb-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400"}
          onClick={() => setTab("saved")}
        >
          Saved
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 text-zinc-300">
          Loading workouts...
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-[#10151d] px-6 py-16 text-center">
          <p className="text-2xl font-black uppercase tracking-[0.25rem] text-white">Nothing here yet</p>
          <p className="mt-4 max-w-md text-zinc-300">Browse the library and add a lift to get today moving.</p>
          <Link href="/" className="mt-8 inline-flex rounded-full bg-lime-300 px-5 py-3 font-semibold text-[#10151d]">Go to workouts</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((workout) => (
            <article key={workout.id} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111821]">
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={workout.image} alt={workout.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black uppercase text-white">{workout.name}</h2>
                    <p className="mt-1 text-sm text-zinc-300">{workout.equipment}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-zinc-200">
                  <div className="rounded-xl bg-[#10151d] p-3">
                    <div className="text-zinc-400">Duration</div>
                    <div className="mt-1 font-semibold">{workout.duration} min</div>
                  </div>
                  <div className="rounded-xl bg-[#10151d] p-3">
                    <div className="text-zinc-400">Calories</div>
                    <div className="mt-1 font-semibold">{workout.caloriesBurned} kcal</div>
                  </div>
                  <div className="rounded-xl bg-[#10151d] p-3">
                    <div className="text-zinc-400">Rating</div>
                    <div className="mt-1 font-semibold">{workout.rating}</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link href={`/workout/${workout.id}`} className="flex-1 rounded-full border border-white/15 px-3 py-2 text-center text-sm font-semibold text-white">
                    View Details
                  </Link>
                  <button onClick={() => markDone(workout.id)} className="rounded-full bg-lime-300 px-3 py-2 text-sm font-semibold text-slate-900">
                    Mark as Done
                  </button>
                  <button onClick={() => removeItem(workout.id)} className="rounded-full border border-red-400/60 px-3 py-2 text-sm font-semibold text-red-300">
                    X
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
