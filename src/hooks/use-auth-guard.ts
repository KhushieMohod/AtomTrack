"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-context";
import { Role } from "@/types";

/**
 * Auth guard hook — redirects to login if user is not authenticated
 * or does not have the required role.
 */
export function useAuthGuard(requiredRole: Role): { isReady: boolean } {
  const { currentUser, isAuthenticated } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.role !== requiredRole) {
      router.replace("/");
    }
  }, [isAuthenticated, currentUser, requiredRole, router]);

  return {
    isReady: isAuthenticated && !!currentUser && currentUser.role === requiredRole,
  };
}
