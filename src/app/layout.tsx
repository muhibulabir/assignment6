import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "FitLog",
  description: "A simple fitness log app built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0d1117] text-white">{children}</body>
    </html>
  );
}
