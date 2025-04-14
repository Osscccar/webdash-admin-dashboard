// src/types/index.ts



export interface UserData {
    id?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    hasPaid?: boolean;
    stripeCustomerId?: string;
    subscriptionStatus?: "active" | "canceled" | "pending" | "suspended";
    paymentMethod?: string;
    completedQuestionnaire?: boolean;
    createdAt?: string;
    updatedAt?: string;
    planType?: string;
    billingCycle?: string;
    projectPhases?: ProjectPhase[];
    // Add any other fields your users might have
  }

  export interface ProjectPhase {
    name: string;
    status: "completed" | "active" | "pending";
    tasks: {
      name: string;
      completed: boolean;
    }[];
  }

  
