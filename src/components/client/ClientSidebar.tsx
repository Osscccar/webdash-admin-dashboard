/* eslint-disable */
"use client";

import type React from "react";
import {
  Activity,
  Globe,
  Code,
  FileText,
  Layers,
  BarChart2,
  Download,
  Edit,
  User,
} from "lucide-react";
import { useEffect, useRef } from "react";
import type { UserData, TabType } from "@/types";

interface ClientSidebarProps {
  userData: UserData;
  projectCompletionPercentage: number;
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  exportClientData: () => void;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({
  userData,
  projectCompletionPercentage,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  exportClientData,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSidebarOpen(true), 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSidebarOpen(false), 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`fixed left-0 top-0 h-full z-40 transition-all ${
        sidebarOpen ? "w-72 duration-300" : "w-20 duration-200"
      } ease-in-out`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white shadow-md h-full border-r border-gray-200 overflow-y-auto relative">
        {/* Header */}
        <div
          className={`border-b border-gray-200 ${
            sidebarOpen ? "px-5 py-5" : "py-4 px-0"
          } ${sidebarOpen ? "" : "flex justify-center items-center"}`}
        >
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="font-medium text-gray-800 text-lg">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          )}
        </div>

        {/* Progress + Details */}
        {sidebarOpen && (
          <div className="px-5 pt-4 pb-2 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Project Progress</span>
              <span className="text-sm font-medium text-gray-800">
                {projectCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${projectCompletionPercentage}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100">
                <p className="text-xs text-gray-500">Subscription</p>
                <p
                  className={`text-sm font-medium ${
                    userData.subscriptionStatus === "active"
                      ? "text-green-600"
                      : userData.subscriptionStatus === "canceled"
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
                >
                  {userData.subscriptionStatus === "active"
                    ? "Active"
                    : userData.subscriptionStatus === "canceled"
                    ? "Canceled"
                    : "Pending"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100">
                <p className="text-xs text-gray-500">Plan</p>
                <p className="text-sm font-medium text-gray-800">
                  {userData.planType || "Standard"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div
          className={`${
            sidebarOpen
              ? "px-3 pt-4"
              : "absolute top-[5.5rem] left-0 w-full px-1"
          }`}
        >
          <nav>
            <ul className="space-y-2">
              {[
                { tab: "overview", icon: Activity, label: "Overview" },
                { tab: "domain", icon: Globe, label: "Domain" },
                { tab: "website", icon: Code, label: "Website" },
                {
                  tab: "questionnaire",
                  icon: FileText,
                  label: "Questionnaire",
                },
                { tab: "phases", icon: Layers, label: "Project Phases" },
                { tab: "notes", icon: FileText, label: "Notes" },
                { tab: "analytics", icon: BarChart2, label: "Analytics" },
              ].map(({ tab, icon: Icon, label }) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab as TabType)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                      activeTab === tab
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${!sidebarOpen ? "justify-center" : ""}`}
                    title={label}
                  >
                    <Icon
                      className={`h-5 w-5 ${sidebarOpen ? "mr-4" : ""} ${
                        activeTab === tab ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    {sidebarOpen && <span className="text-base">{label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Quick Actions */}
        {sidebarOpen ? (
          <div className="p-4 border-t border-gray-200 mt-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={exportClientData}
                className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-200"
              >
                <Download className="h-5 w-5 mr-3 text-blue-600" />
                Export Data
              </button>
              <button
                onClick={() => setActiveTab("phases")}
                className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-200"
              >
                <Edit className="h-5 w-5 mr-3 text-blue-600" />
                Update Progress
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-0 w-full p-3 border-t border-gray-200 bg-white">
            <div className="flex flex-col items-center space-y-4 py-2">
              <button
                onClick={exportClientData}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                title="Export Data"
              >
                <Download className="h-5 w-5 text-blue-600" />
              </button>
              <button
                onClick={() => setActiveTab("phases")}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                title="Update Progress"
              >
                <Edit className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
