// src/app/dashboard/client/[id]/client-detail.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData, ProjectPhase } from '@/types';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  Circle, 
  Clock, 
  Loader2,
  Plus,
  Trash2,
  Home,
  Palette,
  Rocket,
  Layers
} from 'lucide-react';

// Default project phases for new clients
const DEFAULT_PROJECT_PHASES: ProjectPhase[] = [
  {
    name: "Planning",
    status: "pending",
    tasks: [
      { name: "Requirements", completed: false },
      { name: "Project Setup", completed: false }
    ]
  },
  {
    name: "Design",
    status: "pending",
    tasks: [
      { name: "Mockups", completed: false },
      { name: "Visual Design", completed: false }
    ]
  },
  {
    name: "Design Finalisation",
    status: "pending",
    tasks: [
      { name: "Perfect Design", completed: false },
      { name: "Checking Revisions", completed: false }
    ]
  },
  {
    name: "Launch",
    status: "pending",
    tasks: [
      { name: "Testing", completed: false },
      { name: "Deployment", completed: false }
    ]
  }
];

export default function ClientDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          router.push('/dashboard');
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
  const updatePhaseStatus = (index: number, status: "completed" | "active" | "pending") => {
    const updatedPhases = [...projectPhases];
    updatedPhases[index].status = status;
    
    // If phase is marked completed, mark all tasks as completed
    if (status === "completed") {
      updatedPhases[index].tasks.forEach(task => {
        task.completed = true;
      });
    }
    
    // If phase is marked active, ensure at least the previous phase is completed
    if (status === "active" && index > 0) {
      updatedPhases[index - 1].status = "completed";
      updatedPhases[index - 1].tasks.forEach(task => {
        task.completed = true;
      });
    }
    
    setProjectPhases(updatedPhases);
  };

  // Toggle task completion
  const toggleTaskCompletion = (phaseIndex: number, taskIndex: number) => {
    const updatedPhases = [...projectPhases];
    updatedPhases[phaseIndex].tasks[taskIndex].completed = !updatedPhases[phaseIndex].tasks[taskIndex].completed;
    
    // Check if all tasks are completed, update phase status accordingly
    const allCompleted = updatedPhases[phaseIndex].tasks.every(task => task.completed);
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
      completed: false
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
      setError('');
      setSuccess('');
      
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        projectPhases: projectPhases,
        updatedAt: new Date().toISOString()
      });
      
      setSuccess("Client project phases updated successfully");
      
      // Set success message timeout
      setTimeout(() => {
        setSuccess('');
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
          onClick={() => router.push('/dashboard')}
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
            <p className="text-white">{userData.phoneNumber || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm">Subscription</p>
            <p className="text-white">
              {userData.planType || 'Standard'} ({userData.billingCycle || 'Monthly'})
            </p>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <p className={`${
              userData.subscriptionStatus === "active" ? "text-green-400" :
              userData.subscriptionStatus === "canceled" ? "text-red-400" :
              "text-yellow-400"
            }`}>
              {userData.subscriptionStatus === "active" ? "Active" :
              userData.subscriptionStatus === "canceled" ? "Canceled" :
              userData.subscriptionStatus === "pending" ? "Pending" : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Project Phases Management */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Project Phases</h2>
        
        <div className="space-y-6">
          {projectPhases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    phase.status === "completed" ? "bg-green-900 text-green-400" : 
                    phase.status === "active" ? "bg-orange-900 text-orange-400" : 
                    "bg-gray-700 text-gray-400"
                  }`}>
                    {getPhaseIcon(phase.name)}
                  </div>
                  <h3 className="text-lg font-medium text-white">{phase.name}</h3>
                </div>
                
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full mr-3 ${
                    phase.status === "completed" ? "bg-green-900/30 text-green-400 border border-green-800" :
                    phase.status === "active" ? "bg-orange-900/30 text-orange-400 border border-orange-800" :
                    "bg-gray-700 text-gray-400 border border-gray-600"
                  }`}>
                    {phase.status === "completed" ? "Completed" :
                    phase.status === "active" ? "Active" :
                    "Pending"}
                  </span>
                  
                  <select
                    value={phase.status}
                    onChange={(e) => updatePhaseStatus(
                      phaseIndex, 
                      e.target.value as "completed" | "active" | "pending"
                    )}
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
                  <div key={taskIndex} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleTaskCompletion(phaseIndex, taskIndex)}
                        className="mr-3 flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      <span className={`${task.completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
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
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        addTask(phaseIndex, target.value);
                        target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling as HTMLInputElement;
                      addTask(phaseIndex, input.value);
                      input.value = '';
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
    </div>
  );
}