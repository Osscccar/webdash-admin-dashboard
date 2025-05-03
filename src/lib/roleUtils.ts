// src/lib/roleUtils.ts

// Define the role type
export type UserRole = "admin" | "designer";

// Define the User interface
export interface User {
  username: string;
  password: string;
  role: UserRole;
}

// Parse users from environment variable
export const parseAdminUsers = (): Record<string, User> => {
  const usersStr = process.env.NEXT_PUBLIC_ADMIN_USERS || "";
  const users: Record<string, User> = {};

  // If not using new format, fall back to old credentials
  if (!usersStr) {
    const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (validUsername && validPassword) {
      users[validUsername] = {
        username: validUsername,
        password: validPassword,
        role: "admin",
      };
    }
    return users;
  }

  // Parse user:password:role format
  const userEntries = usersStr.split(",");
  userEntries.forEach((entry) => {
    const [username, password, role] = entry.split(":");
    if (username && password && role) {
      users[username] = {
        username,
        password,
        role: (role as UserRole) || "designer",
      };
    }
  });

  return users;
};

// Check if a user has access to a specific resource
export const hasRoleAccess = (
  userRole: UserRole | undefined,
  requiredRole: UserRole
): boolean => {
  if (!userRole) return false;

  // Admin role has access to everything
  if (userRole === "admin") return true;

  // Otherwise, check if the user's role matches the required role
  return userRole === requiredRole;
};

// Map tabs to required roles
export const defaultTabRoleMap = {
  overview: ["admin"],
  domain: ["admin"],
  website: ["admin", "designer"],
  questionnaire: ["admin", "designer"],
  phases: ["admin", "designer"],
  feedback: ["admin", "designer"],
  notes: ["admin", "designer"],
  analytics: ["admin", "designer"],
};
