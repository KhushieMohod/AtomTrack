"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-context";
import { AtomTrackLogo } from "@/components/layout/atomtrack-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ROUTE_MAP: Record<string, string> = {
  employee: "/employee",
  manager: "/manager",
  admin: "/admin",
};

export default function LoginPage() {
  const { loginWithEmail } = useAppState();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const result = loginWithEmail(email, password);
      if (result.success) {
        // Get user role from email to route
        const user = [
          { email: "khushie@atomtrack.com", role: "employee" },
          { email: "arjun@atomtrack.com", role: "employee" },
          { email: "neha@atomtrack.com", role: "employee" },
          { email: "sakshi@atomtrack.com", role: "manager" },
          { email: "shlok@atomtrack.com", role: "admin" },
        ].find((u) => u.email.toLowerCase() === email.toLowerCase());

        router.push(ROUTE_MAP[user?.role || "employee"] || "/employee");
      } else {
        setError(result.error || "Invalid credentials.");
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AtomTrackLogo size="xl" />
          </div>
          <p className="text-slate-500 text-sm mt-2">
            Performance Goal Management System
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@atomtrack.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="mt-1.5"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="mt-1.5"
                  autoComplete="current-password"
                />
              </div>

              {/* Submit */}
              <Button
                id="login-btn"
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400">or continue with</span>
              </div>
            </div>

            {/* SSO Button */}
            <Button
              id="sso-btn"
              variant="outline"
              className="w-full h-11 border-slate-200 hover:bg-slate-50 cursor-pointer"
              onClick={() => setError("Microsoft Entra ID SSO is a bonus feature stub. Use email/password login.")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Sign in with Microsoft Entra ID</span>
            </Button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 mb-2.5 flex items-center gap-1.5">
                <span>🔑</span> Demo Credentials
              </p>
              <div className="space-y-2">
                {[
                  { role: "Employee", email: "khushie@atomtrack.com", name: "Khushie Mohod" },
                  { role: "Manager", email: "sakshi@atomtrack.com", name: "Sakshi Kuber" },
                  { role: "Admin/HR", email: "shlok@atomtrack.com", name: "Shlok Chaudhari" },
                ].map((cred) => (
                  <button
                    key={cred.email}
                    type="button"
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white/70 border border-indigo-100 hover:border-indigo-300 hover:bg-white transition-all cursor-pointer text-left"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword("Demo@123");
                      setError("");
                    }}
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-700">{cred.name}</p>
                      <p className="text-[10px] text-slate-400">{cred.email}</p>
                    </div>
                    <span className="text-[10px] text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                      {cred.role}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-indigo-400 mt-2">
                Password for all: <code className="bg-white/60 px-1 py-0.5 rounded text-indigo-600 font-mono">Demo@123</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 AtomTrack · Performance Goal Management System
        </p>
      </div>
    </div>
  );
}
