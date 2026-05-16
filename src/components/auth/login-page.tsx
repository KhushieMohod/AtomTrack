"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-context";
import { Role } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_USERS } from "@/lib/mock-data";

const ROLE_CONFIG: {
  role: Role;
  label: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}[] = [
  {
    role: "employee",
    label: "Employee",
    description: "Create and manage your performance goals",
    icon: "👤",
    route: "/employee",
    color: "from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-400",
  },
  {
    role: "manager",
    label: "Manager (L1)",
    description: "Review and approve team goal sheets",
    icon: "👥",
    route: "/manager",
    color: "from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400",
  },
  {
    role: "admin",
    label: "Admin / HR",
    description: "Oversee organization-wide goals and policies",
    icon: "🏢",
    route: "/admin",
    color: "from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400",
  },
];

export default function LoginPage() {
  const { login } = useAppState();
  const router = useRouter();

  const handleLogin = (role: Role, route: string) => {
    login(role);
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Atom<span className="text-blue-600">Track</span>
            </h1>
          </div>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Performance Goal Management System
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Select your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {ROLE_CONFIG.map(({ role, label, description, icon, route, color }) => {
            const user = MOCK_USERS.find((u) => u.role === role);
            return (
              <Card
                key={role}
                id={`login-card-${role}`}
                className={`
                  bg-gradient-to-br ${color} border-2 
                  cursor-pointer transition-all duration-300
                  hover:shadow-lg hover:-translate-y-1
                  group
                `}
                onClick={() => handleLogin(role, route)}
              >
                <CardHeader className="pb-3">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-800">
                    {label}
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user && (
                    <div className="bg-white/60 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-sm font-medium text-slate-700">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  )}
                  <Button
                    id={`login-btn-${role}`}
                    className="w-full mt-4 cursor-pointer"
                    variant="outline"
                  >
                    Sign in as {label}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-10">
          This is a demonstration environment with mock authentication.
        </p>
      </div>
    </div>
  );
}
