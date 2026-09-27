import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitLog | Workout Library",
  description: "Dark gym companion app for planning workouts and logging progress.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0d1117] text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
