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
    timeoutRef.current = setTimeout(() => setSidebarOpen(true), 300); // slower open
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
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-500 ease-in-out overflow-hidden ${
        sidebarOpen ? "w-72" : "w-20"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white shadow-md h-full border-r border-gray-200 overflow-y-auto">
        {/* User Info */}
        <div
          className={`p-4 border-b border-gray-200 relative flex items-center transition-all duration-300 ${
            sidebarOpen ? "mt-30" : "mt-4"
          }`}
        >
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>

          <div
            className={`transition-all duration-300 ml-3 ${
              sidebarOpen
                ? "opacity-100 max-w-xs"
                : "opacity-0 max-w-0 pointer-events-none"
            }`}
          >
            <h2 className="font-medium text-gray-800 text-sm whitespace-nowrap">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="text-xs text-gray-500 whitespace-nowrap">
              {userData.email}
            </p>
          </div>
        </div>

        {/* Project Progress & Plan Info */}
        <div
          className={`transition-opacity duration-300 px-4 pt-3 ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Project Progress</span>
              <span className="text-xs font-medium text-gray-800">
                {projectCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${projectCompletionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2 rounded-md hover:bg-gray-100">
              <p className="text-[10px] text-gray-500">Subscription</p>
              <p
                className={`text-xs font-medium ${
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
            <div className="bg-gray-50 p-2 rounded-md hover:bg-gray-100">
              <p className="text-[10px] text-gray-500">Plan</p>
              <p className="text-xs font-medium text-gray-800">
                {userData.planType || "Standard"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-3">
          <ul className="space-y-1.5">
            {[
              { id: "overview", label: "Overview", Icon: Activity },
              { id: "domain", label: "Domain", Icon: Globe },
              { id: "website", label: "Website", Icon: Code },
              { id: "questionnaire", label: "Questionnaire", Icon: FileText },
              { id: "phases", label: "Project Phases", Icon: Layers },
              { id: "notes", label: "Notes", Icon: FileText },
              { id: "analytics", label: "Analytics", Icon: BarChart2 },
            ].map(({ id, label, Icon }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id as TabType)}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
                    activeTab === id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${!sidebarOpen ? "justify-center" : ""}`}
                  title={label}
                >
                  <Icon
                    className={`h-5 w-5 ${sidebarOpen ? "mr-3" : ""} ${
                      activeTab === id ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  {sidebarOpen && (
                    <span className="text-sm whitespace-nowrap">{label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Actions - Open */}
        <div
          className={`px-4 pt-2 border-t border-gray-200 mt-3 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={exportClientData}
              className="flex items-center w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <Download className="h-5 w-5 mr-2 text-blue-600" />
              Export Data
            </button>
            <button
              onClick={() => setActiveTab("phases")}
              className="flex items-center w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <Edit className="h-5 w-5 mr-2 text-blue-600" />
              Update Progress
            </button>
          </div>
        </div>

        {/* Quick Actions - Collapsed */}
        {!sidebarOpen && (
          <div className="p-2 border-t border-gray-200 mt-2">
            <div className="flex flex-col items-center space-y-3 py-2">
              <button
                onClick={exportClientData}
                className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200 cursor-pointer"
                title="Export Data"
              >
                <Download className="h-5 w-5 text-blue-600" />
              </button>
              <button
                onClick={() => setActiveTab("phases")}
                className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200 cursor-pointer"
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
