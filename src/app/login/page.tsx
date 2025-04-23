/* eslint-disable */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { KeyRound, AlertCircle, Loader2 } from "lucide-react";
import TwoFactorAuth from "@/components/auth/TwoFactorAuth";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const router = useRouter();
  const { login, complete2FAVerification } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Attempt login with existing credentials
      const success = login(username, password);

      if (success) {
        // Show 2FA screen
        setShow2FA(true);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = (verified: boolean) => {
    if (verified) {
      // Update the auth context to indicate 2FA is verified
      complete2FAVerification();
      toast.success("Login successful");
      router.push("/dashboard");
    }
  };

  const handle2FACancel = () => {
    setShow2FA(false);
  };

  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <TwoFactorAuth onVerify={handle2FAVerify} onCancel={handle2FACancel} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Lumix Digital Admin</h1>
          <p className="text-gray-400 mt-2">
            Enter your credentials to sign in
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-800 p-4 rounded-lg flex items-start">
            <AlertCircle className="text-red-500 h-5 w-5 mr-3 mt-0.5" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter admin username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
