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
          <div className="transition-all duration-300 ease-in-out">
            {sidebarOpen ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center aspect-square transition-all duration-300">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="transition-opacity duration-300 ease-in-out opacity-100">
                    <h2 className="font-medium text-gray-800 text-lg">
                      {userData.firstName} {userData.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
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
                      className="bg-blue-600 h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${projectCompletionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
                  <div className="bg-gray-50 p-3 rounded-lg transition-all duration-200 hover:bg-gray-100">
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
                  <div className="bg-gray-50 p-3 rounded-lg transition-all duration-200 hover:bg-gray-100">
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
        </div>

        {/* Navigation - Show icons and text when open, only icons when closed */}
        <nav className="p-3">
          <ul className="space-y-2">
            {[
              { id: "overview", icon: Activity, label: "Overview" },
              { id: "domain", icon: Globe, label: "Domain" },
              { id: "website", icon: Code, label: "Website" },
              { id: "questionnaire", icon: FileText, label: "Questionnaire" },
              { id: "phases", icon: Layers, label: "Project Phases" },
              { id: "notes", icon: FileText, label: "Notes" },
              { id: "analytics", icon: BarChart2, label: "Analytics" },
            ].map((item, index) => (
              <li
                key={item.id}
                className="transition-transform duration-300 ease-in-out"
                style={{
                  transitionDelay: sidebarOpen
                    ? `${100 + index * 50}ms`
                    : "0ms",
                }}
              >
                <button
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${!sidebarOpen ? "justify-center" : ""}`}
                  title={item.label}
                >
                  <item.icon
                    className={`h-5 w-5 ${sidebarOpen ? "mr-4" : ""} ${
                      activeTab === item.id ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  {sidebarOpen && (
                    <span className="text-base transition-opacity duration-300 ease-in-out opacity-100">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick actions */}
        <div
          className={`p-3 border-t border-gray-200 mt-4 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "opacity-100" : ""
          }`}
        >
          {sidebarOpen ? (
            <div className="transition-all duration-300 ease-in-out">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-1">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={exportClientData}
                  className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <Download className="h-5 w-5 mr-3 text-blue-600" />
                  Export Data
                </button>
                <button
                  onClick={() => {
                    setActiveTab("phases");
                  }}
                  className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <Edit className="h-5 w-5 mr-3 text-blue-600" />
                  Update Progress
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 py-2">
              <button
                onClick={exportClientData}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-200 cursor-pointer"
                title="Export Data"
              >
                <Download className="h-5 w-5 text-blue-600" />
              </button>
              <button
                onClick={() => {
                  setActiveTab("phases");
                }}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-200 cursor-pointer"
                title="Update Progress"
              >
                <Edit className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
