import type { WebsiteEntry, FileUpload } from "@/types";
import type React from "react";

// Helper function to safely render questionnaire fields
export const renderQuestionnaireField = (
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

// Parse domain value from questionnaire
export const parseDomainValue = (
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

// Get appropriate icon for a phase based on its name
export const getPhaseIcon = (phaseName: string) => {
  switch (phaseName.toLowerCase()) {
    case "planning":
      return "clipboard-check";
    case "design":
      return "palette";
    case "design finalisation":
      return "palette";
    case "revisions":
      return "edit";
    case "launch":
      return "rocket";
    default:
      return "layers";
  }
};
