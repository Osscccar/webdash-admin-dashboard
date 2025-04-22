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
import type { UserData, TabType } from "@/types";

interface ClientSidebarProps {
  userData: UserData;
  projectCompletionPercentage: number;
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  sidebarOpen: boolean;
  exportClientData: () => void;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({
  userData,
  projectCompletionPercentage,
  activeTab,
  setActiveTab,
  sidebarOpen,
  exportClientData,
}) => {
  return (
    <div
      className={`lg:w-64 flex-shrink-0 transition-all duration-300 ease-in-out ${
        sidebarOpen ? "block" : "hidden lg:block"
      }`}
    >
      <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-20">
        {/* Client info summary */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-medium text-gray-800">
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Project Progress</span>
              <span className="text-sm font-medium text-gray-800">
                {projectCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${projectCompletionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2 rounded-lg">
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
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500">Plan</p>
              <p className="text-sm font-medium text-gray-800">
                {userData.planType || "Standard"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Activity
                  className={`h-4 w-4 mr-3 ${
                    activeTab === "overview" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("domain")}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                  activeTab === "domain"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Globe
                  className={`h-4 w-4 mr-3 ${
                    activeTab === "domain" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                Domain
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("website")}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                  activeTab === "website"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Code
                  className={`h-4 w-4 mr-3 ${
                    activeTab === "website" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                Website
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("questionnaire")}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                  activeTab === "questionnaire"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FileText
                  className={`h-4 w-4 mr-3 ${
                    activeTab === "questionnaire"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                />
                Questionnaire
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("phases")}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                  activeTab === "phases"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Layers
                  className={`h-4 w-4 mr-3 ${
                    activeTab === "phases" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                Project Phases
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                  activeTab === "notes"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FileText
                  className={`h-4 w-4 mr-3 ${
                    activeTab === "notes" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                Notes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BarChart2
                  className={`h-4 w-4 mr-3 ${
                    activeTab === "analytics"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                />
                Analytics
              </button>
            </li>
          </ul>
        </nav>

        {/* Quick actions */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={exportClientData}
              className="flex items-center w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2 text-blue-600" />
              Export Data
            </button>
            <button
              onClick={() => {
                setActiveTab("phases");
              }}
              className="flex items-center w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2 text-blue-600" />
              Update Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
