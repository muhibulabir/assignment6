export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
      <div className="flex flex-col items-center gap-4 text-center text-white">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-lime-400/30 border-t-lime-400" />
        <p className="text-sm uppercase tracking-[0.35rem] text-lime-300">Loading workouts…</p>
      </div>
    </main>
  );
}
