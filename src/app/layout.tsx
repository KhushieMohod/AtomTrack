import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/app-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "AtomTrack — Performance Goal Management",
  description:
    "A professional performance goal management system for defining, tracking, and approving employee objectives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <AppProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
