"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  username: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  check2FAStatus: () => boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  isAuthenticated: false,
  is2FAVerified: false,
  check2FAStatus: () => false,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [is2FAVerified, setIs2FAVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount
  useEffect(() => {
    // Check for authentication cookie
    const authToken = getCookie("auth_token");
    const twoFAVerified = getCookie("2fa_verified") === "true";

    if (authToken) {
      // Set user from cookie or local storage
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    setIs2FAVerified(twoFAVerified);
    setLoading(false);

    // Redirect logic
    if (!authToken && pathname !== "/login") {
      router.push("/login");
    } else if (authToken && !twoFAVerified && pathname !== "/login") {
      router.push("/login?require2fa=true");
    }
  }, [pathname, router]);

  // Login function
  const login = (username: string, password: string): boolean => {
    // Replace with your actual authentication logic
    // In a real app, you would call an API to validate credentials
    const validCredentials = username === "admin" && password === "lumix123";

    if (validCredentials) {
      const userData = { username, isAdmin: true };

      // Store user data in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData));

      // Set auth cookie
      document.cookie = `auth_token=true; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

      setUser(userData);
      return true;
    }

    return false;
  };

  // Logout function
  const logout = () => {
    // Clear user data
    setUser(null);
    localStorage.removeItem("user");

    // Clear cookies
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "2fa_verified=; path=/; max-age=0";

    // Redirect to login
    router.push("/login");
  };

  // Check 2FA status
  const check2FAStatus = () => {
    const twoFAVerified = getCookie("2fa_verified") === "true";
    setIs2FAVerified(twoFAVerified);
    return twoFAVerified;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        is2FAVerified,
        check2FAStatus,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Helper function to get cookie by name
function getCookie(name: string): string | undefined {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return undefined;
}
