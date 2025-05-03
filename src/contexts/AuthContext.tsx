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
  login: (username: string, password: string) => Promise<boolean>;
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

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Call the secure server-side API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        // Successfully authenticated
        const user: User = data.user;

        setIsAuthenticated(true);
        setCurrentUser(user);
        sessionStorage.setItem("admin-auth", "true");
        sessionStorage.setItem("admin-user", JSON.stringify(user));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
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
    throw new Error("Auth must be used within an AuthProvider");
  }
  return context;
}
