"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import type { UserData } from "@/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const handleViewClientDetails = (userId: string) => {
    router.push(`/dashboard/client/${userId}`);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName ?? ""} ${
      user.lastName ?? ""
    }`.toLowerCase();
    const email = (user.email ?? "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = fullName.includes(query) || email.includes(query);

    const matchesStatus = statusFilter
      ? user.subscriptionStatus === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/30 border border-red-900 p-4 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Clients</h2>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-gray-900 border-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="w-full md:w-1/4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-blue-400" />
                  <SelectValue placeholder="All Statuses" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-white">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="bg-gray-900 border-gray-800 overflow-hidden hover:border-blue-500 transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-white">
                      {user.firstName || "N/A"} {user.lastName || ""}
                    </h3>
                    <Badge
                      variant={
                        user.subscriptionStatus === "active"
                          ? "default"
                          : user.subscriptionStatus === "canceled"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        user.subscriptionStatus === "active"
                          ? "bg-blue-900 text-blue-200 hover:bg-blue-900"
                          : user.subscriptionStatus === "canceled"
                          ? "bg-red-900 text-red-200 hover:bg-red-900"
                          : "bg-yellow-900 text-yellow-200 hover:bg-yellow-900"
                      }
                    >
                      {user.subscriptionStatus === "active"
                        ? "Active"
                        : user.subscriptionStatus === "canceled"
                        ? "Canceled"
                        : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex">
                    <Mail className="h-5 w-5 text-blue-400 mr-3" />
                    <span className="text-gray-300">
                      {user.email || "No email"}
                    </span>
                  </div>

                  <div className="flex">
                    <Calendar className="h-5 w-5 text-blue-400 mr-3" />
                    <span className="text-gray-300">
                      {user.planType || "No plan"} ({user.billingCycle || "N/A"}
                      )
                    </span>
                  </div>

                  <div className="flex">
                    <Clock className="h-5 w-5 text-blue-400 mr-3" />
                    <span className="text-gray-300">
                      Joined: {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gray-800/50 px-6 py-3">
                <button
                  onClick={() => handleViewClientDetails(user.id || "")}
                  className="flex items-center justify-between w-full text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  <span>View and Manage Client</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <div className="bg-gray-900 rounded-lg p-8 text-center mt-10 border border-gray-800">
            <p className="text-gray-400">
              No clients match your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
