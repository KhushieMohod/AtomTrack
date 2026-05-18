"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-context";
import { AtomTrackLogo } from "@/components/layout/atomtrack-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, Shield, ArrowRight, Target, BarChart3, CalendarCheck } from "lucide-react";

const ROUTE_MAP: Record<string, string> = {
  employee: "/employee",
  manager: "/manager",
  admin: "/admin",
};

const ROLES = [
  {
    role: "Employee",
    email: "khushie@atomtrack.com",
    name: "Khushie Mohod",
    description: "Submit goals, log quarterly check-ins, and track your performance.",
    Icon: User,
  },
  {
    role: "Reporting Manager",
    email: "sakshi@atomtrack.com",
    name: "Sakshi Kuber",
    description: "Review team goals, approve submissions, and provide feedback.",
    Icon: Users,
  },
  {
    role: "Admin / HR",
    email: "shlok@atomtrack.com",
    name: "Shlok Chaudhari",
    description: "Organization-wide reporting, KPI management, and governance.",
    Icon: Shield,
  },
];

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

    setTimeout(() => {
      const result = loginWithEmail(email, password);
      if (result.success) {
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

  const handleQuickLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("Demo@123");
    setError("");
  };

  const handleSsoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const result = loginWithEmail("khushie@atomtrack.com", "Demo@123");
      if (result.success) {
        router.push("/employee");
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full border-b border-[#E2E8F0] bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <AtomTrackLogo size="sm" />
          <div className="flex items-center gap-6 text-sm">
            <a href="#login" className="text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors">
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Role Cards */}
          <div>
            <h2 id="about" className="text-lg font-semibold text-[#0F172A] mb-1">
              Choose a role to get started
            </h2>
            <p className="text-sm text-[#475569] mb-6">
              Select a role to auto-fill credentials, then sign in.
            </p>
            <div className="space-y-3">
              {ROLES.map((cred) => (
                <button
                  key={cred.email}
                  type="button"
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border bg-white hover:border-[#2563EB] transition-all cursor-pointer text-left group ${
                    email === cred.email
                      ? "border-[#2563EB] shadow-sm"
                      : "border-[#E2E8F0]"
                  }`}
                  onClick={() => handleQuickLogin(cred.email)}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    email === cred.email
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#F8FAFC] text-[#475569] group-hover:bg-[#EFF6FF] group-hover:text-[#2563EB]"
                  } transition-colors`}>
                    <cred.Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#0F172A]">{cred.role}</p>
                      <ArrowRight className={`w-4 h-4 transition-colors ${
                        email === cred.email ? "text-[#2563EB]" : "text-[#CBD5E1] group-hover:text-[#475569]"
                      }`} />
                    </div>
                    <p className="text-xs text-[#475569] mt-0.5">{cred.name}</p>
                    <p className="text-xs text-[#94A3B8] mt-1">{cred.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-[#94A3B8] mt-4">
              All demo accounts use password: <code className="bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#475569] font-mono text-[11px]">Demo@123</code>
            </p>
          </div>

          {/* Right: Login Form */}
          <div id="login">
            <Card className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-[#0F172A]">Sign in</CardTitle>
                <CardDescription className="text-[#475569]">
                  Enter your credentials to access your dashboard.
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
                    <Label htmlFor="email" className="text-sm font-medium text-[#0F172A]">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@atomtrack.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className="mt-1.5 rounded-lg border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-[#0F172A]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="mt-1.5 rounded-lg border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]"
                      autoComplete="current-password"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    id="login-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-10 rounded-lg cursor-pointer font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E2E8F0]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#94A3B8]">or</span>
                  </div>
                </div>

                {/* SSO Button */}
                <Button
                  id="sso-btn"
                  variant="outline"
                  className="w-full h-10 border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer rounded-lg"
                  onClick={handleSsoLogin}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21" fill="none">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                  </svg>
                  <span className="text-sm font-medium text-[#475569]">Sign in with Microsoft Entra ID</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4">
        <p className="text-center text-xs text-[#94A3B8]">
          2026 Atom<span className="text-[#EF5354]">Track</span>. Performance Goal Management System.
        </p>
      </footer>
    </div>
  );
}
