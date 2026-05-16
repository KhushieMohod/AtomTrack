"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Something Went Wrong</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            An unexpected error occurred. This has been noted and we&apos;re working on it.
            Please try again or return to the home page.
          </p>
          {error.message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
              <p className="text-xs font-medium text-red-700">Error Details:</p>
              <p className="text-xs text-red-600 mt-1 font-mono break-all">{error.message}</p>
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={reset}
              className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="cursor-pointer"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
