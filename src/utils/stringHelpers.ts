// src/utils/stringHelpers.ts

/**
 * Safely converts any value to a displayable string
 * This helps with type safety when displaying questionnaireAnswers values that could be complex types
 * @param value Any value that needs to be displayed
 * @returns A string representation of the value
 */
export const getStringValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  // For arrays, join with commas
  if (Array.isArray(value)) {
    return value.map((item) => getStringValue(item)).join(", ");
  }

  // For complex objects like FileUpload, try to extract meaningful information
  if (typeof value === "object") {
    // Check if it's a FileUpload object
    if (value.name && value.url) {
      return value.name;
    }

    // For other complex objects, try to extract meaningful data or just return [Object]
    try {
      return JSON.stringify(value);
    } catch (e) {
      return "[Complex Object]";
    }
  }

  // For other primitives like numbers and booleans
  return String(value);
};
