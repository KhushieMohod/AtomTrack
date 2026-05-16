"use client";

import React, { useState } from "react";
import { SharedGoal, UnitOfMeasurement, User } from "@/types";
import { generateId } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const UNITS: UnitOfMeasurement[] = ["Numeric", "Percentage", "Timeline", "Zero-based"];

interface SharedGoalFormProps {
  employees: User[];
  onSubmit: (goal: SharedGoal) => void;
  existingGoals: SharedGoal[];
}

export function SharedGoalForm({ employees, onSubmit, existingGoals }: SharedGoalFormProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [thrustArea, setThrustArea] = useState("");
  const [unit, setUnit] = useState<UnitOfMeasurement>("Percentage");
  const [target, setTarget] = useState("");
  const [defaultWeightage, setDefaultWeightage] = useState(15);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const toggleEmployee = (empId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  const selectAll = () => {
    setSelectedEmployees(employees.map((e) => e.id));
  };

  const clearAll = () => {
    setSelectedEmployees([]);
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!title.trim()) errs.push("Title is required.");
    if (!thrustArea.trim()) errs.push("Thrust Area is required.");
    if (!target.trim()) errs.push("Target is required.");
    if (defaultWeightage < 10) errs.push("Default weightage must be at least 10%.");
    if (selectedEmployees.length === 0) errs.push("Select at least one employee.");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newGoal: SharedGoal = {
      id: generateId("sg"),
      title,
      thrustArea,
      unit,
      target,
      defaultWeightage,
      createdBy: "admin-001",
      assignedTo: selectedEmployees,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newGoal);
    resetForm();
    setShowDialog(false);
  };

  const resetForm = () => {
    setTitle("");
    setThrustArea("");
    setUnit("Percentage");
    setTarget("");
    setDefaultWeightage(15);
    setSelectedEmployees([]);
    setErrors([]);
  };

  return (
    <>
      {/* Existing Shared Goals List */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Departmental KPIs</CardTitle>
              <CardDescription>
                Shared goals pushed to employees across the organization.
              </CardDescription>
            </div>
            <Button
              id="create-shared-goal-btn"
              onClick={() => setShowDialog(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
            >
              + New KPI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {existingGoals.length === 0 ? (
            <p className="text-center text-slate-400 py-8">
              No departmental KPIs created yet. Click &quot;+ New KPI&quot; to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {existingGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50/60 to-orange-50/40 border border-amber-100 hover:border-amber-200 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-800">{goal.title}</span>
                      <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                        Shared
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{goal.thrustArea}</span>
                      <span>·</span>
                      <span>Target: {goal.target}</span>
                      <span>·</span>
                      <span>{goal.unit}</span>
                      <span>·</span>
                      <span>Default: {goal.defaultWeightage}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {goal.assignedTo.map((empId) => {
                        const emp = employees.find((e) => e.id === empId);
                        return (
                          <Badge
                            key={empId}
                            variant="outline"
                            className="text-xs bg-white border-slate-200 text-slate-600"
                          >
                            {emp?.name || empId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 ml-4">
                    {new Date(goal.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Departmental KPI</DialogTitle>
            <DialogDescription>
              Push a shared goal to multiple employees. They can only adjust the weightage.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                {errors.map((err, i) => (
                  <p key={i} className="text-xs text-red-600">• {err}</p>
                ))}
              </div>
            )}

            {/* Title */}
            <div>
              <Label htmlFor="sg-title" className="text-sm font-medium text-slate-600">
                KPI Title
              </Label>
              <Input
                id="sg-title"
                placeholder="e.g. Achieve 95% Customer Satisfaction Score"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5"
              />
            </div>

            {/* Thrust Area + Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sg-thrust" className="text-sm font-medium text-slate-600">
                  Thrust Area
                </Label>
                <Input
                  id="sg-thrust"
                  placeholder="e.g. Customer Experience"
                  value={thrustArea}
                  onChange={(e) => setThrustArea(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="sg-unit" className="text-sm font-medium text-slate-600">
                  Unit of Measurement
                </Label>
                <Select value={unit} onValueChange={(val) => { if (val) setUnit(val as UnitOfMeasurement); }}>
                  <SelectTrigger id="sg-unit" className="w-full mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target + Weightage */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sg-target" className="text-sm font-medium text-slate-600">
                  Target
                </Label>
                <Input
                  id="sg-target"
                  placeholder="e.g. 95"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="sg-weightage" className="text-sm font-medium text-slate-600">
                  Default Weightage (%)
                </Label>
                <Input
                  id="sg-weightage"
                  type="number"
                  min={10}
                  max={100}
                  value={defaultWeightage}
                  onChange={(e) => setDefaultWeightage(parseInt(e.target.value) || 0)}
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Employee Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-slate-600">
                  Assign to Employees
                </Label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={clearAll}
                    className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto rounded-lg border border-slate-200 p-2">
                {employees.map((emp) => (
                  <label
                    key={emp.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedEmployees.includes(emp.id)
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-white border border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{emp.name}</p>
                      <p className="text-xs text-slate-400">{emp.email}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedEmployees.length} employee(s) selected
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { resetForm(); setShowDialog(false); }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              id="push-shared-goal-btn"
              onClick={handleSubmit}
              className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
            >
              Push KPI to Employees
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
