"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-context";
import { AtomTrackLogo } from "@/components/layout/atomtrack-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ROLE_LABELS: Record<string, string> = {
  employee: "Employee",
  manager: "Manager (L1)",
  admin: "Admin / HR",
};

const ROLE_COLORS: Record<string, string> = {
  employee: "bg-blue-100 text-blue-700 border-blue-200",
  manager: "bg-emerald-100 text-emerald-700 border-emerald-200",
  admin: "bg-amber-100 text-amber-700 border-amber-200",
};

export function AppHeader() {
  const { currentUser, logout, isAuthenticated } = useAppState();
  const router = useRouter();

  if (!isAuthenticated || !currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <AtomTrackLogo size="sm" />

        {/* User info */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
          </div>
          <Badge
            variant="outline"
            className={`${ROLE_COLORS[currentUser.role]} text-xs font-medium px-2.5 py-1`}
          >
            {ROLE_LABELS[currentUser.role]}
          </Badge>
          <Button
            id="logout-btn"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
