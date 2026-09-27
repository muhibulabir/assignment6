export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 p-6">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl">
        <div className="card-body gap-6">
          <div className="badge badge-primary badge-outline">DaisyUI</div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome to your app</h1>
            <p className="mt-3 text-base-content/70">
              DaisyUI is now installed and ready to use with Tailwind in this Next.js project.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-outline">Outline</button>
          </div>

          <div className="stats stats-vertical w-full shadow sm:stats-horizontal">
            <div className="stat">
              <div className="stat-title">Downloads</div>
              <div className="stat-value">31K</div>
              <div className="stat-desc">This month</div>
            </div>
            <div className="stat">
              <div className="stat-title">New users</div>
              <div className="stat-value">4,200</div>
              <div className="stat-desc">↗︎ 400 (14%)</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
