/* eslint-disable */
"use client";

import type React from "react";
import {
  BarChart2,
  TrendingUp,
  Users,
  Globe,
  Clock,
  Calendar,
} from "lucide-react";
import type { UserData } from "@/types";
import { getStringValue } from "@/utils/stringHelpers";

interface AnalyticsTabProps {
  userData: UserData;
  projectCompletionPercentage: number;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  userData,
  projectCompletionPercentage,
}) => {
  // Calculate days since account creation
  const daysSinceCreation = userData.createdAt
    ? Math.floor(
        (new Date().getTime() - new Date(userData.createdAt).getTime()) /
          (1000 * 3600 * 24)
      )
    : 0;

  // Calculate days since last update
  const daysSinceUpdate = userData.updatedAt
    ? Math.floor(
        (new Date().getTime() - new Date(userData.updatedAt).getTime()) /
          (1000 * 3600 * 24)
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
          Client Analytics
        </h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Project Progress</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${projectCompletionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {projectCompletionPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Subscription Status</p>
              <p
                className={`text-lg font-semibold ${
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
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start">
            <div className="bg-amber-100 rounded-full p-2 mr-3">
              <Globe className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Website Status</p>
              <p className="text-lg font-semibold text-gray-800">
                {userData.websiteUrl ? "Published" : "Not Published"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 text-blue-600 mr-2" />
              <p className="text-sm font-medium text-gray-700">
                Account Created
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {daysSinceCreation} days ago
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-blue-600 mr-2" />
              <p className="text-sm font-medium text-gray-700">Last Updated</p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {userData.updatedAt
                ? new Date(userData.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {daysSinceUpdate} days ago
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <Globe className="h-4 w-4 text-blue-600 mr-2" />
              <p className="text-sm font-medium text-gray-700">
                Website Published
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {userData.websitePublishedDate
                ? new Date(userData.websitePublishedDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )
                : "Not Published"}
            </p>
            {userData.websitePublishedDate && (
              <p className="text-xs text-gray-500 mt-1">
                {Math.floor(
                  (new Date().getTime() -
                    new Date(userData.websitePublishedDate).getTime()) /
                    (1000 * 3600 * 24)
                )}{" "}
                days ago
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Project Phases Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Project Phases
        </h3>
        <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
          {userData.projectPhases && userData.projectPhases.length > 0 ? (
            <div className="flex h-full">
              {userData.projectPhases.map((phase, index) => (
                <div
                  key={index}
                  className={`h-full flex items-center justify-center text-xs font-medium text-white ${
                    phase.status === "completed"
                      ? "bg-green-500"
                      : phase.status === "active"
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                  style={{
                    width: `${100 / (userData.projectPhases?.length || 1)}%`,
                  }}
                >
                  {phase.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500 text-sm">
              No project phases defined
            </div>
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Start</span>
          <span>Progress</span>
          <span>Completion</span>
        </div>
      </div>
    </div>
  );
};
