/* eslint-disable */
"use client";

import type React from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "info" | "success" | "danger";
}

export const ConfirmationModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  if (!isOpen) return null;

  const getIconByType = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-12 w-12 text-amber-500" />;
      case "info":
        return <Info className="h-12 w-12 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "danger":
        return <AlertCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getButtonColorByType = () => {
    switch (type) {
      case "warning":
        return "bg-amber-600 hover:bg-amber-700";
      case "info":
        return "bg-blue-600 hover:bg-blue-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "danger":
        return "bg-red-600 hover:bg-red-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center mb-6">
          {getIconByType()}
          <h3 className="text-xl font-semibold mt-4 text-gray-800">{title}</h3>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg text-white ${getButtonColorByType()} transition-colors duration-200 cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
