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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  return (
    <div
      className={`fixed left-0 top-0 h-full z-20 transition-all duration-300 ease-in-out ${
        sidebarOpen ? "w-72" : "w-20"
      }`}
    >
      <div className="bg-white shadow-md h-full border-r border-gray-200 overflow-y-auto">
        {/* Toggle sidebar button for desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-5 top-20 bg-blue-600 hover:bg-blue-700 rounded-full p-2 shadow-md text-white flex items-center justify-center z-10 h-10 w-10"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-6 w-6" />
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </button>

        {/* Client info summary - Show full info when open, only icon when closed */}
        <div
          className={`p-5 border-b border-gray-200 mt-14 ${
            sidebarOpen ? "" : "flex justify-center"
          }`}
        >
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-medium text-gray-800 text-lg">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Project Progress
                  </span>
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
                <div className="bg-gray-50 p-3 rounded-lg">
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
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Plan</p>
                  <p className="text-sm font-medium text-gray-800">
                    {userData.planType || "Standard"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center py-5">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Show icons and text when open, only icons when closed */}
        <nav className="p-3">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
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
            <li>
              <button
                onClick={() => setActiveTab("domain")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
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
            <li>
              <button
                onClick={() => setActiveTab("website")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
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
            <li>
              <button
                onClick={() => setActiveTab("questionnaire")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
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
            <li>
              <button
                onClick={() => setActiveTab("phases")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
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
            <li>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
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
            <li>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
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
          <div className="p-4 border-t border-gray-200 mt-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={exportClientData}
                className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-200 cursor-pointer"
              >
                <Download className="h-5 w-5 mr-3 text-blue-600" />
                Export Data
              </button>
              <button
                onClick={() => {
                  setActiveTab("phases");
                }}
                className="flex items-center w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-200 cursor-pointer"
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
