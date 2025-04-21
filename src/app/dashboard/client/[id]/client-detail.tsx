// src/app/dashboard/client/[id]/client-detail.tsx
/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  UserData,
  ProjectPhase,
  FileUpload,
  WebsiteEntry,
  DomainInfo,
} from "@/types";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Circle,
  Loader2,
  Plus,
  Trash2,
  Globe,
  Home,
  Palette,
  Rocket,
  Layers,
  MessageSquare,
  Lock,
  Users,
  Settings,
  Code,
  FileText,
  Activity,
  AlertTriangle,
  Info,
  Link,
  ExternalLink,
  Database,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { DownloadButton } from "@/components/DownloadButton";

// Default project phases for new clients
const DEFAULT_PROJECT_PHASES: ProjectPhase[] = [
  {
    name: "Planning",
    status: "active",
    tasks: [
      { name: "Complete our questionnaire", completed: true },
      { name: "Reviewing your answers", completed: false },
    ],
  },
  {
    name: "Design",
    status: "pending",
    tasks: [
      { name: "Designing your website", completed: false },
      { name: "Finalising your website", completed: false },
    ],
  },
  {
    name: "Revisions",
    status: "pending",
    tasks: [
      { name: "Add your edits/revisions", completed: false },
      { name: "Completing your revisions", completed: false },
    ],
  },
  {
    name: "Launch",
    status: "pending",
    tasks: [
      { name: "Adding your domain", completed: false },
      { name: "Publishing your website", completed: false },
    ],
  },
];

// Helper function to safely render questionnaire fields
const renderQuestionnaireField = (
  field:
    | string
    | string[]
    | WebsiteEntry[]
    | FileUpload
    | FileUpload[]
    | null
    | undefined,
  defaultValue: string = "Not provided"
): React.ReactNode => {
  if (field === null || field === undefined) {
    return defaultValue;
  }

  // Handle string values
  if (typeof field === "string") {
    return field;
  }

  // Handle string arrays
  if (Array.isArray(field) && field.length > 0) {
    if (typeof field[0] === "string") {
      return field.join(", ");
    }
    // For arrays of complex objects, we'll handle them specially in the UI
    return defaultValue;
  }

  // For FileUpload or complex objects, return the default
  return defaultValue;
};

// Parse domain value from questionnaire
const parseDomainValue = (
  value: string | undefined
): { name: string; isCustom: boolean } => {
  if (!value) return { name: "", isCustom: false };

  if (value.startsWith("customDomain:")) {
    return {
      name: value.replace("customDomain:", ""),
      isCustom: true,
    };
  }

  return {
    name: value,
    isCustom: false,
  };
};

export default function ClientDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "domain" | "website" | "questionnaire" | "phases" | "feedback"
  >("overview");
  const [activeSubTab, setActiveSubTab] = useState<
    "preview" | "liveUrl" | "editor" | "revisions"
  >("preview");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const feedbackMessagesRef = useRef<HTMLDivElement>(null);

  // Fetch client data
  useEffect(() => {
    async function fetchClientData() {
      try {
        setLoading(true);
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as UserData;
          setUserData(data);

          // Initialize project phases from user data or with defaults
          if (data.projectPhases && data.projectPhases.length > 0) {
            setProjectPhases(data.projectPhases);
          } else {
            setProjectPhases(DEFAULT_PROJECT_PHASES);
          }
        } else {
          setError("Client not found");
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError("Failed to load client data");
      } finally {
        setLoading(false);
      }
    }

    fetchClientData();
  }, [id, router]);

  // Add this effect to scroll to the bottom of messages when they change
  useEffect(() => {
    if (feedbackMessagesRef.current && userData?.feedbackMessages?.length) {
      feedbackMessagesRef.current.scrollTop =
        feedbackMessagesRef.current.scrollHeight;
    }
  }, [userData?.feedbackMessages]);

  // Update a phase status
  const updatePhaseStatus = (
    index: number,
    status: "completed" | "active" | "pending"
  ) => {
    const updatedPhases = [...projectPhases];
    updatedPhases[index].status = status;

    // If phase is marked completed, mark all tasks as completed
    if (status === "completed") {
      updatedPhases[index].tasks.forEach((task) => {
        task.completed = true;
      });
    }

    // If phase is marked active, ensure at least the previous phase is completed
    if (status === "active" && index > 0) {
      updatedPhases[index - 1].status = "completed";
      updatedPhases[index - 1].tasks.forEach((task) => {
        task.completed = true;
      });
    }

    setProjectPhases(updatedPhases);
  };

  // Toggle task completion
  const toggleTaskCompletion = (phaseIndex: number, taskIndex: number) => {
    const updatedPhases = [...projectPhases];
    updatedPhases[phaseIndex].tasks[taskIndex].completed =
      !updatedPhases[phaseIndex].tasks[taskIndex].completed;

    // Check if all tasks are completed, update phase status accordingly
    const allCompleted = updatedPhases[phaseIndex].tasks.every(
      (task) => task.completed
    );
    if (allCompleted) {
      updatedPhases[phaseIndex].status = "completed";
    } else if (updatedPhases[phaseIndex].status === "completed") {
      updatedPhases[phaseIndex].status = "active";
    }

    setProjectPhases(updatedPhases);
  };

  // Add new task to a phase
  const addTask = (phaseIndex: number, taskName: string) => {
    if (!taskName.trim()) return;

    const updatedPhases = [...projectPhases];
    updatedPhases[phaseIndex].tasks.push({
      name: taskName,
      completed: false,
    });

    setProjectPhases(updatedPhases);
  };

  // Remove a task
  const removeTask = (phaseIndex: number, taskIndex: number) => {
    const updatedPhases = [...projectPhases];
    updatedPhases[phaseIndex].tasks.splice(taskIndex, 1);
    setProjectPhases(updatedPhases);
  };

  // Save changes to Firebase
  const saveChanges = async () => {
    if (!userData) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        projectPhases: projectPhases,
        updatedAt: new Date().toISOString(),
      });

      setSuccess("Client project phases updated successfully");

      // Set success message timeout
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error saving client data:", err);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Handle sending reply to feedback
  const handleSendReply = async () => {
    if (!replyMessage.trim() || !userData) return;

    try {
      setIsSendingReply(true);

      // Prepare the new reply message
      const newReply = {
        text: replyMessage.trim(),
        timestamp: new Date().toISOString(),
        isFromClient: false,
        isRead: false,
        userId: id, // Client's ID
        adminName: "Support Team", // You could customize this
      };

      // Get a reference to the user's document
      const userDocRef = doc(db, "users", id);

      // Use arrayUnion to add the new message to the feedbackMessages array
      await updateDoc(userDocRef, {
        feedbackMessages: arrayUnion(newReply),
        updatedAt: new Date().toISOString(),
      });

      // Update local state (append new message to the existing messages)
      setUserData({
        ...userData,
        feedbackMessages: [...(userData.feedbackMessages || []), newReply],
      });

      // Clear input
      setReplyMessage("");

      // Scroll to bottom of messages after a short delay (to allow rerender)
      setTimeout(() => {
        if (feedbackMessagesRef.current) {
          feedbackMessagesRef.current.scrollTop =
            feedbackMessagesRef.current.scrollHeight;
        }
      }, 100);

      setSuccess("Reply sent successfully");
    } catch (error) {
      console.error("Error sending reply:", error);
      setError("Failed to send reply");
    } finally {
      setIsSendingReply(false);
    }
  };

  // Mark all feedback messages as read
  const markAllMessagesAsRead = async () => {
    if (!userData || !userData.feedbackMessages) return;

    try {
      // Check if there are any unread client messages
      if (
        userData.feedbackMessages.some((msg) => msg.isFromClient && !msg.isRead)
      ) {
        const updatedMessages = userData.feedbackMessages.map((msg) =>
          msg.isFromClient && !msg.isRead ? { ...msg, isRead: true } : msg
        );

        const userDocRef = doc(db, "users", id);
        await updateDoc(userDocRef, {
          feedbackMessages: updatedMessages,
        });

        setUserData({
          ...userData,
          feedbackMessages: updatedMessages,
        });

        setSuccess("All messages marked as read");

        // Clear success message after a delay
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
      setError("Failed to mark messages as read");
    }
  };

  // Get appropriate icon for a phase based on its name
  const getPhaseIcon = (phaseName: string) => {
    switch (phaseName.toLowerCase()) {
      case "planning":
        return <Home className="h-5 w-5" />;
      case "design":
        return <Palette className="h-5 w-5" />;
      case "design finalisation":
        return <Palette className="h-5 w-5" />;
      case "revisions":
        return <Layers className="h-5 w-5" />;
      case "launch":
        return <Rocket className="h-5 w-5" />;
      default:
        return <Layers className="h-5 w-5" />;
    }
  };

  // Generic function to update a user field
  const updateUserField = async (
    fieldName: string,
    value: any,
    successMessage: string
  ) => {
    if (!userData) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        [fieldName]: value,
        updatedAt: new Date().toISOString(),
      });

      // Update local state to reflect changes immediately
      setUserData({
        ...userData,
        [fieldName]: value,
      });

      setSuccess(successMessage);

      // Set success message timeout
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(`Error updating ${fieldName}:`, err);
      setError(`Failed to update ${fieldName}`);
    } finally {
      setSaving(false);
    }
  };

  // Update domain info in questionnaire answers
  const updateDomainInfo = async (
    domainName: string,
    isCustom: boolean,
    provider?: string
  ) => {
    if (!userData || !userData.questionnaireAnswers) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formattedDomainValue = isCustom
        ? `customDomain:${domainName}`
        : domainName;

      const updatedAnswers = {
        ...userData.questionnaireAnswers,
        customDomainName: formattedDomainValue,
        domainProvider:
          provider || userData.questionnaireAnswers.domainProvider,
      };

      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        questionnaireAnswers: updatedAnswers,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setUserData({
        ...userData,
        questionnaireAnswers: updatedAnswers,
      });

      setSuccess("Domain information updated successfully");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error updating domain information:", err);
      setError("Failed to update domain information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg">
        <p className="text-red-400">Client not found</p>
      </div>
    );
  }

  // Count unread client messages
  const unreadCount =
    userData.feedbackMessages?.filter((msg) => msg.isFromClient && !msg.isRead)
      .length || 0;

  // Parse domain information
  const domainValue =
    userData.questionnaireAnswers?.customDomainName ||
    userData.questionnaireAnswers?.domainName;
  const domainInfo = parseDomainValue(domainValue as string);

  return (
    <div className="space-y-6">
      {/* Header with back button and client name */}
      <div className="flex justify-between items-center bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-300 hover:text-white mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="hidden md:inline">Back</span>
          </button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {userData.firstName} {userData.lastName}
            </h1>
            <div className="flex items-center text-sm text-gray-400">
              <span className="mr-2">{userData.email}</span>
              <span className="mx-2">•</span>
              <span
                className={`${
                  userData.subscriptionStatus === "active"
                    ? "text-green-400"
                    : userData.subscriptionStatus === "canceled"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {userData.planType || "Standard"} (
                {userData.billingCycle || "Monthly"})
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={saveChanges}
          disabled={saving}
          className="flex items-center bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success and error messages */}
      {success && (
        <div className="bg-green-900/30 border border-green-800 p-4 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
          <p className="text-green-400">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Main Navigation */}
      <div className="bg-gray-800 rounded-xl overflow-x-auto border border-gray-700">
        <div className="min-w-max p-2 flex">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg mr-2 flex items-center ${
              activeTab === "overview"
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("domain")}
            className={`px-4 py-2 rounded-lg mr-2 flex items-center ${
              activeTab === "domain"
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Globe className="h-4 w-4 mr-2" />
            Domain
          </button>
          <button
            onClick={() => setActiveTab("website")}
            className={`px-4 py-2 rounded-lg mr-2 flex items-center ${
              activeTab === "website"
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Code className="h-4 w-4 mr-2" />
            Website
          </button>
          <button
            onClick={() => setActiveTab("questionnaire")}
            className={`px-4 py-2 rounded-lg mr-2 flex items-center ${
              activeTab === "questionnaire"
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Questionnaire
          </button>
          <button
            onClick={() => setActiveTab("phases")}
            className={`px-4 py-2 rounded-lg mr-2 flex items-center ${
              activeTab === "phases"
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Layers className="h-4 w-4 mr-2" />
            Project Phases
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === "feedback"
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Website Tab - Sub Navigation */}
      {activeTab === "website" && (
        <div className="bg-gray-800 border-b border-gray-700 rounded-t-xl overflow-x-auto">
          <div className="flex p-2 border-t border-l border-r border-gray-700 rounded-t-xl">
            <button
              onClick={() => setActiveSubTab("preview")}
              className={`px-4 py-2 rounded-lg mr-2 ${
                activeSubTab === "preview"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Preview Image
            </button>
            <button
              onClick={() => setActiveSubTab("liveUrl")}
              className={`px-4 py-2 rounded-lg mr-2 ${
                activeSubTab === "liveUrl"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Live URL
            </button>
            <button
              onClick={() => setActiveSubTab("editor")}
              className={`px-4 py-2 rounded-lg mr-2 ${
                activeSubTab === "editor"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Editor URL
            </button>
            <button
              onClick={() => setActiveSubTab("revisions")}
              className={`px-4 py-2 rounded-lg ${
                activeSubTab === "revisions"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Revisions URL
            </button>
          </div>
        </div>
      )}

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Client Overview Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-orange-500" />
              Client Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-gray-700/30 p-4 rounded-lg space-y-4">
                <h3 className="text-md font-medium text-white border-b border-gray-600 pb-2">
                  Basic Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-medium">
                      {userData.firstName} {userData.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{userData.email}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">
                      {userData.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              <div className="bg-gray-700/30 p-4 rounded-lg space-y-4">
                <h3 className="text-md font-medium text-white border-b border-gray-600 pb-2">
                  Subscription Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Plan Type</p>
                    <p className="text-white font-medium">
                      {userData.planType || "Standard"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Billing Cycle</p>
                    <p className="text-white">
                      {userData.billingCycle || "Monthly"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Subscription Status</p>
                    <p
                      className={`font-medium ${
                        userData.subscriptionStatus === "active"
                          ? "text-green-400"
                          : userData.subscriptionStatus === "canceled"
                          ? "text-red-400"
                          : "text-yellow-400"
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

              {/* Website Details Summary */}
              <div className="bg-gray-700/30 p-4 rounded-lg space-y-4">
                <h3 className="text-md font-medium text-white border-b border-gray-600 pb-2">
                  Website Status
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Domain Name</p>
                    <div className="flex items-center">
                      {domainInfo.name ? (
                        <>
                          <Globe className="h-4 w-4 text-orange-500 mr-2" />
                          <p className="text-white">{domainInfo.name}</p>
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              domainInfo.isCustom
                                ? "bg-blue-900/30 text-blue-400 border border-blue-800"
                                : "bg-green-900/30 text-green-400 border border-green-800"
                            }`}
                          >
                            {domainInfo.isCustom
                              ? "Custom Domain"
                              : "Provided Domain"}
                          </span>
                        </>
                      ) : (
                        <p className="text-gray-400">No domain selected</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Live Website</p>
                    {userData.websiteUrl ? (
                      <a
                        href={
                          userData.websiteUrl.startsWith("http")
                            ? userData.websiteUrl
                            : `https://${userData.websiteUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {userData.websiteUrl}
                      </a>
                    ) : (
                      <p className="text-gray-400">Not published yet</p>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Completion Status</p>
                    {projectPhases.length > 0 ? (
                      <div className="flex items-center">
                        <div className="w-full bg-gray-600 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-orange-500 h-2.5 rounded-full"
                            style={{
                              width: `${
                                (projectPhases.filter(
                                  (phase) => phase.status === "completed"
                                ).length /
                                  projectPhases.length) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">
                          {Math.round(
                            (projectPhases.filter(
                              (phase) => phase.status === "completed"
                            ).length /
                              projectPhases.length) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-400">No project phases defined</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-700/30 p-4 rounded-lg space-y-4">
                <h3 className="text-md font-medium text-white border-b border-gray-600 pb-2">
                  Recent Activity
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-gray-600 rounded-full p-1.5 mr-3 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Account Created</p>
                      <p className="text-gray-400 text-xs">
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
                    <div className="bg-gray-600 rounded-full p-1.5 mr-3 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Last Updated</p>
                      <p className="text-gray-400 text-xs">
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

                  {userData.feedbackMessages &&
                    userData.feedbackMessages.length > 0 && (
                      <div className="flex items-start">
                        <div className="bg-gray-600 rounded-full p-1.5 mr-3 mt-0.5">
                          <MessageSquare className="h-3.5 w-3.5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-white text-sm">Latest Feedback</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(
                              userData.feedbackMessages[
                                userData.feedbackMessages.length - 1
                              ].timestamp
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("phases")}
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center"
              >
                <Layers className="h-5 w-5 mr-2 text-orange-500" />
                Manage Project Phases
              </button>

              <button
                onClick={() => setActiveTab("domain")}
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center"
              >
                <Globe className="h-5 w-5 mr-2 text-orange-500" />
                Manage Domain
              </button>

              <button
                onClick={() => setActiveTab("website")}
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center"
              >
                <Code className="h-5 w-5 mr-2 text-orange-500" />
                Manage Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domain Tab Content */}
      {activeTab === "domain" && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-orange-500" />
            Domain Management
          </h2>

          {/* Current Domain Information */}
          <div className="bg-gray-700/30 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Current Domain
            </h3>

            {domainInfo.name ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <Globe className="h-6 w-6 text-orange-500 mr-3" />
                    <div>
                      <p className="text-lg font-medium text-white">
                        {domainInfo.name}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            domainInfo.isCustom
                              ? "bg-blue-900/30 text-blue-400 border border-blue-800"
                              : "bg-green-900/30 text-green-400 border border-green-800"
                          }`}
                        >
                          {domainInfo.isCustom
                            ? "Clients Own Domain"
                            : "Free Domain (Included)"}
                        </span>

                        {userData.questionnaireAnswers?.domainProvider && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                            Provider:{" "}
                            {userData.questionnaireAnswers.domainProvider}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const confirm = window.confirm(
                        "Are you sure you want to remove this domain?"
                      );
                      if (confirm) {
                        updateDomainInfo("", false);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* Domain provider info */}
                {domainInfo.isCustom && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-md font-medium text-white mb-3">
                      Domain Provider
                    </h4>

                    <div className="flex">
                      <input
                        type="text"
                        id="domain-provider"
                        placeholder="Enter domain provider (e.g., GoDaddy, Namecheap)"
                        defaultValue={
                          (userData.questionnaireAnswers
                            ?.domainProvider as string) || ""
                        }
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-3 py-2 text-white"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(
                            "domain-provider"
                          ) as HTMLInputElement;
                          const provider = input.value.trim();
                          updateDomainInfo(
                            domainInfo.name,
                            domainInfo.isCustom,
                            provider
                          );
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-r-lg"
                      >
                        Update Provider
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      Enter the company where the client's domain is registered.
                      This helps with DNS configuration later.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                <Globe className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <h4 className="text-md font-medium text-white mb-1">
                  No Domain Set
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                  This client does not have a domain set up yet.
                </p>
              </div>
            )}
          </div>

          {/* Add/Update Domain */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">
              {domainInfo.name ? "Update Domain" : "Add Domain"}
            </h3>

            <div className="space-y-6">
              {/* Domain Tabs */}
              <div className="flex">
                <button
                  id="free-domain-tab"
                  className={`px-4 py-2 rounded-t-lg border-t border-l border-r ${
                    !domainInfo.isCustom
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-800 text-gray-400 border-gray-700"
                  }`}
                  onClick={() => {
                    document
                      .getElementById("free-domain-content")
                      ?.classList.remove("hidden");
                    document
                      .getElementById("custom-domain-content")
                      ?.classList.add("hidden");
                    document
                      .getElementById("free-domain-tab")
                      ?.classList.add(
                        "bg-gray-700",
                        "text-white",
                        "border-gray-600"
                      );
                    document
                      .getElementById("free-domain-tab")
                      ?.classList.remove(
                        "bg-gray-800",
                        "text-gray-400",
                        "border-gray-700"
                      );
                    document
                      .getElementById("custom-domain-tab")
                      ?.classList.add(
                        "bg-gray-800",
                        "text-gray-400",
                        "border-gray-700"
                      );
                    document
                      .getElementById("custom-domain-tab")
                      ?.classList.remove(
                        "bg-gray-700",
                        "text-white",
                        "border-gray-600"
                      );
                  }}
                >
                  Included Free Domain
                </button>
                <button
                  id="custom-domain-tab"
                  className={`px-4 py-2 rounded-t-lg border-t border-l border-r ${
                    domainInfo.isCustom
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-800 text-gray-400 border-gray-700"
                  }`}
                  onClick={() => {
                    document
                      .getElementById("custom-domain-content")
                      ?.classList.remove("hidden");
                    document
                      .getElementById("free-domain-content")
                      ?.classList.add("hidden");
                    document
                      .getElementById("custom-domain-tab")
                      ?.classList.add(
                        "bg-gray-700",
                        "text-white",
                        "border-gray-600"
                      );
                    document
                      .getElementById("custom-domain-tab")
                      ?.classList.remove(
                        "bg-gray-800",
                        "text-gray-400",
                        "border-gray-700"
                      );
                    document
                      .getElementById("free-domain-tab")
                      ?.classList.add(
                        "bg-gray-800",
                        "text-gray-400",
                        "border-gray-700"
                      );
                    document
                      .getElementById("free-domain-tab")
                      ?.classList.remove(
                        "bg-gray-700",
                        "text-white",
                        "border-gray-600"
                      );
                  }}
                >
                  Client's Own Domain
                </button>
              </div>

              {/* Free Domain Content */}
              <div
                id="free-domain-content"
                className={`border border-gray-600 bg-gray-700 rounded-b-lg rounded-tr-lg p-4 ${
                  domainInfo.isCustom ? "hidden" : ""
                }`}
              >
                <div className="mb-4">
                  <label
                    htmlFor="free-domain"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Domain Name
                  </label>
                  <input
                    type="text"
                    id="free-domain"
                    placeholder="Enter domain name (e.g., example.com)"
                    defaultValue={!domainInfo.isCustom ? domainInfo.name : ""}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the domain name that was selected from our domain
                    registration tool.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const input = document.getElementById(
                      "free-domain"
                    ) as HTMLInputElement;
                    const domain = input.value.trim();
                    if (domain) {
                      updateDomainInfo(domain, false);
                    } else {
                      setError("Please enter a valid domain name");
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg w-full"
                >
                  {domainInfo.name && !domainInfo.isCustom
                    ? "Update Domain"
                    : "Add Domain"}
                </button>
              </div>

              {/* Custom Domain Content */}
              <div
                id="custom-domain-content"
                className={`border border-gray-600 bg-gray-700 rounded-b-lg rounded-tr-lg p-4 ${
                  !domainInfo.isCustom ? "hidden" : ""
                }`}
              >
                <div className="mb-4">
                  <label
                    htmlFor="custom-domain"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Client's Domain Name
                  </label>
                  <input
                    type="text"
                    id="custom-domain"
                    placeholder="Enter client's domain (e.g., example.com)"
                    defaultValue={domainInfo.isCustom ? domainInfo.name : ""}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the domain name that the client already owns.
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="domain-provider-input"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Domain Provider
                  </label>
                  <input
                    type="text"
                    id="domain-provider-input"
                    placeholder="Enter domain provider (e.g., GoDaddy, Namecheap)"
                    defaultValue={
                      (userData.questionnaireAnswers
                        ?.domainProvider as string) || ""
                    }
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the company where the client's domain is registered.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const domainInput = document.getElementById(
                      "custom-domain"
                    ) as HTMLInputElement;
                    const providerInput = document.getElementById(
                      "domain-provider-input"
                    ) as HTMLInputElement;
                    const domain = domainInput.value.trim();
                    const provider = providerInput.value.trim();

                    if (domain) {
                      updateDomainInfo(domain, true, provider);
                    } else {
                      setError("Please enter a valid domain name");
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg w-full"
                >
                  {domainInfo.name && domainInfo.isCustom
                    ? "Update Domain"
                    : "Add Domain"}
                </button>
              </div>
            </div>
          </div>

          {/* Domain Management Tips */}
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-400 font-medium mb-1">
                  Domain Management Tips
                </h4>
                <ul className="text-sm text-blue-300 space-y-1 list-disc pl-5">
                  <li>
                    For client-owned domains, you'll need to update the DNS
                    settings at their domain provider.
                  </li>
                  <li>
                    Free domains included with plans will be automatically
                    configured.
                  </li>
                  <li>
                    Allow 24-48 hours for DNS changes to fully propagate after
                    setup.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Website Tab Content */}
      {activeTab === "website" && (
        <>
          {/* Website Preview Management */}
          {activeSubTab === "preview" && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-orange-500" />
                Website Preview Image
              </h2>

              <div className="space-y-6">
                {/* Current preview */}
                {userData.websitePreviewUrl ? (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-3 font-medium">
                      Current Website Preview
                    </p>
                    <div
                      className="relative rounded-lg overflow-hidden"
                      style={{ maxHeight: "400px" }}
                    >
                      <img
                        src={userData.websitePreviewUrl}
                        alt="Website Preview"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/30 p-6 rounded-lg flex items-center justify-center">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-400 mb-2">
                        No website preview image set
                      </p>
                      <p className="text-xs text-gray-500 max-w-md">
                        Add a preview image to show the client what their
                        website will look like before it's published.
                      </p>
                    </div>
                  </div>
                )}

                {/* Update preview URL */}
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 mb-3 font-medium">
                    Update Website Preview URL
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      defaultValue={userData.websitePreviewUrl || ""}
                      className="flex-1 bg-gray-600 border border-gray-500 rounded-l-lg px-3 py-2 text-white"
                      id="website-preview-url"
                    />
                    <button
                      onClick={async () => {
                        const input = document.getElementById(
                          "website-preview-url"
                        ) as HTMLInputElement;
                        const url = input.value.trim();

                        if (url) {
                          updateUserField(
                            "websitePreviewUrl",
                            url,
                            "Website preview image updated successfully"
                          );
                        } else {
                          setError("Please enter a valid URL");
                        }
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-r-lg"
                    >
                      Update
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Paste a direct link to an image file (JPG, PNG, WEBP). The
                    image should be at least 1200x800 pixels.
                  </p>
                </div>

                {/* Remove preview */}
                {userData.websitePreviewUrl && (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-3 font-medium">
                      Remove Preview Image
                    </p>
                    <button
                      onClick={() =>
                        updateUserField(
                          "websitePreviewUrl",
                          null,
                          "Website preview image removed"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Remove Preview Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Website URL Management */}
          {activeSubTab === "liveUrl" && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-orange-500" />
                Live Website URL
              </h2>

              <div className="space-y-6">
                {/* Current website URL */}
                {userData.websiteUrl ? (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-3 font-medium">
                      Current Live Website URL
                    </p>
                    <div className="flex items-center bg-gray-800/50 p-3 rounded-lg">
                      <Globe className="h-5 w-5 text-orange-500 mr-3" />
                      <a
                        href={
                          userData.websiteUrl.startsWith("http")
                            ? userData.websiteUrl
                            : `https://${userData.websiteUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {userData.websiteUrl}
                      </a>
                      <span className="ml-auto">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/30 p-6 rounded-lg flex items-center justify-center">
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-7 w-7 text-gray-400" />
                      </div>
                      <p className="text-gray-400 mb-2">
                        No website URL has been set
                      </p>
                      <p className="text-xs text-gray-500 max-w-md">
                        Add the live website URL when the client's website is
                        published and ready to be viewed.
                      </p>
                    </div>
                  </div>
                )}

                {/* Update website URL */}
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 mb-3 font-medium">
                    Update Live Website URL
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter website URL (e.g., example.com)"
                      defaultValue={userData.websiteUrl || ""}
                      className="flex-1 bg-gray-600 border border-gray-500 rounded-l-lg px-3 py-2 text-white"
                      id="website-url"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(
                          "website-url"
                        ) as HTMLInputElement;
                        const url = input.value.trim();

                        updateUserField(
                          "websiteUrl",
                          url,
                          "Website URL updated successfully"
                        );
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-r-lg"
                    >
                      Update
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the full URL of the customer's live website. It will
                    be displayed in their dashboard.
                  </p>
                </div>

                {/* Remove website URL */}
                {userData.websiteUrl && (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-3 font-medium">
                      Remove Website URL
                    </p>
                    <button
                      onClick={() =>
                        updateUserField(
                          "websiteUrl",
                          null,
                          "Website URL removed"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Remove Website URL
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Editor URL Management */}
          {activeSubTab === "editor" && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-orange-500" />
                Content Editor URL
              </h2>

              <div className="space-y-6">
                {/* Current editor URL */}
                {userData.editorUrl ? (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-3 font-medium">
                      Current Content Editor URL
                    </p>
                    <div className="flex items-center bg-gray-800/50 p-3 rounded-lg">
                      <Code className="h-5 w-5 text-orange-500 mr-3" />
                      <a
                        href={
                          userData.editorUrl.startsWith("http")
                            ? userData.editorUrl
                            : `https://${userData.editorUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {userData.editorUrl}
                      </a>
                      <span className="ml-auto">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/30 p-6 rounded-lg flex items-center justify-center">
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Code className="h-7 w-7 text-gray-400" />
                      </div>
                      <p className="text-gray-400 mb-2">
                        No editor URL has been set
                      </p>
                      <p className="text-xs text-gray-500 max-w-md">
                        Add the editor URL to allow the client to make changes
                        to their website content.
                      </p>
                    </div>
                  </div>
                )}

                {/* Update editor URL */}
                <div className="bg-gray-700/30 p-4 rounded-lg mt-6">
                  <p className="text-sm text-gray-300 mb-3 font-medium">
                    Update Editor URL
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter editor URL (e.g., editor.example.com)"
                      defaultValue={userData.editorUrl || ""}
                      className="flex-1 bg-gray-600 border border-gray-500 rounded-l-lg px-3 py-2 text-white"
                      id="editor-url"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(
                          "editor-url"
                        ) as HTMLInputElement;
                        const url = input.value.trim();

                        updateUserField(
                          "editorUrl",
                          url,
                          "Editor URL updated successfully"
                        );
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-r-lg"
                    >
                      Update
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the URL where the client can access their content
                    management system.
                  </p>
                </div>

                {/* Remove editor URL */}
                {userData.editorUrl && (
                  <div className="bg-gray-700/30 p-4 rounded-lg mt-6">
                    <p className="text-sm text-gray-300 mb-3 font-medium">
                      Remove Editor URL
                    </p>
                    <button
                      onClick={() =>
                        updateUserField("editorUrl", null, "Editor URL removed")
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Remove Editor URL
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Revisions URL Management */}
          {activeSubTab === "revisions" && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-orange-500" />
                Revisions Editor URL
              </h2>

              <div className="space-y-6">
                {/* Current revisions URL */}
                {userData.revisionsUrl ? (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-3 font-medium">
                      Current Revisions URL
                    </p>
                    <div className="flex items-center bg-gray-800/50 p-3 rounded-lg">
                      <Layers className="h-5 w-5 text-orange-500 mr-3" />
                      <a
                        href={
                          userData.revisionsUrl.startsWith("http")
                            ? userData.revisionsUrl
                            : `https://${userData.revisionsUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {userData.revisionsUrl}
                      </a>
                      <span className="ml-auto">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/30 p-6 rounded-lg flex items-center justify-center">
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Layers className="h-7 w-7 text-gray-400" />
                      </div>
                      <p className="text-gray-400 mb-2">
                        No revisions URL has been set
                      </p>
                      <p className="text-xs text-gray-500 max-w-md">
                        Add the revisions URL to allow the client to request
                        changes to their website.
                      </p>
                    </div>
                  </div>
                )}

                {/* Update revisions URL */}
                <div className="bg-gray-700/30 p-4 rounded-lg mt-6">
                  <p className="text-sm text-gray-300 mb-3 font-medium">
                    Update Revisions URL
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter revisions URL (e.g., revisions.example.com)"
                      defaultValue={userData.revisionsUrl || ""}
                      className="flex-1 bg-gray-600 border border-gray-500 rounded-l-lg px-3 py-2 text-white"
                      id="revisions-url"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(
                          "revisions-url"
                        ) as HTMLInputElement;
                        const url = input.value.trim();

                        updateUserField(
                          "revisionsUrl",
                          url,
                          "Revisions URL updated successfully"
                        );
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-r-lg"
                    >
                      Update
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the URL where the client can request and track
                    revisions.
                  </p>
                </div>

                {/* Remove revisions URL */}
                {userData.revisionsUrl && (
                  <div className="bg-gray-700/30 p-4 rounded-lg mt-6">
                    <p className="text-sm text-gray-300 mb-3 font-medium">
                      Remove Revisions URL
                    </p>
                    <button
                      onClick={() =>
                        updateUserField(
                          "revisionsUrl",
                          null,
                          "Revisions URL removed"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Remove Revisions URL
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Questionnaire Tab Content */}
      {activeTab === "questionnaire" && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-500" />
            Questionnaire Answers
          </h2>

          {userData?.questionnaireAnswers ? (
            <div className="space-y-8">
              {/* Business Information */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-md font-medium text-white mb-4 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-orange-500" />
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">Business Name</p>
                    <p className="text-sm text-gray-200">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.businessName
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">
                      Business Tagline
                    </p>
                    <p className="text-sm text-gray-200">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.businessTagline
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">
                      Business Description
                    </p>
                    <p className="text-sm text-gray-200">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.businessDescription
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">
                      Services & Products
                    </p>
                    <p className="text-sm text-gray-200">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.servicesProducts
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">
                      Target Audience
                    </p>
                    <p className="text-sm text-gray-200">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.targetAudience
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">
                      Business Unique Selling Points
                    </p>
                    <p className="text-sm text-gray-200">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.businessUnique
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Competitors */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-md font-medium text-white mb-4 flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-orange-500" />
                  Competitors
                </h3>
                {userData.questionnaireAnswers.competitors &&
                Array.isArray(userData.questionnaireAnswers.competitors) &&
                userData.questionnaireAnswers.competitors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.questionnaireAnswers.competitors.map(
                      (competitor, index) => (
                        <div
                          key={index}
                          className="bg-gray-700/30 p-4 rounded-md flex items-center"
                        >
                          <div className="mr-3 flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <Globe className="h-4 w-4 text-orange-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white font-medium">
                              {competitor.name}
                            </p>
                            {competitor.url && (
                              <a
                                href={
                                  competitor.url.startsWith("http")
                                    ? competitor.url
                                    : `https://${competitor.url}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:underline flex items-center"
                              >
                                {competitor.url}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-sm text-gray-400">
                      No competitors listed
                    </p>
                  </div>
                )}
              </div>

              {/* Design Information */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-md font-medium text-white mb-4 flex items-center">
                  <Palette className="h-4 w-4 mr-2 text-orange-500" />
                  Design & Style Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">Website Style</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userData.questionnaireAnswers.websiteStyle &&
                      Array.isArray(
                        userData.questionnaireAnswers.websiteStyle
                      ) ? (
                        userData.questionnaireAnswers.websiteStyle.map(
                          (style, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-600 text-xs text-white rounded-full"
                            >
                              {style}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not specified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">
                      Color Preferences
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userData.questionnaireAnswers.colorPreferences &&
                      Array.isArray(
                        userData.questionnaireAnswers.colorPreferences
                      ) ? (
                        userData.questionnaireAnswers.colorPreferences.map(
                          (color, index) => (
                            <div key={index} className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-1"
                                style={{ backgroundColor: color }}
                              ></div>
                              <span className="text-xs text-gray-300">
                                {color}
                              </span>
                            </div>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-400">
                          No color preferences specified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">
                      Desired Website Pages
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {userData.questionnaireAnswers.websitePages &&
                      Array.isArray(
                        userData.questionnaireAnswers.websitePages
                      ) ? (
                        userData.questionnaireAnswers.websitePages.map(
                          (page, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-600 text-xs text-white rounded-md"
                            >
                              {page}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-400">
                          No pages specified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">
                      Desired Visitor Actions
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {userData.questionnaireAnswers.desiredVisitorActions &&
                      Array.isArray(
                        userData.questionnaireAnswers.desiredVisitorActions
                      ) ? (
                        userData.questionnaireAnswers.desiredVisitorActions.map(
                          (action, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-600 text-xs text-white rounded-md"
                            >
                              {action}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-400">
                          No actions specified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Website Information */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-md font-medium text-white mb-4 flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-orange-500" />
                  Current Website Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-1">
                      Has Current Website
                    </p>
                    <p className="text-sm text-gray-200">
                      {renderQuestionnaireField(
                        userData.questionnaireAnswers.hasCurrentWebsite
                      )}
                    </p>
                  </div>
                  {userData.questionnaireAnswers.hasCurrentWebsite ===
                    "Yes" && (
                    <>
                      <div className="bg-gray-700/30 p-4 rounded-md">
                        <p className="text-xs text-gray-400 mb-1">
                          Current Website URL
                        </p>
                        {userData.questionnaireAnswers.currentWebsiteUrl ? (
                          <a
                            href={
                              (
                                userData.questionnaireAnswers
                                  .currentWebsiteUrl as string
                              ).startsWith("http")
                                ? (userData.questionnaireAnswers
                                    .currentWebsiteUrl as string)
                                : `https://${userData.questionnaireAnswers.currentWebsiteUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center text-sm"
                          >
                            {userData.questionnaireAnswers.currentWebsiteUrl}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          <p className="text-sm text-gray-400">Not provided</p>
                        )}
                      </div>
                      <div className="bg-gray-700/30 p-4 rounded-md">
                        <p className="text-xs text-gray-400 mb-1">
                          Current CMS
                        </p>
                        <p className="text-sm text-gray-200">
                          {renderQuestionnaireField(
                            userData.questionnaireAnswers.currentCms
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-700/30 p-4 rounded-md">
                        <p className="text-xs text-gray-400 mb-1">
                          Current Website Likes
                        </p>
                        <p className="text-sm text-gray-200">
                          {renderQuestionnaireField(
                            userData.questionnaireAnswers.websiteLikes
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-700/30 p-4 rounded-md">
                        <p className="text-xs text-gray-400 mb-1">
                          Current Website Dislikes
                        </p>
                        <p className="text-sm text-gray-200">
                          {renderQuestionnaireField(
                            userData.questionnaireAnswers.websiteDislikes
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Domain Information */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-md font-medium text-white mb-4 flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-orange-500" />
                  Domain Information
                </h3>
                <div className="bg-gray-700/30 p-4 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Domain Name</p>
                      {domainInfo.name ? (
                        <div className="flex items-center">
                          <p className="text-white font-medium">
                            {domainInfo.name}
                          </p>
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              domainInfo.isCustom
                                ? "bg-blue-900/30 text-blue-400 border border-blue-800"
                                : "bg-green-900/30 text-green-400 border border-green-800"
                            }`}
                          >
                            {domainInfo.isCustom
                              ? "Client's Own Domain"
                              : "Free Domain"}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          No domain selected
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveTab("domain")}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-1 rounded text-xs flex items-center"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Manage
                    </button>
                  </div>

                  {domainInfo.isCustom &&
                    userData.questionnaireAnswers.domainProvider && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <p className="text-xs text-gray-400 mb-1">
                          Domain Provider
                        </p>
                        <p className="text-sm text-gray-200">
                          {userData.questionnaireAnswers.domainProvider}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Assets */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-md font-medium text-white mb-4 flex items-center">
                  <Database className="h-4 w-4 mr-2 text-orange-500" />
                  Uploaded Assets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Logo */}
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-2">Logo</p>
                    {userData.questionnaireAnswers.logoUpload &&
                    typeof userData.questionnaireAnswers.logoUpload ===
                      "object" &&
                    "url" in userData.questionnaireAnswers.logoUpload ? (
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center overflow-hidden mr-3">
                          {/* Use Next.js Image for better performance */}
                          <div className="relative w-full h-full">
                            <Image
                              src={userData.questionnaireAnswers.logoUpload.url}
                              alt="Logo"
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-200">
                            {userData.questionnaireAnswers.logoUpload.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(
                              userData.questionnaireAnswers.logoUpload.size /
                              1024
                            ).toFixed(1)}{" "}
                            KB
                          </p>
                        </div>

                        {/* Add download button */}
                        <DownloadButton
                          url={userData.questionnaireAnswers.logoUpload.url}
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No logo uploaded</p>
                    )}
                  </div>

                  {/* Team Photos */}
                  <div className="bg-gray-700/30 p-4 rounded-md">
                    <p className="text-xs text-gray-400 mb-2">Team Photos</p>
                    {userData.questionnaireAnswers.teamPhotos &&
                    Array.isArray(userData.questionnaireAnswers.teamPhotos) &&
                    userData.questionnaireAnswers.teamPhotos.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2">
                        {userData.questionnaireAnswers.teamPhotos
                          .slice(0, 8)
                          .map((photo, index) => (
                            <div
                              key={index}
                              className="aspect-square bg-gray-600 rounded-md flex items-center justify-center overflow-hidden"
                            >
                              {/* Use Next.js Image */}
                              <div className="relative w-full h-full">
                                <Image
                                  src={photo.url}
                                  alt={`Team photo ${index + 1}`}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                            </div>
                          ))}
                        {userData.questionnaireAnswers.teamPhotos.length >
                          8 && (
                          <div className="aspect-square bg-gray-600 rounded-md flex items-center justify-center">
                            <span className="text-sm text-gray-300">
                              +
                              {userData.questionnaireAnswers.teamPhotos.length -
                                8}{" "}
                              more
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No team photos uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Preferences */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-md font-medium text-white mb-4 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-orange-500" />
                  Content Preferences
                </h3>
                <div className="bg-gray-700/30 p-4 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">
                    Content Readiness
                  </p>
                  <p className="text-sm text-gray-200 font-medium">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.contentReady
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-700/30 p-6 rounded-lg flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-300 mb-2 text-center">
                This client hasn't completed the questionnaire yet
              </p>
              <p className="text-sm text-gray-400 max-w-md text-center mb-4">
                The client needs to complete the onboarding questionnaire to
                provide information about their business and website
                requirements.
              </p>
              <button
                onClick={() => {
                  // You could add functionality to send a reminder email here
                  setSuccess("Reminder email sent to client");
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              >
                Send Questionnaire Reminder
              </button>
            </div>
          )}
        </div>
      )}

      {/* Phases Tab Content */}
      {activeTab === "phases" && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Layers className="h-5 w-5 mr-2 text-orange-500" />
            Project Phases
          </h2>
          <div className="space-y-6">
            {projectPhases.map((phase, phaseIndex) => (
              <div
                key={phaseIndex}
                className="border border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        phase.status === "completed"
                          ? "bg-green-900 text-green-400"
                          : phase.status === "active"
                          ? "bg-orange-900 text-orange-400"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {getPhaseIcon(phase.name)}
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      {phase.name}
                    </h3>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full mr-3 ${
                        phase.status === "completed"
                          ? "bg-green-900/30 text-green-400 border border-green-800"
                          : phase.status === "active"
                          ? "bg-orange-900/30 text-orange-400 border border-orange-800"
                          : "bg-gray-700 text-gray-400 border border-gray-600"
                      }`}
                    >
                      {phase.status === "completed"
                        ? "Completed"
                        : phase.status === "active"
                        ? "Active"
                        : "Pending"}
                    </span>

                    <select
                      value={phase.status}
                      onChange={(e) =>
                        updatePhaseStatus(
                          phaseIndex,
                          e.target.value as "completed" | "active" | "pending"
                        )
                      }
                      className="bg-gray-700 border-none text-white rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3 ml-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg"
                    >
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            toggleTaskCompletion(phaseIndex, taskIndex)
                          }
                          className="mr-3 flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        <span
                          className={`${
                            task.completed
                              ? "text-gray-400 line-through"
                              : "text-gray-200"
                          }`}
                        >
                          {task.name}
                        </span>
                      </div>

                      <button
                        onClick={() => removeTask(phaseIndex, taskIndex)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add task form */}
                  <div className="mt-4 flex items-center">
                    <input
                      type="text"
                      placeholder="Add new task..."
                      className="flex-1 bg-gray-700 border-none rounded-l-lg px-3 py-2 text-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const target = e.target as HTMLInputElement;
                          addTask(phaseIndex, target.value);
                          target.value = "";
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousSibling as HTMLInputElement;
                        addTask(phaseIndex, input.value);
                        input.value = "";
                      }}
                      className="bg-gray-600 text-white rounded-r-lg px-3 py-2 hover:bg-gray-500"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Tab Content */}
      {activeTab === "feedback" && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-orange-500" />
              Client Feedback
            </h2>

            <div className="flex items-center">
              {!userData?.websiteUrl && (
                <span className="bg-yellow-600/30 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-600 mr-2">
                  Website URL not set
                </span>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllMessagesAsRead}
                  className="text-xs px-3 py-1 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 flex items-center"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {userData?.websiteUrl ? (
            <>
              <div
                ref={feedbackMessagesRef}
                className="bg-gray-700/30 rounded-lg p-4 mb-4 h-[400px] overflow-y-auto"
              >
                {userData?.feedbackMessages &&
                userData.feedbackMessages.length > 0 ? (
                  <div className="space-y-4">
                    {userData.feedbackMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.isFromClient ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.isFromClient
                              ? "bg-blue-900/20 text-blue-100 border border-blue-800"
                              : "bg-orange-900/20 text-orange-100 border border-orange-800"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            <span
                              className={`text-xs font-medium ${
                                message.isFromClient
                                  ? "text-blue-400"
                                  : "text-orange-400"
                              }`}
                            >
                              {message.isFromClient
                                ? userData.firstName || "Client"
                                : message.adminName || "Support Team"}
                            </span>
                            <span className="mx-2 text-gray-500">•</span>
                            <span className="text-xs text-gray-400">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                            {message.isFromClient && !message.isRead && (
                              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-center">
                      No feedback messages yet. Client feedback will appear here
                      once they send comments.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <label className="block text-sm text-gray-300 mb-2">
                  Reply to client
                </label>
                <div className="flex flex-col">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response here..."
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none h-24 mb-3"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || isSendingReply}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSendingReply ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-700/30 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Feedback not available yet
              </h3>
              <p className="text-gray-400 mb-4">
                Client feedback will be available once you set a website URL.
                Clients can only provide feedback after their website is
                published.
              </p>
              <button
                onClick={() => {
                  setActiveTab("website");
                  setActiveSubTab("liveUrl");
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              >
                Go to Website URL Settings
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
