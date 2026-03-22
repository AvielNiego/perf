import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PerfQuest - Learn Linux perf",
  description: "An interactive game to learn Linux performance analysis with perf",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0e17",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] h-screen h-[100dvh] overflow-hidden">
        {children}
      </body>
    </html>
  );
}
