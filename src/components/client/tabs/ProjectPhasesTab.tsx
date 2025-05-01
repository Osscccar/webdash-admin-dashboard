/* eslint-disable */
"use client";

import type React from "react";
import { useState } from "react";
import {
  Layers,
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  Save,
  Loader2,
  FileText,
  PieChart,
  Globe,
} from "lucide-react";
import type { ProjectPhase } from "@/types";
import { sendProjectPhaseUpdateEmail } from "@/lib/email-service";

interface ProjectPhasesTabProps {
  projectPhases: ProjectPhase[];
  updatePhaseStatus: (
    index: number,
    status: "completed" | "active" | "pending"
  ) => void;
  toggleTaskCompletion: (phaseIndex: number, taskIndex: number) => void;
  addTask: (phaseIndex: number, taskName: string) => void;
  removeTask: (phaseIndex: number, taskIndex: number) => void;
  saveChanges: () => Promise<void>;
  saving: boolean;
}

export const ProjectPhasesTab: React.FC<ProjectPhasesTabProps> = ({
  projectPhases,
  updatePhaseStatus,
  toggleTaskCompletion,
  addTask,
  removeTask,
  saveChanges,
  saving,
}) => {
  const [newTaskValues, setNewTaskValues] = useState<{ [key: number]: string }>(
    {}
  );

  const handleAddTask = (phaseIndex: number) => {
    const taskName = newTaskValues[phaseIndex] || "";
    if (taskName.trim()) {
      addTask(phaseIndex, taskName);
      // Clear the input after adding
      setNewTaskValues({ ...newTaskValues, [phaseIndex]: "" });
    }
  };

  const getPhaseIcon = (phaseName: string) => {
    switch (phaseName.toLowerCase()) {
      case "planning":
        return <FileText className="h-5 w-5" />;
      case "design":
        return <PieChart className="h-5 w-5" />;
      case "revisions":
        return <FileText className="h-5 w-5" />;
      case "launch":
        return <Globe className="h-5 w-5" />;
      default:
        return <Layers className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Layers className="h-5 w-5 mr-2 text-blue-600" />
          Project Phases
        </h2>
        <button
          onClick={saveChanges}
          disabled={saving}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-70 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {projectPhases.map((phase, phaseIndex) => (
          <div
            key={phaseIndex}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    phase.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : phase.status === "active"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {getPhaseIcon(phase.name)}
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  {phase.name}
                </h3>
              </div>

              <div className="flex items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full mr-3 ${
                    phase.status === "completed"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : phase.status === "active"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {phase.status === "completed"
                    ? "Completed"
                    : phase.status === "active"
                    ? "Active"
                    : "Pending"}
                </span>

                <select
                  value={phase.status}
                  onChange={(e) =>
                    updatePhaseStatus(
                      phaseIndex,
                      e.target.value as "completed" | "active" | "pending"
                    )
                  }
                  className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tasks</h4>
              <div className="space-y-2">
                {phase.tasks.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          toggleTaskCompletion(phaseIndex, taskIndex)
                        }
                        className="mr-3 flex-shrink-0 cursor-pointer"
                        aria-label={
                          task.completed
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                      </button>
                      <span
                        className={`${
                          task.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-800"
                        } transition-all duration-200`}
                      >
                        {task.name}
                      </span>
                    </div>

                    <button
                      onClick={() => removeTask(phaseIndex, taskIndex)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                      aria-label="Remove task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Add task form */}
                <div className="mt-4 flex items-center">
                  <input
                    type="text"
                    placeholder="Add new task..."
                    value={newTaskValues[phaseIndex] || ""}
                    onChange={(e) =>
                      setNewTaskValues({
                        ...newTaskValues,
                        [phaseIndex]: e.target.value,
                      })
                    }
                    className="flex-1 bg-white border border-gray-300 rounded-l-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTask(phaseIndex);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddTask(phaseIndex)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg px-3 py-2 transition-colors duration-200 cursor-pointer"
                    aria-label="Add task"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={saveChanges}
          disabled={saving}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-70 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};
