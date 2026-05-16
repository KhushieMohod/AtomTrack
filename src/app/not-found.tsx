"use client";

import React from "react";
import { AtomTrackLogo } from "@/components/layout/atomtrack-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🔍</span>
          </div>
          <h1 className="text-6xl font-bold text-slate-200 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-slate-700">Page Not Found</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Please check the URL or head back to the login page.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 cursor-pointer">
              Back to Login
            </Button>
          </Link>
          <div className="flex items-center gap-4 text-xs text-slate-400 mt-4">
            <Link href="/employee" className="hover:text-blue-600 transition-colors">Employee</Link>
            <span>·</span>
            <Link href="/manager" className="hover:text-emerald-600 transition-colors">Manager</Link>
            <span>·</span>
            <Link href="/admin" className="hover:text-amber-600 transition-colors">Admin</Link>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <AtomTrackLogo size="sm" />
        </div>
      </div>
    </div>
  );
}
