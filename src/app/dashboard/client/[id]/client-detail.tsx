"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserData, ProjectPhase, FileUpload, WebsiteEntry } from "@/types";
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
  Phone,
  CreditCard,
  Activity,
  ImageIcon,
  Building,
  Target,
  PenTool,
  ExternalLink,
  Server,
  Mail,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  defaultValue = "Not provided"
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
  const [activeTab, setActiveTab] = useState("overview");

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
      case "revisions":
        return <PenTool className="h-5 w-5" />;
      case "launch":
        return <Rocket className="h-5 w-5" />;
      default:
        return <Layers className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <Alert
        variant="destructive"
        className="bg-red-950/30 border border-red-900"
      >
        <AlertDescription>Client not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-gray-300 hover:text-white hover:bg-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Clients</span>
          </Button>

          <Button
            onClick={saveChanges}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
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
          </Button>
        </div>

        {/* Success and error messages */}
        {success && (
          <Alert className="bg-green-950/30 border border-green-900 text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-950/30 border border-red-900"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Client info card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-white">
              {userData.firstName} {userData.lastName}
            </CardTitle>
            <Badge
              variant={
                userData.subscriptionStatus === "active"
                  ? "default"
                  : userData.subscriptionStatus === "canceled"
                  ? "destructive"
                  : "secondary"
              }
              className={
                userData.subscriptionStatus === "active"
                  ? "bg-blue-900 text-blue-200 hover:bg-blue-900"
                  : userData.subscriptionStatus === "canceled"
                  ? "bg-red-900 text-red-200 hover:bg-red-900"
                  : "bg-yellow-900 text-yellow-200 hover:bg-yellow-900"
              }
            >
              {userData.subscriptionStatus === "active"
                ? "Active"
                : userData.subscriptionStatus === "canceled"
                ? "Canceled"
                : "Pending"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-gray-400 text-xs">Phone</p>
                  <p className="text-white">{userData.phoneNumber || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-gray-400 text-xs">Subscription</p>
                  <p className="text-white">
                    {userData.planType || "Standard"} (
                    {userData.billingCycle || "Monthly"})
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Activity className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-gray-400 text-xs">Status</p>
                  <p
                    className={`${
                      userData.subscriptionStatus === "active"
                        ? "text-blue-400"
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
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="phases" className="w-full">
          <TabsList className="bg-gray-900 border-gray-800 p-0 mb-6">
            <TabsTrigger
              value="phases"
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-md py-2 px-4"
            >
              Project Phases
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-md py-2 px-4"
            >
              Website Preview
            </TabsTrigger>
            <TabsTrigger
              value="questionnaire"
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-md py-2 px-4"
            >
              Questionnaire
            </TabsTrigger>
          </TabsList>

          {/* Project Phases Tab */}
          <TabsContent value="phases" className="mt-0">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  Project Phases
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage the client's project progress through different phases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {projectPhases.map((phase, phaseIndex) => (
                  <Card
                    key={phaseIndex}
                    className="bg-gray-800 border-gray-700"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              phase.status === "completed"
                                ? "bg-blue-900/60 text-blue-300"
                                : phase.status === "active"
                                ? "bg-blue-900/40 text-blue-400"
                                : "bg-gray-700 text-gray-400"
                            }`}
                          >
                            {getPhaseIcon(phase.name)}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white">
                              {phase.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`${
                                phase.status === "completed"
                                  ? "bg-blue-900/30 text-blue-300 border-blue-800"
                                  : phase.status === "active"
                                  ? "bg-blue-900/20 text-blue-400 border-blue-900"
                                  : "bg-gray-800 text-gray-400 border-gray-700"
                              }`}
                            >
                              {phase.status === "completed"
                                ? "Completed"
                                : phase.status === "active"
                                ? "Active"
                                : "Pending"}
                            </Badge>
                          </div>
                        </div>

                        <Select
                          value={phase.status}
                          onValueChange={(value) =>
                            updatePhaseStatus(
                              phaseIndex,
                              value as "completed" | "active" | "pending"
                            )
                          }
                        >
                          <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {phase.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                toggleTaskCompletion(phaseIndex, taskIndex)
                              }
                              className="mr-3 flex-shrink-0"
                            >
                              {task.completed ? (
                                <CheckCircle className="h-5 w-5 text-blue-500" />
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

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTask(phaseIndex, taskIndex)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      {/* Add task form */}
                      <div className="mt-4 flex items-center">
                        <Input
                          type="text"
                          placeholder="Add new task..."
                          className="flex-1 bg-gray-800 border-gray-700 rounded-r-none focus-visible:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const target = e.target as HTMLInputElement;
                              addTask(phaseIndex, target.value);
                              target.value = "";
                            }
                          }}
                        />
                        <Button
                          onClick={(e) => {
                            const input = e.currentTarget
                              .previousSibling as HTMLInputElement;
                            addTask(phaseIndex, input.value);
                            input.value = "";
                          }}
                          className="bg-blue-700 hover:bg-blue-600 text-white rounded-l-none"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Website Preview Tab */}
          <TabsContent value="preview" className="mt-0">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  Website Preview
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage the client's website preview image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current preview */}
                {userData.websitePreviewUrl ? (
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">
                      Current Website Preview
                    </p>
                    <div
                      className="relative rounded-lg overflow-hidden"
                      style={{ maxHeight: "300px" }}
                    >
                      <img
                        src={userData.websitePreviewUrl || "/placeholder.svg"}
                        alt="Website Preview"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center justify-center">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400">
                        No website preview image set
                      </p>
                    </div>
                  </div>
                )}

                {/* Update preview URL */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium text-white">
                      Update Website Preview URL
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex">
                      <Input
                        type="text"
                        placeholder="Enter image URL"
                        defaultValue={userData.websitePreviewUrl || ""}
                        className="flex-1 bg-gray-700 border-gray-600 rounded-r-none focus-visible:ring-blue-500"
                        id="website-preview-url"
                      />
                      <Button
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

                              setSuccess(
                                "Website preview image updated successfully"
                              );

                              // Set success message timeout
                              setTimeout(() => {
                                setSuccess("");
                              }, 3000);
                            } else {
                              setError("Please enter a valid URL");
                            }
                          } catch (err) {
                            console.error(
                              "Error updating website preview:",
                              err
                            );
                            setError("Failed to update website preview");
                          } finally {
                            setSaving(false);
                          }
                        }}
                        className="bg-blue-700 hover:bg-blue-600 text-white rounded-l-none"
                      >
                        Update
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Paste a direct link to an image file (JPG, PNG, WEBP). The
                      image should be at least 1200x800 pixels.
                    </p>
                  </CardContent>
                </Card>

                {/* Remove preview */}
                {userData.websitePreviewUrl && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium text-white">
                        Remove Preview Image
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="destructive"
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
                            console.error(
                              "Error removing website preview:",
                              err
                            );
                            setError("Failed to remove website preview");
                          } finally {
                            setSaving(false);
                          }
                        }}
                        className="bg-red-700 hover:bg-red-600 text-white"
                      >
                        Remove Preview Image
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questionnaire Tab */}
          <TabsContent value="questionnaire" className="mt-0">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  Questionnaire Answers
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View client's responses to the onboarding questionnaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userData?.questionnaireAnswers ? (
                  <div className="space-y-6">
                    {/* Business Information */}
                    <div>
                      <h3 className="text-md font-medium text-blue-400 mb-3 flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Business Information
                      </h3>
                      <Separator className="mb-4 bg-gray-800" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Business Name
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.businessName
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Business Tagline
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.businessTagline
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Business Description
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers
                                  .businessDescription
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Business Goals
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.businessGoals
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Unique Selling Proposition
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.businessUnique
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Services & Products
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.servicesProducts
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Target Audience
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.targetAudience
                              )}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Design Information */}
                    <div>
                      <h3 className="text-md font-medium text-blue-400 mb-3 flex items-center">
                        <PenTool className="h-4 w-4 mr-2" />
                        Design Information
                      </h3>
                      <Separator className="mb-4 bg-gray-800" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Website Style
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.websiteStyle
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
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
                                    <div
                                      key={index}
                                      className="flex items-center"
                                    >
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
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Font Preferences
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.fontPreferences
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Content Readiness
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.contentReady
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Website Pages
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {userData.questionnaireAnswers.websitePages &&
                              Array.isArray(
                                userData.questionnaireAnswers.websitePages
                              ) ? (
                                userData.questionnaireAnswers.websitePages.map(
                                  (page, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-blue-900/30 text-blue-300 border-blue-800"
                                    >
                                      {page}
                                    </Badge>
                                  )
                                )
                              ) : (
                                <span className="text-sm text-gray-400">
                                  No pages specified
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Competitors */}
                    <div>
                      <h3 className="text-md font-medium text-blue-400 mb-3 flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Competitors
                      </h3>
                      <Separator className="mb-4 bg-gray-800" />
                      {userData.questionnaireAnswers.competitors &&
                      Array.isArray(
                        userData.questionnaireAnswers.competitors
                      ) &&
                      userData.questionnaireAnswers.competitors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userData.questionnaireAnswers.competitors.map(
                            (competitor, index) => (
                              <Card
                                key={index}
                                className="bg-gray-800 border-gray-700"
                              >
                                <CardContent className="p-4 flex items-center">
                                  <div className="mr-3 w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                                    <Globe className="h-4 w-4 text-blue-300" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-white">
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
                                        className="text-xs text-blue-400 hover:underline flex items-center"
                                      >
                                        {competitor.url}
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                      </a>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      ) : (
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-400">
                              No competitors listed
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Technical Information */}
                    <div>
                      <h3 className="text-md font-medium text-blue-400 mb-3 flex items-center">
                        <Server className="h-4 w-4 mr-2" />
                        Technical Information
                      </h3>
                      <Separator className="mb-4 bg-gray-800" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Current Website
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.hasCurrentWebsite
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        {userData.questionnaireAnswers.hasCurrentWebsite ===
                          "Yes" && (
                          <>
                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4">
                                <p className="text-xs text-gray-400 mb-1">
                                  Current Website URL
                                </p>
                                {userData.questionnaireAnswers
                                  .currentWebsiteUrl ? (
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
                                    className="text-sm text-blue-400 hover:underline flex items-center"
                                  >
                                    {
                                      userData.questionnaireAnswers
                                        .currentWebsiteUrl
                                    }
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                ) : (
                                  <p className="text-sm text-gray-400">
                                    Not provided
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4">
                                <p className="text-xs text-gray-400 mb-1">
                                  Current CMS/Platform
                                </p>
                                <p className="text-sm text-white">
                                  {renderQuestionnaireField(
                                    userData.questionnaireAnswers.currentCms
                                  )}
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4">
                                <p className="text-xs text-gray-400 mb-1">
                                  Current Website Likes
                                </p>
                                <p className="text-sm text-white">
                                  {renderQuestionnaireField(
                                    userData.questionnaireAnswers.websiteLikes
                                  )}
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4">
                                <p className="text-xs text-gray-400 mb-1">
                                  Current Website Dislikes
                                </p>
                                <p className="text-sm text-white">
                                  {renderQuestionnaireField(
                                    userData.questionnaireAnswers
                                      .websiteDislikes
                                  )}
                                </p>
                              </CardContent>
                            </Card>
                          </>
                        )}
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Domain Name
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.domainName
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-400 mb-1">
                              Domain Provider
                            </p>
                            <p className="text-sm text-white">
                              {renderQuestionnaireField(
                                userData.questionnaireAnswers.domainProvider
                              )}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
                    <p className="text-gray-400">
                      No questionnaire answers available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
