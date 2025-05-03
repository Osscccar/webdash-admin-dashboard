/* eslint-disable */
"use client";

import type React from "react";
import {
  Activity,
  Users,
  Calendar,
  PieChart,
  Globe,
  ExternalLink,
  FileText,
  Layers,
  Code,
  Download,
} from "lucide-react";
import type { UserData, ProjectPhase, TabType } from "@/types";
import { CollapsibleSection } from "@/components/client/CollapsibleSection";

interface OverviewTabProps {
  userData: UserData;
  projectPhases: ProjectPhase[];
  projectCompletionPercentage: number;
  domainInfo: { name: string; isCustom: boolean };
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  exportClientData: () => void;
  // Add new props for role-based access
  tabRoleMap?: Record<string, string[]>;
  hasAccess?: (role: string) => boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  userData,
  projectPhases,
  projectCompletionPercentage,
  domainInfo,
  setActiveTab,
  exportClientData,
  // Add new props with defaults
  tabRoleMap = {},
  hasAccess = () => true,
}) => {
  // Function to check if user has access to a tab
  const hasTabAccess = (tab: string): boolean => {
    // If no tabRoleMap is provided for this tab, assume everyone has access
    if (!tabRoleMap[tab]) return true;

    // Check if the user has any of the required roles for the tab
    return tabRoleMap[tab].some((role) => hasAccess(role));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Client Overview
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={exportClientData}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <Download className="h-4 w-4 mr-1.5 text-gray-500" />
            Export
          </button>
          {hasTabAccess("notes") && (
            <button
              onClick={() => setActiveTab("notes")}
              className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-1.5 text-gray-500" />
              Notes
            </button>
          )}
        </div>
      </div>

      {/* Client stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Client Since</p>
              <p className="text-lg font-semibold text-blue-900">
                {userData.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-start">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <PieChart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700">Project Status</p>
              <p className="text-lg font-semibold text-green-900">
                {projectCompletionPercentage}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client information */}
      <CollapsibleSection
        title="Client Information"
        icon={<Users className="h-5 w-5 text-blue-600" />}
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Users className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-800">
                      {userData.firstName} {userData.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-800">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-800">
                      {userData.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Subscription Details
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FileText className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Plan Type</p>
                    <p className="text-sm font-medium text-gray-800">
                      {userData.planType || "Standard"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Billing Cycle</p>
                    <p className="text-sm text-gray-800">
                      {userData.billingCycle || "Monthly"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Activity className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Subscription Status</p>
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
                        : userData.subscriptionStatus === "pending"
                        ? "Pending"
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Website Status
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Globe className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Domain Name</p>
                    {domainInfo.name ? (
                      <div className="flex items-center">
                        <p className="text-sm text-gray-800">
                          {domainInfo.name}
                        </p>
                        <span
                          className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                            domainInfo.isCustom
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-green-100 text-green-700 border border-green-200"
                          }`}
                        >
                          {domainInfo.isCustom ? "Custom" : "Free"}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No domain selected
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <ExternalLink className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Live Website</p>
                    {userData.websiteUrl ? (
                      <a
                        href={
                          userData.websiteUrl.startsWith("http")
                            ? userData.websiteUrl
                            : `https://${userData.websiteUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        {userData.websiteUrl}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">Not published yet</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Activity className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Project Progress</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${projectCompletionPercentage}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-800">
                        {projectCompletionPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Recent Activity
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                    <Calendar className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Account Created</p>
                    <p className="text-xs text-gray-500">
                      {userData.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Date not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                    <Calendar className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Last Updated</p>
                    <p className="text-xs text-gray-500">
                      {userData.updatedAt
                        ? new Date(userData.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Not updated yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Project phases summary */}
      <CollapsibleSection
        title="Project Phases"
        icon={<Layers className="h-5 w-5 text-blue-600" />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          {projectPhases.map((phase, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      phase.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : phase.status === "active"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {phase.name.toLowerCase() === "planning" ? (
                      <FileText className="h-4 w-4" />
                    ) : phase.name.toLowerCase() === "design" ? (
                      <PieChart className="h-4 w-4" />
                    ) : phase.name.toLowerCase() === "revisions" ? (
                      <FileText className="h-4 w-4" />
                    ) : phase.name.toLowerCase() === "launch" ? (
                      <Globe className="h-4 w-4" />
                    ) : (
                      <Layers className="h-4 w-4" />
                    )}
                  </div>
                  <h4 className="font-medium text-gray-800">{phase.name}</h4>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
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
              </div>

              <div className="space-y-2 ml-11">
                {phase.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-center">
                    {task.completed ? (
                      <div className="h-4 w-4 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-400 mr-2"></div>
                    )}
                    <span
                      className={`text-sm ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {task.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {hasTabAccess("phases") && (
            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab("phases")}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-1" />
                Manage Project Phases
              </button>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Quick actions - only show buttons for tabs the user has access to */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {hasTabAccess("domain") && (
          <button
            onClick={() => setActiveTab("domain")}
            className="bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm transition-colors duration-200 cursor-pointer"
          >
            <Globe className="h-5 w-5 mr-3 text-blue-600" />
            Manage Domain
          </button>
        )}

        {hasTabAccess("website") && (
          <button
            onClick={() => setActiveTab("website")}
            className="bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm transition-colors duration-200 cursor-pointer"
          >
            <Code className="h-5 w-5 mr-3 text-blue-600" />
            Manage Website
          </button>
        )}
      </div>
    </div>
  );
};
