export type Workout={
  id:number;
  name:string;
  image:string;
  muscleGroups:string[];
  equipment:string;
  difficulty:string;
  duration:number;
  caloriesBurned:number;
  sets:number;
  reps:string;
  rating:number;
  description:string;
  instructions:string[];
};

export type WorkoutListTab = "plan"|"saved";

const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";

export function notifyFitlogStorage() {
  if (typeof window!=="undefined") {
    window.dispatchEvent(new Event("fitlog-storage"));
  }
}

export function getWorkoutIds(type:WorkoutListTab):number[] {
  if (typeof window==="undefined") {
    return [];
  }

  try{
    const key = type === "plan" ? PLAN_KEY : SAVED_KEY;
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value) => Number.isFinite(value)) : [];
  } catch {
    return [];
  }
}

export function setWorkoutIds(type: WorkoutListTab, ids: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  const key = type === "plan" ? PLAN_KEY : SAVED_KEY;
  window.localStorage.setItem(key, JSON.stringify(ids));
  notifyFitlogStorage();
}

export function addWorkoutId(type: WorkoutListTab, id: number) {
  const current = getWorkoutIds(type);
  if (current.includes(id)) {
    return false;
  }

  if (type === "plan" && current.length >= 5) {
    return false;
  }

  const next = [...current, id];
  setWorkoutIds(type, next);
  return true;
}

export function removeWorkoutId(type: WorkoutListTab, id:number) {
  const current = getWorkoutIds(type).filter((value)=>value!== id);
  setWorkoutIds(type, current);
}

export function fetchWorkouts():Promise<Workout[]> {
  return fetch("https://api.api-store.workers.dev/api/fitlog", { cache: "no-store" }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load workouts");
    }

    return response.json() as Promise<Workout[]>;
  });
}

export function fetchWorkoutById(id:string|number):Promise<Workout> {
  return fetch(`https://api.api-store.workers.dev/api/fitlog/${id}`,{cache:"no-store"}).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load workout details");
    }

    return response.json() as Promise<Workout>;
  });
}

export function getWorkoutStats(workouts:Workout[]) {
  return workouts.reduce(
    (summary,workout) => ({
      minutes:summary.minutes+workout.duration,
      calories:summary.calories+workout.caloriesBurned,
    }),
    { minutes:0,calories:0 },
  );
}
