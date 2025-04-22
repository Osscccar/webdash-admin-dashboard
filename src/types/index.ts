// src/types/index.ts

// Tab type definition to be used across components
export type TabType =
  | "overview"
  | "domain"
  | "website"
  | "questionnaire"
  | "phases"
  | "notes"
  | "analytics";

// Project Phase types
export interface ProjectPhase {
  name: string;
  status: "completed" | "active" | "pending";
  tasks: {
    name: string;
    completed: boolean;
  }[];
}

// User-related types
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
  questionnaireAnswers?: QuestionnaireAnswers;
  createdAt?: string;
  updatedAt?: string;
  planType?: string;
  billingCycle?: string;
  projectPhases?: ProjectPhase[]; // Added project phases to the user data type
  websiteUrl?: string; // Live URL for the customer's website
  websitePreviewUrl?: string; // URL for website preview image
  editorUrl?: string;
  revisionsUrl?: string;
  notes?: string; // Added notes field for client notes feature
  // Reminder questionnaire stuff
  questionnairePostponed?: boolean;
  questionnaireReminderStatus?: string;
  firstReminderTime?: string;
  secondReminderTime?: string;
  websitePublishedDate?: string; // Date when the website was published (used in analytics)
}

// For file uploads
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

// Adding domain information type
export interface DomainInfo {
  name: string;
  isCustom: boolean;
  provider?: string;
  registrationDate?: string;
  expiryDate?: string;
}

// Questionnaire answers can have different types depending on the question
export interface QuestionnaireAnswers {
  [key: string]:
    | string
    | string[]
    | WebsiteEntry[]
    | FileUpload
    | FileUpload[]
    | DomainInfo
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
  customDomainName?: string; // For custom domain input
  domainProvider?: string;

  // SEO & Marketing
  seoKeywords?: WebsiteEntry[];
}
