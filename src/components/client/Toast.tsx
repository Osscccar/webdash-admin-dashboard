/* eslint-disable */
"use client";

import { useEffect } from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIconByType = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
  };

  const getBgColorByType = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
    }
  };

  const getTextColorByType = () => {
    switch (type) {
      case "success":
        return "text-green-700";
      case "error":
        return "text-red-700";
      case "info":
        return "text-blue-700";
      case "warning":
        return "text-amber-700";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-md border ${getBgColorByType()} animate-slide-in-right max-w-md`}
    >
      <div className="mr-3 flex-shrink-0">{getIconByType()}</div>
      <div className={`flex-1 ${getTextColorByType()}`}>{message}</div>
      <button
        onClick={onClose}
        className="ml-3 text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
