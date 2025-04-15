// src/app/dashboard/client/[id]/client-detail.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData, ProjectPhase, FileUpload, WebsiteEntry } from "@/types";
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
} from "lucide-react";
import Image from "next/image"; // Import Next.js Image component

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

export default function ClientDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // Get appropriate icon for a phase based on its name
  const getPhaseIcon = (phaseName: string) => {
    switch (phaseName.toLowerCase()) {
      case "planning":
        return <Home className="h-5 w-5" />;
      case "design":
        return <Palette className="h-5 w-5" />;
      case "design finalisation":
        return <Palette className="h-5 w-5" />;
      case "launch":
        return <Rocket className="h-5 w-5" />;
      default:
        return <Layers className="h-5 w-5" />;
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

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-gray-300 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Clients</span>
        </button>

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
        <div className="bg-green-900/30 border border-green-800 p-4 rounded-lg">
          <p className="text-green-400">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Client info card */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          {userData.firstName} {userData.lastName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-white">{userData.email}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Phone</p>
            <p className="text-white">{userData.phoneNumber || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Subscription</p>
            <p className="text-white">
              {userData.planType || "Standard"} (
              {userData.billingCycle || "Monthly"})
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <p
              className={`${
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
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Project Phases Management */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Project Phases</h2>
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

      {/* Website Preview Management */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Website Preview</h2>

        <div className="space-y-4">
          {/* Current preview */}
          {userData.websitePreviewUrl ? (
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">
                Current Website Preview
              </p>
              <div
                className="relative rounded-lg overflow-hidden"
                style={{ maxHeight: "300px" }}
              >
                <img
                  src={userData.websitePreviewUrl}
                  alt="Website Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-700/30 p-4 rounded-lg flex items-center justify-center">
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
                <p className="text-gray-400">No website preview image set</p>
              </div>
            </div>
          )}

          {/* Update preview URL */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-3">
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
                  try {
                    const input = document.getElementById(
                      "website-preview-url"
                    ) as HTMLInputElement;
                    const url = input.value.trim();

                    if (url) {
                      setSaving(true);
                      setError("");
                      setSuccess("");

                      const docRef = doc(db, "users", id);
                      await updateDoc(docRef, {
                        websitePreviewUrl: url,
                        updatedAt: new Date().toISOString(),
                      });

                      // Update local state to reflect changes immediately
                      setUserData({
                        ...userData,
                        websitePreviewUrl: url,
                      });

                      setSuccess("Website preview image updated successfully");

                      // Set success message timeout
                      setTimeout(() => {
                        setSuccess("");
                      }, 3000);
                    } else {
                      setError("Please enter a valid URL");
                    }
                  } catch (err) {
                    console.error("Error updating website preview:", err);
                    setError("Failed to update website preview");
                  } finally {
                    setSaving(false);
                  }
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-r-lg"
              >
                Update
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Paste a direct link to an image file (JPG, PNG, WEBP). The image
              should be at least 1200x800 pixels.
            </p>
          </div>

          {/* Remove preview */}
          {userData.websitePreviewUrl && (
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-3">Remove Preview Image</p>
              <button
                onClick={async () => {
                  try {
                    setSaving(true);
                    setError("");
                    setSuccess("");

                    const docRef = doc(db, "users", id);
                    await updateDoc(docRef, {
                      websitePreviewUrl: null,
                      updatedAt: new Date().toISOString(),
                    });

                    // Update local state to reflect changes immediately
                    setUserData({
                      ...userData,
                      websitePreviewUrl: undefined,
                    });

                    setSuccess("Website preview image removed");

                    // Set success message timeout
                    setTimeout(() => {
                      setSuccess("");
                    }, 3000);
                  } catch (err) {
                    console.error("Error removing website preview:", err);
                    setError("Failed to remove website preview");
                  } finally {
                    setSaving(false);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Remove Preview Image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Questionnaire Answers */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Questionnaire Answers
        </h2>

        {userData?.questionnaireAnswers ? (
          <div className="space-y-6">
            {/* Business Information */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-md font-medium text-gray-300 mb-3">
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Business Name</p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.businessName
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Business Tagline</p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.businessTagline
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">
                    Business Description
                  </p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.businessDescription
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Business Goals</p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.businessGoals
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">
                    Unique Selling Proposition
                  </p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.businessUnique
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">
                    Services & Products
                  </p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.servicesProducts
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Target Audience</p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.targetAudience
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Design Information */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-md font-medium text-gray-300 mb-3">
                Design Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Website Style</p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.websiteStyle
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
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
                        No color preferences
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Font Preferences</p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.fontPreferences
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">
                    Content Readiness
                  </p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.contentReady
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Website Pages</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userData.questionnaireAnswers.websitePages &&
                    Array.isArray(
                      userData.questionnaireAnswers.websitePages
                    ) ? (
                      userData.questionnaireAnswers.websitePages.map(
                        (page, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-600 text-xs text-gray-200 rounded-md"
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
              </div>
            </div>

            {/* Competitors */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-md font-medium text-gray-300 mb-3">
                Competitors
              </h3>
              {userData.questionnaireAnswers.competitors &&
              Array.isArray(userData.questionnaireAnswers.competitors) &&
              userData.questionnaireAnswers.competitors.length > 0 ? (
                <div className="space-y-2">
                  {userData.questionnaireAnswers.competitors.map(
                    (competitor, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/30 p-3 rounded-md flex items-center"
                      >
                        <div className="mr-3 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                          <Globe className="h-3 w-3 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-200">
                            {competitor.name}
                          </p>
                          {competitor.url && (
                            <a
                              href={
                                /^https?:\/\//.test(competitor.url)
                                  ? competitor.url
                                  : `https://${competitor.url}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-orange-400 hover:underline"
                            >
                              {competitor.url}
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-sm text-gray-400">No competitors listed</p>
                </div>
              )}
            </div>

            {/* Assets */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-md font-medium text-gray-300 mb-3">
                Uploaded Assets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo */}
                <div className="bg-gray-700/30 p-3 rounded-md">
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
                      <div>
                        <p className="text-sm text-gray-200">
                          {userData.questionnaireAnswers.logoUpload.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(
                            userData.questionnaireAnswers.logoUpload.size / 1024
                          ).toFixed(1)}{" "}
                          KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No logo uploaded</p>
                  )}
                </div>

                {/* Team Photos */}
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-2">Team Photos</p>
                  {userData.questionnaireAnswers.teamPhotos &&
                  Array.isArray(userData.questionnaireAnswers.teamPhotos) &&
                  userData.questionnaireAnswers.teamPhotos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {userData.questionnaireAnswers.teamPhotos
                        .slice(0, 6)
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
                      {userData.questionnaireAnswers.teamPhotos.length > 6 && (
                        <div className="aspect-square bg-gray-600 rounded-md flex items-center justify-center">
                          <span className="text-sm text-gray-300">
                            +
                            {userData.questionnaireAnswers.teamPhotos.length -
                              6}{" "}
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

            {/* Additional Information */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-md font-medium text-gray-300 mb-3">
                Technical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Current Website</p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.hasCurrentWebsite
                    )}
                  </p>
                </div>
                {userData.questionnaireAnswers.hasCurrentWebsite === "Yes" && (
                  <>
                    <div className="bg-gray-700/30 p-3 rounded-md">
                      <p className="text-xs text-gray-400 mb-1">
                        Current Website URL
                      </p>
                      {userData.questionnaireAnswers.currentWebsiteUrl ? (
                        <a
                          href={
                            /^https?:\/\//.test(
                              userData.questionnaireAnswers
                                .currentWebsiteUrl as string
                            )
                              ? (userData.questionnaireAnswers
                                  .currentWebsiteUrl as string)
                              : `https://${userData.questionnaireAnswers.currentWebsiteUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-400 hover:underline"
                        >
                          {userData.questionnaireAnswers.currentWebsiteUrl}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400">Not provided</p>
                      )}
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-md">
                      <p className="text-xs text-gray-400 mb-1">
                        Current CMS/Platform
                      </p>
                      <p className="text-sm text-gray-200">
                        {renderQuestionnaireField(
                          userData.questionnaireAnswers.currentCms
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-md">
                      <p className="text-xs text-gray-400 mb-1">
                        Current Website Likes
                      </p>
                      <p className="text-sm text-gray-200">
                        {renderQuestionnaireField(
                          userData.questionnaireAnswers.websiteLikes
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-md">
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
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Domain Name</p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.domainName
                    )}
                  </p>
                </div>
                <div className="bg-gray-700/30 p-3 rounded-md">
                  <p className="text-xs text-gray-400 mb-1">Domain Provider</p>
                  <p className="text-sm text-gray-200">
                    {renderQuestionnaireField(
                      userData.questionnaireAnswers.domainProvider
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-700/30 p-4 rounded-lg text-center">
            <p className="text-gray-400">No questionnaire answers available</p>
          </div>
        )}
      </div>
    </div>
  );
}
