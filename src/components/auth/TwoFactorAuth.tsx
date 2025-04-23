"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Mail, AlertCircle, ArrowLeft, Clock, Loader2 } from "lucide-react";

interface TwoFactorAuthProps {
  onVerify: (verified: boolean) => void;
  onCancel: () => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  onVerify,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
  const [error, setError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  // Focus on first input field on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Send code automatically on mount
    handleSendCode();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (remainingTime <= 0) {
      // Code expired
      return;
    }

    const timer = setTimeout(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [remainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSendCode = async () => {
    setError("");
    setIsSending(true);
    try {
      const response = await fetch("/api/auth/send-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // No need to send email, using env var
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      toast.success("Verification code sent to admin email");
      setRemainingTime(600); // Reset timer
    } catch (error: any) {
      console.error("Error sending 2FA code:", error);
      setError(
        error.message || "Failed to send verification code. Please try again."
      );
      toast.error("Failed to send verification code");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);

    try {
      const code = verificationCode.join("");

      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      // Set cookie to indicate 2FA is verified - already set by the server
      toast.success("Verification successful");
      onVerify(true);
    } catch (error: any) {
      setError(error.message || "Invalid verification code. Please try again.");
      toast.error(error.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    // Update the code array
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Move to next input if current one is filled
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all inputs are filled, auto-submit
    if (index === 5 && value !== "" && newCode.every((digit) => digit !== "")) {
      setTimeout(() => handleVerify(), 500);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.match(/\d/g) || [];

    if (digits.length > 0) {
      const newCode = [...verificationCode];

      // Fill inputs with pasted digits
      for (let i = 0; i < Math.min(digits.length, 6); i++) {
        newCode[i] = digits[i];
      }

      setVerificationCode(newCode);

      // Focus on appropriate input
      if (digits.length < 6) {
        inputRefs.current[digits.length]?.focus();
      } else {
        inputRefs.current[5]?.focus();
        // If all inputs are filled, auto-submit
        if (newCode.every((digit) => digit !== "")) {
          setTimeout(() => handleVerify(), 500);
        }
      }
    }
  };

  const isFormComplete = verificationCode.every((digit) => digit !== "");

  // Create ref setter function that's type-safe
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Verification Required</h1>
        <p className="text-gray-400 mt-2">
          A verification code has been sent to admin email
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-800 p-4 rounded-lg flex items-start">
          <AlertCircle className="text-red-500 h-5 w-5 mr-3 mt-0.5" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      <div className="mb-6">
        <p className="text-gray-400 text-center mb-4">Enter the 6-digit code</p>

        <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={setInputRef(index)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 bg-gray-700 border-gray-600 text-white text-center text-xl font-bold rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          ))}
        </div>

        {remainingTime > 0 && (
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>Code expires in {formatTime(remainingTime)}</span>
          </div>
        )}

        {remainingTime <= 0 && (
          <div className="flex items-center justify-center text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Code expired. Please request a new one.</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={handleVerify}
          disabled={!isFormComplete || isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </button>

        <div className="flex justify-between">
          <button
            onClick={handleSendCode}
            disabled={isSending || remainingTime > 570} // Prevent resend for first 30 seconds
            className="text-orange-500 hover:text-orange-400 disabled:text-orange-500/50 text-sm flex items-center"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Code"
            )}
          </button>

          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-300 text-sm flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
