"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-context";
import { AtomTrackLogo } from "@/components/layout/atomtrack-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, Check, ExternalLink } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  employee: "Employee",
  manager: "Manager (L1)",
  admin: "Admin / HR",
};

export function AppHeader() {
  const {
    currentUser,
    logout,
    isAuthenticated,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    getUnreadCount,
  } = useAppState();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = getUnreadCount();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated || !currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userNotifs = notifications
    .filter((n) => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const CHANNEL_LABEL: Record<string, string> = {
    teams: "Teams",
    email: "Email",
    system: "System",
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <AtomTrackLogo size="sm" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="notification-bell"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              onClick={() => setShowNotifs((v) => !v)}
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-[#E2E8F0] rounded-xl shadow-lg shadow-black/8 z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
                  <span className="text-sm font-semibold text-[#0F172A]">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium cursor-pointer"
                      onClick={markAllNotificationsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                  {userNotifs.length === 0 ? (
                    <div className="text-center py-10 text-sm text-[#94A3B8]">
                      No notifications
                    </div>
                  ) : (
                    userNotifs.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                          !n.read ? "bg-[#EFF6FF]" : ""
                        }`}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.deepLink) {
                            router.push(n.deepLink);
                            setShowNotifs(false);
                          }
                        }}
                      >
                        {/* Indicator */}
                        <div className="mt-1.5 shrink-0">
                          {!n.read ? (
                            <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-transparent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.read ? "font-medium text-[#0F172A]" : "text-[#475569]"}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-[#94A3B8]">
                              {new Date(n.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                            <span className="text-[10px] text-[#CBD5E1]">|</span>
                            <span className="text-[10px] text-[#94A3B8]">
                              via {CHANNEL_LABEL[n.channel] || n.channel}
                            </span>
                            {n.deepLink && (
                              <ExternalLink className="w-3 h-3 text-[#CBD5E1]" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-[#E2E8F0]" />

          {/* User info */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[#0F172A]">{currentUser.name}</p>
            <p className="text-xs text-[#94A3B8]">{ROLE_LABELS[currentUser.role]}</p>
          </div>

          <Button
            id="logout-btn"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
