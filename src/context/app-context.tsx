"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, GoalSheet, Role, SharedGoal, QuarterlyCheckIn, ManagerComment, Goal, Quarter, AuditLogEntry } from "@/types";
import { Notification } from "@/lib/mock-data";
import {
  MOCK_USERS,
  INITIAL_GOAL_SHEETS,
  INITIAL_SHARED_GOALS,
  INITIAL_CHECK_INS,
  INITIAL_MANAGER_COMMENTS,
  INITIAL_AUDIT_LOG,
  INITIAL_NOTIFICATIONS,
} from "@/lib/mock-data";
import { generateId } from "@/lib/validations";

// ─── Context Shape ───────────────────────────────────────────────────────────

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  loginWithEmail: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;

  // Goal Sheets
  goalSheets: GoalSheet[];
  addGoalSheet: (sheet: GoalSheet) => void;
  updateGoalSheet: (id: string, updates: Partial<GoalSheet>) => void;
  getSheetsByEmployee: (employeeId: string) => GoalSheet[];
  getSheetsByManager: (managerId: string) => GoalSheet[];
  getAllSheets: () => GoalSheet[];

  // Shared Goals
  sharedGoals: SharedGoal[];
  addSharedGoal: (goal: SharedGoal) => void;
  updateSharedGoal: (id: string, updates: Partial<SharedGoal>) => void;
  getSharedGoalsByEmployee: (employeeId: string) => SharedGoal[];
  pushSharedGoalToSheets: (sharedGoal: SharedGoal) => void;

  // Quarterly Check-ins
  checkIns: QuarterlyCheckIn[];
  addCheckIn: (checkIn: QuarterlyCheckIn) => void;
  updateCheckIn: (id: string, updates: Partial<QuarterlyCheckIn>) => void;
  getCheckInsByGoalSheet: (goalSheetId: string) => QuarterlyCheckIn[];
  getCheckInsByEmployee: (employeeId: string) => QuarterlyCheckIn[];
  getCheckInsByGoal: (goalId: string) => QuarterlyCheckIn[];

  // Manager Comments
  managerComments: ManagerComment[];
  addManagerComment: (comment: ManagerComment) => void;
  getCommentsByGoalSheet: (goalSheetId: string) => ManagerComment[];
  getCommentsByGoal: (goalId: string, quarter?: Quarter) => ManagerComment[];

  // Audit Trail
  auditLog: AuditLogEntry[];
  addAuditEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;
  getAuditLog: () => AuditLogEntry[];
  getAuditLogByEntity: (entityId: string) => AuditLogEntry[];
  getPostLockAuditLog: () => AuditLogEntry[];

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getUnreadCount: () => number;

  // Users
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
}

const AppContext = createContext<AppState | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [goalSheets, setGoalSheets] = useState<GoalSheet[]>(INITIAL_GOAL_SHEETS);
  const [sharedGoals, setSharedGoals] = useState<SharedGoal[]>(INITIAL_SHARED_GOALS);
  const [checkIns, setCheckIns] = useState<QuarterlyCheckIn[]>(INITIAL_CHECK_INS);
  const [managerComments, setManagerComments] = useState<ManagerComment[]>(INITIAL_MANAGER_COMMENTS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  // ── Auth ─────────────────────────────────────────────────────────────────

  const login = useCallback((role: Role) => {
    const user = MOCK_USERS.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const loginWithEmail = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      return { success: false, error: "Invalid email or password. Please try again." };
    }
    setCurrentUser(user);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // ── Notifications ────────────────────────────────────────────────────────

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const getUnreadCount = useCallback(() => {
    if (!currentUser) return 0;
    return notifications.filter((n) => n.userId === currentUser.id && !n.read).length;
  }, [notifications, currentUser]);

  // ── Audit Trail ──────────────────────────────────────────────────────────

  const addAuditEntry = useCallback(
    (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
      const newEntry: AuditLogEntry = {
        ...entry,
        id: generateId("audit"),
        timestamp: new Date().toISOString(),
      };
      setAuditLog((prev) => [newEntry, ...prev]);
    },
    []
  );

  const getAuditLog = useCallback(() => {
    return auditLog;
  }, [auditLog]);

  const getAuditLogByEntity = useCallback(
    (entityId: string) => {
      return auditLog.filter((entry) => entry.entityId === entityId);
    },
    [auditLog]
  );

  const getPostLockAuditLog = useCallback(() => {
    return auditLog.filter((entry) => entry.action === "post_lock_edit");
  }, [auditLog]);

  // ── Goal Sheets ──────────────────────────────────────────────────────────

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

  // ── Shared Goals ─────────────────────────────────────────────────────────

  const addSharedGoal = useCallback((goal: SharedGoal) => {
    setSharedGoals((prev) => [...prev, goal]);
  }, []);

  const updateSharedGoal = useCallback(
    (id: string, updates: Partial<SharedGoal>) => {
      setSharedGoals((prev) =>
        prev.map((sg) => (sg.id === id ? { ...sg, ...updates } : sg))
      );
      if (updates.title || updates.target || updates.thrustArea || updates.unit) {
        setGoalSheets((prev) =>
          prev.map((sheet) => ({
            ...sheet,
            goals: sheet.goals.map((goal) => {
              if (goal.sharedGoalId === id) {
                return {
                  ...goal,
                  ...(updates.title && { title: updates.title }),
                  ...(updates.target && { target: updates.target }),
                  ...(updates.thrustArea && { thrustArea: updates.thrustArea }),
                  ...(updates.unit && { unit: updates.unit }),
                };
              }
              return goal;
            }),
          }))
        );
      }
    },
    []
  );

  const getSharedGoalsByEmployee = useCallback(
    (employeeId: string) => {
      return sharedGoals.filter((sg) => sg.assignedTo.includes(employeeId));
    },
    [sharedGoals]
  );

  const pushSharedGoalToSheets = useCallback(
    (sharedGoal: SharedGoal) => {
      setGoalSheets((prev) => {
        return prev.map((sheet) => {
          if (
            sharedGoal.assignedTo.includes(sheet.employeeId) &&
            !sheet.goals.some((g) => g.sharedGoalId === sharedGoal.id)
          ) {
            const newGoal: Goal = {
              id: generateId("sg"),
              title: sharedGoal.title,
              thrustArea: sharedGoal.thrustArea,
              unit: sharedGoal.unit,
              target: sharedGoal.target,
              weightage: sharedGoal.defaultWeightage,
              isShared: true,
              sharedGoalId: sharedGoal.id,
            };
            return {
              ...sheet,
              goals: [...sheet.goals, newGoal],
            };
          }
          return sheet;
        });
      });
    },
    []
  );

  // ── Quarterly Check-ins ──────────────────────────────────────────────────

  const addCheckIn = useCallback((checkIn: QuarterlyCheckIn) => {
    setCheckIns((prev) => [...prev, checkIn]);
  }, []);

  const updateCheckIn = useCallback(
    (id: string, updates: Partial<QuarterlyCheckIn>) => {
      setCheckIns((prev) =>
        prev.map((ci) => (ci.id === id ? { ...ci, ...updates } : ci))
      );
    },
    []
  );

  const getCheckInsByGoalSheet = useCallback(
    (goalSheetId: string) => {
      return checkIns.filter((ci) => ci.goalSheetId === goalSheetId);
    },
    [checkIns]
  );

  const getCheckInsByEmployee = useCallback(
    (employeeId: string) => {
      return checkIns.filter((ci) => ci.employeeId === employeeId);
    },
    [checkIns]
  );

  const getCheckInsByGoal = useCallback(
    (goalId: string) => {
      return checkIns.filter((ci) => ci.goalId === goalId);
    },
    [checkIns]
  );

  // ── Manager Comments ─────────────────────────────────────────────────────

  const addManagerComment = useCallback((comment: ManagerComment) => {
    setManagerComments((prev) => [...prev, comment]);
  }, []);

  const getCommentsByGoalSheet = useCallback(
    (goalSheetId: string) => {
      return managerComments.filter((mc) => mc.goalSheetId === goalSheetId);
    },
    [managerComments]
  );

  const getCommentsByGoal = useCallback(
    (goalId: string, quarter?: Quarter) => {
      return managerComments.filter(
        (mc) => mc.goalId === goalId && (!quarter || mc.quarter === quarter)
      );
    },
    [managerComments]
  );

  // ── Users ────────────────────────────────────────────────────────────────

  const getAllUsers = useCallback(() => MOCK_USERS, []);

  const getUserById = useCallback(
    (id: string) => MOCK_USERS.find((u) => u.id === id),
    []
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        loginWithEmail,
        logout,
        goalSheets,
        addGoalSheet,
        updateGoalSheet,
        getSheetsByEmployee,
        getSheetsByManager,
        getAllSheets,
        sharedGoals,
        addSharedGoal,
        updateSharedGoal,
        getSharedGoalsByEmployee,
        pushSharedGoalToSheets,
        checkIns,
        addCheckIn,
        updateCheckIn,
        getCheckInsByGoalSheet,
        getCheckInsByEmployee,
        getCheckInsByGoal,
        managerComments,
        addManagerComment,
        getCommentsByGoalSheet,
        getCommentsByGoal,
        auditLog,
        addAuditEntry,
        getAuditLog,
        getAuditLogByEntity,
        getPostLockAuditLog,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        getUnreadCount,
        getAllUsers,
        getUserById,
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
