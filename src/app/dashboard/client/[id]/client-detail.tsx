/* eslint-disable */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserData, ProjectPhase, TabType } from "@/types";

// Components
import { ClientHeader } from "@/components/client/ClientHeader";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ConfirmationModal } from "@/components/client/ConfirmationModal";
import { Toast } from "@/components/client/Toast";
import { OverviewTab } from "@/components/client/tabs/OverviewTab";
import { DomainTab } from "@/components/client/tabs/DomainTab";
import { WebsiteTab } from "@/components/client/tabs/WebsiteTab";
import { QuestionnaireTab } from "@/components/client/tabs/QuestionnaireTab";
import { ProjectPhasesTab } from "@/components/client/tabs/ProjectPhasesTab";
import { NotesTab } from "@/components/client/tabs/NotesTab";
import { AnalyticsTab } from "@/components/client/tabs/AnalyticsTab";

// Default project phases for new clients
import { DEFAULT_PROJECT_PHASES } from "@/components/client/constants";

// Helper functions
import { parseDomainValue } from "@/components/client/utils";

export default function ClientDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [activeSubTab, setActiveSubTab] = useState<
    "preview" | "liveUrl" | "editor" | "revisions"
  >("preview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "warning" | "info" | "success" | "danger";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info" | "warning";
  }>({
    visible: false,
    message: "",
    type: "success",
  });
  const [clientNotes, setClientNotes] = useState<string>("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

          // Initialize client notes
          setClientNotes(data.notes || "");
        } else {
          showToast("Client not found", "error");
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Error fetching client data:", err);
        showToast("Failed to load client data", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchClientData();
  }, [id, router]);

  // Show toast notification
  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Show confirmation modal
  const showConfirmModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: "warning" | "info" | "success" | "danger" = "warning"
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
    });
  };

  // Hide confirmation modal
  const hideConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

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
    showToast("Task added successfully", "success");
  };

  // Remove a task
  const removeTask = (phaseIndex: number, taskIndex: number) => {
    showConfirmModal(
      "Remove Task",
      "Are you sure you want to remove this task? This action cannot be undone.",
      () => {
        const updatedPhases = [...projectPhases];
        updatedPhases[phaseIndex].tasks.splice(taskIndex, 1);
        setProjectPhases(updatedPhases);
        showToast("Task removed successfully", "success");
      },
      "danger"
    );
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
        notes: clientNotes,
        updatedAt: new Date().toISOString(),
      });

      showToast("Changes saved successfully", "success");
    } catch (err) {
      console.error("Error saving client data:", err);
      showToast("Failed to save changes", "error");
    } finally {
      setSaving(false);
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

      showToast(successMessage, "success");
    } catch (err) {
      console.error(`Error updating ${fieldName}:`, err);
      showToast(`Failed to update ${fieldName}`, "error");
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

      showToast("Domain information updated successfully", "success");
    } catch (err) {
      console.error("Error updating domain information:", err);
      showToast("Failed to update domain information", "error");
    } finally {
      setSaving(false);
    }
  };

  // Save client notes
  const saveClientNotes = async () => {
    if (!userData) return;

    try {
      setSaving(true);
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        notes: clientNotes,
        updatedAt: new Date().toISOString(),
      });

      setIsEditingNotes(false);
      showToast("Client notes saved successfully", "success");
    } catch (err) {
      console.error("Error saving client notes:", err);
      showToast("Failed to save client notes", "error");
    } finally {
      setSaving(false);
    }
  };

  // Export client data
  const exportClientData = () => {
    if (!userData) return;

    setIsExporting(true);

    try {
      // Create a formatted object for export
      const exportData = {
        clientInfo: {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phoneNumber || "Not provided",
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        },
        subscription: {
          plan: userData.planType || "Standard",
          billingCycle: userData.billingCycle || "Monthly",
          status: userData.subscriptionStatus || "Unknown",
        },
        website: {
          domain: domainInfo.name || "Not set",
          domainType: domainInfo.isCustom ? "Custom Domain" : "Free Domain",
          websiteUrl: userData.websiteUrl || "Not published",
          editorUrl: userData.editorUrl || "Not set",
          revisionsUrl: userData.revisionsUrl || "Not set",
        },
        projectPhases: projectPhases,
        notes: clientNotes || "No notes",
        questionnaire: userData.questionnaireAnswers || "Not completed",
      };

      // Convert to JSON string with pretty formatting
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create a blob and download link
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `client_${userData.firstName}_${userData.lastName}_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("Client data exported successfully", "success");
    } catch (err) {
      console.error("Error exporting client data:", err);
      showToast("Failed to export client data", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate project completion percentage
  const projectCompletionPercentage = useMemo(() => {
    if (!projectPhases.length) return 0;

    const completedPhases = projectPhases.filter(
      (phase) => phase.status === "completed"
    ).length;
    return Math.round((completedPhases / projectPhases.length) * 100);
  }, [projectPhases]);

  // Parse domain information
  const domainInfo = useMemo(() => {
    const domainValue =
      userData?.questionnaireAnswers?.customDomainName ||
      userData?.questionnaireAnswers?.domainName;
    return parseDomainValue(domainValue as string);
  }, [userData?.questionnaireAnswers]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading client data...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Client Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The client you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={hideConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />

      {/* Sidebar */}
      <ClientSidebar
        userData={userData}
        projectCompletionPercentage={projectCompletionPercentage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        exportClientData={exportClientData}
      />

      {/* Main content area with header */}
      <div
        className={`ml-${
          sidebarOpen ? "72" : "20"
        } transition-all duration-300`}
      >
        <div className="pl-[72px] md:pl-[72px]">
          {/* Header */}
          <ClientHeader
            userData={userData}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            router={router}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            isExporting={isExporting}
            exportClientData={exportClientData}
            isNotificationsOpen={isNotificationsOpen}
            setIsNotificationsOpen={setIsNotificationsOpen}
            isUserMenuOpen={isUserMenuOpen}
            setIsUserMenuOpen={setIsUserMenuOpen}
            setActiveTab={setActiveTab}
            saving={saving}
            saveChanges={saveChanges}
          />

          {/* Content area */}
          <div className="p-6">
            {/* Website Tab - Sub Navigation */}
            {activeTab === "website" && (
              <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
                <div className="flex p-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveSubTab("preview")}
                    className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      activeSubTab === "preview"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Preview Image
                  </button>
                  <button
                    onClick={() => setActiveSubTab("liveUrl")}
                    className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      activeSubTab === "liveUrl"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Live URL
                  </button>
                  <button
                    onClick={() => setActiveSubTab("editor")}
                    className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      activeSubTab === "editor"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Editor URL
                  </button>
                  <button
                    onClick={() => setActiveSubTab("revisions")}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      activeSubTab === "revisions"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Revisions URL
                  </button>
                </div>
              </div>
            )}

            {/* Tab content */}
            <div className="bg-white rounded-xl shadow-md p-6">
              {activeTab === "overview" && (
                <OverviewTab
                  userData={userData}
                  projectPhases={projectPhases}
                  projectCompletionPercentage={projectCompletionPercentage}
                  domainInfo={domainInfo}
                  setActiveTab={setActiveTab}
                  exportClientData={exportClientData}
                />
              )}

              {activeTab === "domain" && (
                <DomainTab
                  userData={userData}
                  domainInfo={domainInfo}
                  updateDomainInfo={updateDomainInfo}
                  showConfirmModal={showConfirmModal}
                />
              )}

              {activeTab === "website" && (
                <WebsiteTab
                  userData={userData}
                  activeSubTab={activeSubTab}
                  updateUserField={updateUserField}
                />
              )}

              {activeTab === "questionnaire" && (
                <QuestionnaireTab userData={userData} />
              )}

              {activeTab === "phases" && (
                <ProjectPhasesTab
                  projectPhases={projectPhases}
                  updatePhaseStatus={updatePhaseStatus}
                  toggleTaskCompletion={toggleTaskCompletion}
                  addTask={addTask}
                  removeTask={removeTask}
                  saveChanges={saveChanges}
                  saving={saving}
                />
              )}

              {activeTab === "notes" && (
                <NotesTab
                  clientNotes={clientNotes}
                  setClientNotes={setClientNotes}
                  isEditingNotes={isEditingNotes}
                  setIsEditingNotes={setIsEditingNotes}
                  saveClientNotes={saveClientNotes}
                  saving={saving}
                />
              )}

              {activeTab === "analytics" && (
                <AnalyticsTab
                  userData={userData}
                  projectCompletionPercentage={projectCompletionPercentage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
