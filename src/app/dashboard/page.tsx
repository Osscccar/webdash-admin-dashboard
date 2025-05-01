"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  Clock,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  Download,
  ArrowUpDown,
  X,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  ExternalLink,
  CheckSquare,
  Square,
} from "lucide-react";
import type { UserData } from "@/types";

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortField, setSortField] = useState<
    "name" | "email" | "date" | "status" | "questionnaireDate"
  >("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [planFilter, setPlanFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeTab, setActiveTab] = useState<
    "clients" | "fulfilment" | "fulfilled"
  >("clients");
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    userId: string | null;
  }>({
    show: false,
    userId: null,
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);

        const usersData = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as UserData)
        );

        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const formatDate = (dateString?: string, includeTime = false) => {
    if (!dateString) return "N/A";
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
      };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "Invalid date";
    }
  };

  const getTimeRemaining = (completionDate?: string) => {
    if (!completionDate) return null;

    const completed = new Date(completionDate);
    const deadline = new Date(completed);
    deadline.setDate(deadline.getDate() + 5); // Add 5 days to completion date

    const now = new Date();
    const totalMs = deadline.getTime() - now.getTime();

    // If time is up or not valid
    if (totalMs <= 0) return null;

    // Calculate days, hours, minutes
    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  const handleViewClientDetails = (userId: string) => {
    router.push(`/dashboard/client/${userId}`);
  };

  const toggleSort = (
    field: "name" | "email" | "date" | "status" | "questionnaireDate"
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id || ""));
    }
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmDelete({ show: true, userId });
  };

  const confirmDeleteUser = async () => {
    if (!confirmDelete.userId) return;

    // In a real app, you would delete the user from the database here
    // For now, we'll just remove it from the local state
    setUsers(users.filter((user) => user.id !== confirmDelete.userId));
    setSelectedUsers(selectedUsers.filter((id) => id !== confirmDelete.userId));
    setConfirmDelete({ show: false, userId: null });
  };

  const cancelDeleteUser = () => {
    setConfirmDelete({ show: false, userId: null });
  };

  const handleBulkDelete = () => {
    // In a real app, you would delete the selected users from the database here
    // For now, we'll just remove them from the local state
    setUsers(users.filter((user) => !selectedUsers.includes(user.id || "")));
    setSelectedUsers([]);
    setIsSelectMode(false);
  };

  const handleExportSelected = () => {
    // In a real app, you would export the selected users here
    console.log("Exporting users:", selectedUsers);
    // For now, we'll just log the selected users
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPlanFilter("");
    setDateFilter("");
    setIsFilterOpen(false);
  };

  const toggleFulfilled = async (userId: string, currentValue: boolean) => {
    try {
      // Update in Firestore
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        fulfilled: !currentValue,
      });

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, fulfilled: !currentValue } : user
        )
      );
    } catch (err) {
      console.error("Error updating fulfilled status:", err);
      setError("Failed to update client status");
    }
  };

  // Filter users based on the active tab and search/filter criteria
  const getFilteredUsers = () => {
    return users.filter((user) => {
      // Basic filters (search, status, plan, date)
      const fullName = `${user.firstName ?? ""} ${
        user.lastName ?? ""
      }`.toLowerCase();
      const email = (user.email ?? "").toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = fullName.includes(query) || email.includes(query);
      const matchesStatus = statusFilter
        ? user.subscriptionStatus === statusFilter
        : true;
      const matchesPlan = planFilter ? user.planType === planFilter : true;

      let matchesDate = true;
      if (dateFilter) {
        const today = new Date();
        const userDate = user.createdAt ? new Date(user.createdAt) : null;

        if (userDate) {
          if (dateFilter === "today") {
            matchesDate = userDate.toDateString() === today.toDateString();
          } else if (dateFilter === "week") {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            matchesDate = userDate >= weekAgo;
          } else if (dateFilter === "month") {
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            matchesDate = userDate >= monthAgo;
          }
        } else {
          matchesDate = false;
        }
      }

      const basicFilters =
        matchesSearch && matchesStatus && matchesPlan && matchesDate;

      // Tab-specific filters
      if (activeTab === "clients") {
        return basicFilters;
      } else if (activeTab === "fulfilment") {
        return basicFilters && user.questionnaireCompletedAt && !user.fulfilled;
      } else if (activeTab === "fulfilled") {
        return basicFilters && user.fulfilled === true;
      }

      return false;
    });
  };

  const filteredUsers = getFilteredUsers();

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === "name") {
      const nameA = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
      const nameB = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
      return sortDirection === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortField === "email") {
      const emailA = (a.email || "").toLowerCase();
      const emailB = (b.email || "").toLowerCase();
      return sortDirection === "asc"
        ? emailA.localeCompare(emailB)
        : emailB.localeCompare(emailA);
    } else if (sortField === "date") {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortField === "status") {
      const statusA = a.subscriptionStatus || "";
      const statusB = b.subscriptionStatus || "";
      return sortDirection === "asc"
        ? statusA.localeCompare(statusB)
        : statusB.localeCompare(statusA);
    } else if (sortField === "questionnaireDate") {
      const dateA = a.questionnaireCompletedAt
        ? new Date(a.questionnaireCompletedAt).getTime()
        : 0;
      const dateB = b.questionnaireCompletedAt
        ? new Date(b.questionnaireCompletedAt).getTime()
        : 0;
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "canceled":
        return "text-red-600";
      case "pending":
        return "text-amber-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "canceled":
        return "bg-red-100 text-red-800 border border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-sm">
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-6">
          <button
            onClick={() => {
              setActiveTab("clients");
              setSortField("date");
              setSortDirection("desc");
            }}
            className={`py-3 px-1 relative ${
              activeTab === "clients"
                ? "text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Clients
            {activeTab === "clients" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("fulfilment");
              setSortField("questionnaireDate");
              setSortDirection("asc");
            }}
            className={`py-3 px-1 relative ${
              activeTab === "fulfilment"
                ? "text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Fulfilment
            {activeTab === "fulfilment" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("fulfilled");
              setSortField("questionnaireDate");
              setSortDirection("asc");
            }}
            className={`py-3 px-1 relative ${
              activeTab === "fulfilled"
                ? "text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Fulfilled
            {activeTab === "fulfilled" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-800 mb-4 md:mb-0">
          {activeTab === "clients"
            ? "Clients"
            : activeTab === "fulfilment"
            ? "Clients Awaiting Fulfillment"
            : "Fulfilled Clients"}
        </h2>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "bg-white hover:bg-gray-100 text-gray-500"
            } transition-colors duration-200 cursor-pointer`}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "bg-white hover:bg-gray-100 text-gray-500"
            } transition-colors duration-200 cursor-pointer`}
            aria-label="List view"
          >
            <List size={18} />
          </button>
          {activeTab === "clients" && (
            <button
              onClick={() => setIsSelectMode(!isSelectMode)}
              className={`p-2 rounded-md ${
                isSelectMode
                  ? "bg-blue-100 text-blue-600"
                  : "bg-white hover:bg-gray-100 text-gray-500"
              } transition-colors duration-200 cursor-pointer ml-2`}
              aria-label="Select mode"
            >
              <CheckCircle size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer flex items-center justify-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </button>

        {activeTab === "clients" &&
          isSelectMode &&
          selectedUsers.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200 cursor-pointer flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedUsers.length})
              </button>
              <button
                onClick={handleExportSelected}
                className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-200 cursor-pointer flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export ({selectedUsers.length})
              </button>
            </div>
          )}
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Advanced Filters
            </h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Type
              </label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Created
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected count */}
      {activeTab === "clients" && isSelectMode && (
        <div className="bg-blue-50 p-3 rounded-lg mb-6 border border-blue-200 flex justify-between items-center">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-700">
              {selectedUsers.length} of {filteredUsers.length} clients selected
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={toggleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              {selectedUsers.length === filteredUsers.length
                ? "Deselect All"
                : "Select All"}
            </button>
            <button
              onClick={() => setIsSelectMode(false)}
              className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 relative"
            >
              {activeTab === "clients" && isSelectMode && (
                <div className="absolute top-3 left-3 z-10">
                  <div
                    onClick={() => toggleSelectUser(user.id || "")}
                    className={`w-5 h-5 rounded-full border ${
                      selectedUsers.includes(user.id || "")
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white border-gray-300"
                    } flex items-center justify-center cursor-pointer`}
                  >
                    {selectedUsers.includes(user.id || "") && (
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
                    )}
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">
                      {user.firstName || "N/A"} {user.lastName || ""}
                    </h3>
                    <p
                      className={`text-sm ${getStatusColor(
                        user.subscriptionStatus
                      )}`}
                    >
                      {user.subscriptionStatus === "active"
                        ? "Active"
                        : user.subscriptionStatus === "canceled"
                        ? "Canceled"
                        : user.subscriptionStatus === "pending"
                        ? "Pending"
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 text-sm">
                      {user.email || "No email"}
                    </span>
                  </div>

                  <div className="flex">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 text-sm">
                      {user.planType || "No plan"} ({user.billingCycle || "N/A"}
                      )
                    </span>
                  </div>

                  <div className="flex">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 text-sm">
                      Joined: {formatDate(user.createdAt)}
                    </span>
                  </div>

                  {(activeTab === "fulfilment" || activeTab === "fulfilled") &&
                    user.questionnaireCompletedAt && (
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-600 text-sm">
                          Questionnaire:{" "}
                          {formatDate(user.questionnaireCompletedAt, true)}
                        </span>
                        <Clock className="h-5 w-5 text-amber-500 mr-3" />
                        <span className="text-amber-600 text-sm font-medium">
                          {(() => {
                            const remaining = getTimeRemaining(
                              user.questionnaireCompletedAt
                            );
                            if (!remaining) return "Time's up!";
                            return `${remaining.days}d ${remaining.hours}h ${remaining.minutes}m remaining`;
                          })()}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => handleViewClientDetails(user.id || "")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
                {(activeTab === "fulfilment" || activeTab === "fulfilled") && (
                  <button
                    onClick={() =>
                      toggleFulfilled(user.id || "", !!user.fulfilled)
                    }
                    className={`flex items-center text-sm px-2 py-1 rounded cursor-pointer ${
                      user.fulfilled
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    {user.fulfilled ? "Mark Unfulfilled" : "Mark Fulfilled"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === "clients" && isSelectMode && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div
                      onClick={toggleSelectAll}
                      className={`w-5 h-5 rounded-full border ${
                        selectedUsers.length === filteredUsers.length
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      } flex items-center justify-center cursor-pointer`}
                    >
                      {selectedUsers.length === filteredUsers.length && (
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
                      )}
                    </div>
                  </th>
                )}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("name")}
                >
                  <div className="flex items-center">
                    Client
                    {sortField === "name" && (
                      <ArrowUpDown
                        className={`h-4 w-4 ml-1 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {sortField === "email" && (
                      <ArrowUpDown
                        className={`h-4 w-4 ml-1 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Plan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() =>
                    toggleSort(
                      activeTab === "clients" ? "date" : "questionnaireDate"
                    )
                  }
                >
                  <div className="flex items-center">
                    {activeTab === "clients" ? "Joined" : "Questionnaire Date"}
                    {(sortField === "date" ||
                      sortField === "questionnaireDate") && (
                      <ArrowUpDown
                        className={`h-4 w-4 ml-1 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === "status" && (
                      <ArrowUpDown
                        className={`h-4 w-4 ml-1 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                {(activeTab === "fulfilment" || activeTab === "fulfilled") && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fulfilled
                  </th>
                )}
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {activeTab === "clients" && isSelectMode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        onClick={() => toggleSelectUser(user.id || "")}
                        className={`w-5 h-5 rounded-full border ${
                          selectedUsers.includes(user.id || "")
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-300"
                        } flex items-center justify-center cursor-pointer`}
                      >
                        {selectedUsers.includes(user.id || "") && (
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
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName || "N/A"} {user.lastName || ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email || "No email"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.planType || "No plan"} ({user.billingCycle || "N/A"})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activeTab === "clients"
                      ? formatDate(user.createdAt)
                      : formatDate(user.questionnaireCompletedAt, true)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        user.subscriptionStatus
                      )}`}
                    >
                      {user.subscriptionStatus === "active"
                        ? "Active"
                        : user.subscriptionStatus === "canceled"
                        ? "Canceled"
                        : user.subscriptionStatus === "pending"
                        ? "Pending"
                        : "Unknown"}
                    </span>
                  </td>
                  {(activeTab === "fulfilment" ||
                    activeTab === "fulfilled") && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          toggleFulfilled(user.id || "", !!user.fulfilled)
                        }
                        className="flex items-center text-gray-700 hover:text-gray-900"
                      >
                        {user.fulfilled ? (
                          <CheckSquare className="h-5 w-5 text-green-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewClientDetails(user.id || "")}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="View details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      {activeTab === "clients" && (
                        <>
                          <button
                            onClick={() => {
                              // Edit user logic
                            }}
                            className="text-gray-600 hover:text-gray-900 cursor-pointer"
                            title="Edit client"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id || "")}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Delete client"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-lg p-8 text-center mt-10 border border-gray-200">
          {activeTab === "fulfilment" ? (
            <div>
              <p className="text-gray-500 mb-2">
                No clients are waiting for fulfillment.
              </p>
              <p className="text-gray-400 text-sm">
                Clients who complete the questionnaire will appear here.
              </p>
            </div>
          ) : activeTab === "fulfilled" ? (
            <div>
              <p className="text-gray-500 mb-2">
                No clients have been marked as fulfilled.
              </p>
              <p className="text-gray-400 text-sm">
                Clients you mark as fulfilled will appear here.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500">
                No clients match your search or filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add New Client Button - Only shown on Clients tab */}
      {activeTab === "clients" && (
        <div className="fixed bottom-6 right-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors duration-200 cursor-pointer"
            title="Add new client"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Delete Client
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this client? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteUser}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
