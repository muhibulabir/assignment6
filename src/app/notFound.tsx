import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3rem] text-lime-300">404 Error</p>
        <h1 className="text-4xl font-black uppercase text-white">Page not found</h1>
        <p className="mt-4 text-base text-zinc-300">
          The workout or page you were looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-lime-300 px-6 py-3 font-semibold text-[#10151d] transition hover:bg-lime-200"
        >
          Back to workouts
        </Link>
      </div>
    </main>
  );
}
