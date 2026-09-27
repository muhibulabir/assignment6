"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addWorkoutId, getWorkoutIds, type Workout } from "../../lib/fitlog";

export function WorkoutDetailClient({ workout }: { workout: Workout }) {
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

  const notify = (message: string) => {
    if (typeof window === "undefined") return;
    const toast = document.createElement("div");
    toast.className = "fixed right-4 top-4 z-50 rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-xl";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  };

  const addToPlan = () => {
    const added = addWorkoutId("plan", workout.id);
    if (added) {
      setPlanCount((count) => count + 1);
      notify("Added to today's plan");
      return;
    }

    notify(getWorkoutIds("plan").length >= 5 ? "Today's plan is full" : "Already in today's plan");
  };

  const saveForLater = () => {
    const added = addWorkoutId("saved", workout.id);
    if (added) {
      setSavedCount((count) => count + 1);
      notify("Saved for later");
      return;
    }

    notify("Already saved for later");
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:py-10 md:grid-cols-2 md:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
        <div className="relative h-[280px] w-full sm:h-[360px] md:h-full md:min-h-[420px]">
          <Image src={workout.image} alt={workout.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase sm:text-4xl md:text-5xl">{workout.name}</h1>
          <p className="mt-3 text-base text-zinc-300 sm:text-lg">{workout.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {workout.muscleGroups.map((muscle) => (
            <span key={muscle} className="rounded-full border border-lime-300/60 bg-lime-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lime-200">
              {muscle}
            </span>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Equipment", workout.equipment],
              ["Difficulty", workout.difficulty],
              ["Sets", String(workout.sets)],
              ["Reps", workout.reps],
              ["Duration", `${workout.duration} min`],
              ["Calories", `${workout.caloriesBurned} kcal`],
              ["Rating", String(workout.rating)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-[#10151d] p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">{label}</div>
                <div className="mt-2 text-sm font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-black uppercase tracking-[0.25rem] text-white">Instructions</h2>
          <ol className="space-y-3 text-zinc-200">
            {workout.instructions.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime-300 text-sm font-black text-slate-900">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={addToPlan} className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-5 py-3 font-semibold text-[#10151d]">
            Add to today&apos;s plan
          </button>
          <button onClick={saveForLater} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-transparent px-5 py-3 font-semibold text-white">
            Save for later
          </button>
        </div>
      </div>
    </section>
  );
}
