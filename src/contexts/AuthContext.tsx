// src/contexts/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the user type with role
interface User {
  username: string;
  role: string;
}

// Define tab role mapping type
type TabType =
  | "overview"
  | "domain"
  | "website"
  | "questionnaire"
  | "phases"
  | "feedback"
  | "notes"
  | "analytics";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasAccess: (requiredRole: string) => boolean;
  // Add tabRoleMap property to the interface
  tabRoleMap: Record<string, string[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the tab role mapping
const tabRoleMap: Record<string, string[]> = {
  overview: ["admin", "designer"],
  domain: ["admin"], // Only admins can access domain tab
  website: ["admin", "designer"],
  questionnaire: ["admin", "designer"],
  phases: ["admin", "designer"],
  feedback: ["admin", "designer"],
  notes: ["admin", "designer"],
  analytics: ["admin", "designer"],
};

// Parse users from environment variable
const parseAdminUsers = (): Record<
  string,
  { password: string; role: string }
> => {
  const usersStr = process.env.NEXT_PUBLIC_ADMIN_USERS || "";
  const users: Record<string, { password: string; role: string }> = {};

  // If not using new format, fall back to old credentials
  if (!usersStr) {
    const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (validUsername && validPassword) {
      users[validUsername] = { password: validPassword, role: "admin" };
    }
    return users;
  }

  // Parse user:password:role format
  const userEntries = usersStr.split(",");
  userEntries.forEach((entry) => {
    const [username, password, role] = entry.split(":");
    if (username && password && role) {
      users[username] = { password, role };
    }
  });

  return users;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for authentication in sessionStorage
    const authStatus = sessionStorage.getItem("admin-auth");
    const storedUser = sessionStorage.getItem("admin-user");

    if (authStatus === "true" && storedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = parseAdminUsers();

    // Check if the provided username exists and the password matches
    if (users[username] && users[username].password === password) {
      const user: User = {
        username,
        role: users[username].role,
      };

      setIsAuthenticated(true);
      setCurrentUser(user);
      sessionStorage.setItem("admin-auth", "true");
      sessionStorage.setItem("admin-user", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem("admin-auth");
    sessionStorage.removeItem("admin-user");
  };

  // Check if the current user has the required role
  // 'admin' role has access to everything
  const hasAccess = (requiredRole: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true;
    return currentUser.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        currentUser,
        login,
        logout,
        hasAccess,
        // Include tabRoleMap in the context value
        tabRoleMap,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
