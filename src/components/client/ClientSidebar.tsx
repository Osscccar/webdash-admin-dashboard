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

  // Handle mouse enter - open sidebar with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSidebarOpen(true);
    }, 200); // 200ms delay before opening
  };

  // Handle mouse leave - close sidebar with delay
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSidebarOpen(false);
    }, 300); // 300ms delay before closing (slightly longer to avoid accidental closing)
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out ${
        sidebarOpen ? "w-72" : "w-20"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white shadow-md h-full border-r border-gray-200 overflow-y-auto">
        {/* Client info summary - Show full info when open, only icon when closed */}
        <div
          className={`p-5 border-b border-gray-200 mt-14 ${
            sidebarOpen ? "" : "flex justify-center"
          } overflow-hidden`}
        >
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3 animate-in slide-in-from-left duration-300 ease-in-out">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center aspect-square transition-all duration-300">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="animate-in fade-in duration-300 delay-100">
                  <h2 className="font-medium text-gray-800 text-lg">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-bottom duration-300 delay-150">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Project Progress
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {projectCompletionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-700 ease-out-expo"
                    style={{ width: `${projectCompletionPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom duration-300 delay-200">
                <div className="bg-gray-50 p-3 rounded-lg transform transition-all duration-300 hover:bg-gray-100">
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
                <div className="bg-gray-50 p-3 rounded-lg transform transition-all duration-300 hover:bg-gray-100">
                  <p className="text-xs text-gray-500">Plan</p>
                  <p className="text-sm font-medium text-gray-800">
                    {userData.planType || "Standard"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center py-5 transition-all duration-300 ease-in-out">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center aspect-square transition-all duration-300">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Show icons and text when open, only icons when closed */}
        <nav className="p-3">
          <ul className="space-y-2">
            <li className="animate-in slide-in-from-left duration-300 delay-100">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title="Overview"
              >
                <Activity
                  className={`h-5 w-5 ${sidebarOpen ? "mr-4" : ""} ${
                    activeTab === "overview" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                {sidebarOpen && <span className="text-base">Overview</span>}
              </button>
            </li>
            <li className="animate-in slide-in-from-left duration-300 delay-150">
              <button
                onClick={() => setActiveTab("domain")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === "domain"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title="Domain"
              >
                <Globe
                  className={`h-5 w-5 ${sidebarOpen ? "mr-4" : ""} ${
                    activeTab === "domain" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                {sidebarOpen && <span className="text-base">Domain</span>}
              </button>
            </li>
            <li className="animate-in slide-in-from-left duration-300 delay-200">
              <button
                onClick={() => setActiveTab("website")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === "website"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title="Website"
              >
                <Code
                  className={`h-5 w-5 ${sidebarOpen ? "mr-4" : ""} ${
                    activeTab === "website" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                {sidebarOpen && <span className="text-base">Website</span>}
              </button>
            </li>
            <li className="animate-in slide-in-from-left duration-300 delay-250">
              <button
                onClick={() => setActiveTab("questionnaire")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === "questionnaire"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title="Questionnaire"
              >
                <FileText
                  className={`h-5 w-5 ${sidebarOpen ? "mr-4" : ""} ${
                    activeTab === "questionnaire"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                />
                {sidebarOpen && (
                  <span className="text-base">Questionnaire</span>
                )}
              </button>
            </li>
            <li className="animate-in slide-in-from-left duration-300 delay-300">
              <button
                onClick={() => setActiveTab("phases")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === "phases"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title="Project Phases"
              >
                <Layers
                  className={`h-5 w-5 ${sidebarOpen ? "mr-4" : ""} ${
                    activeTab === "phases" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                {sidebarOpen && (
                  <span className="text-base">Project Phases</span>
                )}
              </button>
            </li>
            <li className="animate-in slide-in-from-left duration-300 delay-350">
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === "notes"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title="Notes"
              >
                <FileText
                  className={`h-5 w-5 ${sidebarOpen ? "mr-4" : ""} ${
                    activeTab === "notes" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                {sidebarOpen && <span className="text-base">Notes</span>}
              </button>
            </li>
            <li className="animate-in slide-in-from-left duration-300 delay-400">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title="Analytics"
              >
                <BarChart2
                  className={`h-5 w-5 ${sidebarOpen ? "mr-4" : ""} ${
                    activeTab === "analytics"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                />
                {sidebarOpen && <span className="text-base">Analytics</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Quick actions - Only show when sidebar is open */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200 mt-4 animate-in fade-in duration-300 delay-200">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={exportClientData}
                className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-all duration-300 cursor-pointer animate-in slide-in-from-left duration-300 delay-250"
              >
                <Download className="h-5 w-5 mr-3 text-blue-600" />
                Export Data
              </button>
              <button
                onClick={() => {
                  setActiveTab("phases");
                }}
                className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-all duration-300 cursor-pointer animate-in slide-in-from-left duration-300 delay-300"
              >
                <Edit className="h-5 w-5 mr-3 text-blue-600" />
                Update Progress
              </button>
            </div>
          </div>
        )}

        {/* Show only icons for quick actions when sidebar is collapsed */}
        {!sidebarOpen && (
          <div className="p-3 border-t border-gray-200 mt-4">
            <div className="flex flex-col items-center space-y-4 py-2">
              <button
                onClick={exportClientData}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200 cursor-pointer"
                title="Export Data"
              >
                <Download className="h-5 w-5 text-blue-600" />
              </button>
              <button
                onClick={() => {
                  setActiveTab("phases");
                }}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200 cursor-pointer"
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
