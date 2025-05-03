/* eslint-disable */
"use client";

import type React from "react";
import {
  ArrowLeft,
  Search,
  X,
  Download,
  Loader2,
  User,
  ChevronDown,
  Settings,
  HelpCircle,
  LogOut,
  Save,
} from "lucide-react";
import type { UserData, TabType } from "@/types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ClientHeaderProps {
  userData: UserData;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isExporting: boolean;
  exportClientData: () => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  saving: boolean;
  saveChanges: () => Promise<void>;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  userData,
  sidebarOpen,
  setSidebarOpen,
  router,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
  isExporting,
  exportClientData,
  isNotificationsOpen,
  setIsNotificationsOpen,
  isUserMenuOpen,
  setIsUserMenuOpen,
  setActiveTab,
  saving,
  saveChanges,
}) => {
  return (
    <div className="top-0 z-30">
      <div className="px-6 flex justify-between items-center">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="hidden md:inline font-medium">
              Back to Dashboard
            </span>
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {isSearchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-10">
                <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                  <Search className="h-4 w-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search client data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Export button */}
          <div className="relative">
            <button
              onClick={exportClientData}
              disabled={isExporting}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer"
              title="Export client data"
            >
              {isExporting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center aspect-square">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Save button */}
          <button
            onClick={saveChanges}
            disabled={saving}
            className="hidden md:flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-70 cursor-pointer"
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
    </div>
  );
};
