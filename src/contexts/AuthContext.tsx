// src/contexts/AuthContext.tsx
/* eslint-disable */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { set2FAVerified, is2FAVerified, clearAuth } from "@/lib/auth-utils";

interface AuthContextType {
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  loading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  complete2FAVerification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for authentication in sessionStorage
    const authStatus = sessionStorage.getItem("admin-auth");
    setIsAuthenticated(authStatus === "true");

    // Check for 2FA verification
    setIs2FAVerified(is2FAVerified());

    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Hard-coded admin credentials (in real app, use environment variables)
    const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin-auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIs2FAVerified(false);
    sessionStorage.removeItem("admin-auth");
    clearAuth(); // Clear 2FA verification
  };

  const complete2FAVerification = () => {
    setIs2FAVerified(true);
    set2FAVerified(true); // This sets the cookie
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        is2FAVerified,
        loading,
        login,
        logout,
        complete2FAVerification,
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
