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
  questionnaireAnswers?: QuestionnaireAnswers;
  websiteUrl?: string; // Live URL for the customer's website
  websitePreviewUrl?: string; // URL for website preview image
  feedbackMessages?: FeedbackMessage[];
  editorUrl?: string;
  revisionsUrl?: string;

  // Add any other fields your users might have
}

export interface FeedbackMessage {
  text: string;
  timestamp: string;
  isFromClient: boolean;
  isRead: boolean;
  userId: string;
  userEmail?: string;
  userName?: string;
  adminName?: string;
}

export interface ProjectPhase {
  name: string;
  status: "completed" | "active" | "pending";
  tasks: {
    name: string;
    completed: boolean;
  }[];
}

export interface FileUpload {
  name: string;
  url: string;
  type: string;
  size: number;
}

// For website list entries
export interface WebsiteEntry {
  name: string;
  url: string;
}

export interface QuestionnaireAnswers {
  [key: string]:
    | string
    | string[]
    | WebsiteEntry[]
    | FileUpload
    | FileUpload[]
    | null
    | undefined;

  // Business Information
  businessName?: string;
  businessTagline?: string;
  businessDescription?: string;
  businessGoals?: string;
  businessUnique?: string;
  servicesProducts?: string;
  competitors?: WebsiteEntry[];
  targetAudience?: string;
  businessProblemSolving?: string;

  // Current Website
  hasCurrentWebsite?: string;
  currentWebsiteUrl?: string;
  websiteLikes?: string;
  websiteDislikes?: string;
  currentCms?: string;

  // Project Goals
  primaryWebsiteGoal?: string;
  desiredVisitorActions?: string[];

  // Website Structure
  websitePages?: string[];
  ecommerceNeeded?: string;
  blogNeeded?: string;

  // Design Preferences
  colorPreferences?: string[];
  websiteStyle?: string[];

  // Content & Media
  logoUpload?: FileUpload;
  teamPhotos?: FileUpload[];
  contentReady?: string;

  // Technical & Admin
  domainName?: string;

  // SEO & Marketing
  seoKeywords?: WebsiteEntry[];
}
