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
    // Add any other fields your users might have
  }