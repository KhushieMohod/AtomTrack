"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, GoalSheet, Role } from "@/types";
import { MOCK_USERS, INITIAL_GOAL_SHEETS } from "@/lib/mock-data";

// ─── Context Shape ───────────────────────────────────────────────────────────

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;

  // Goal Sheets
  goalSheets: GoalSheet[];
  addGoalSheet: (sheet: GoalSheet) => void;
  updateGoalSheet: (id: string, updates: Partial<GoalSheet>) => void;
  getSheetsByEmployee: (employeeId: string) => GoalSheet[];
  getSheetsByManager: (managerId: string) => GoalSheet[];
  getAllSheets: () => GoalSheet[];
}

const AppContext = createContext<AppState | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [goalSheets, setGoalSheets] = useState<GoalSheet[]>(INITIAL_GOAL_SHEETS);

  const login = useCallback((role: Role) => {
    const user = MOCK_USERS.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addGoalSheet = useCallback((sheet: GoalSheet) => {
    setGoalSheets((prev) => [...prev, sheet]);
  }, []);

  const updateGoalSheet = useCallback(
    (id: string, updates: Partial<GoalSheet>) => {
      setGoalSheets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
    },
    []
  );

  const getSheetsByEmployee = useCallback(
    (employeeId: string) => {
      return goalSheets.filter((s) => s.employeeId === employeeId);
    },
    [goalSheets]
  );

  const getSheetsByManager = useCallback(
    (managerId: string) => {
      // Get all employees under this manager
      const managedEmployeeIds = MOCK_USERS
        .filter((u) => u.managerId === managerId)
        .map((u) => u.id);
      return goalSheets.filter(
        (s) =>
          managedEmployeeIds.includes(s.employeeId) &&
          (s.status === "submitted" || s.status === "approved" || s.status === "locked")
      );
    },
    [goalSheets]
  );

  const getAllSheets = useCallback(() => {
    return goalSheets;
  }, [goalSheets]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        goalSheets,
        addGoalSheet,
        updateGoalSheet,
        getSheetsByEmployee,
        getSheetsByManager,
        getAllSheets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
}
