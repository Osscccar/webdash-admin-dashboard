/* eslint-disable */

"use client";

import type React from "react";
import { FileText, Edit, Save, Loader2 } from "lucide-react";

interface NotesTabProps {
  clientNotes: string;
  setClientNotes: React.Dispatch<React.SetStateAction<string>>;
  isEditingNotes: boolean;
  setIsEditingNotes: React.Dispatch<React.SetStateAction<boolean>>;
  saveClientNotes: () => Promise<void>;
  saving: boolean;
}

export const NotesTab: React.FC<NotesTabProps> = ({
  clientNotes,
  setClientNotes,
  isEditingNotes,
  setIsEditingNotes,
  saveClientNotes,
  saving,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Client Notes
        </h2>
        {!isEditingNotes ? (
          <button
            onClick={() => setIsEditingNotes(true)}
            className="flex items-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Edit Notes
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditingNotes(false)}
              className="flex items-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={saveClientNotes}
              disabled={saving}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 disabled:opacity-70 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  Save Notes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        {isEditingNotes ? (
          <textarea
            value={clientNotes}
            onChange={(e) => setClientNotes(e.target.value)}
            className="w-full h-64 p-4 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter notes about this client here..."
          />
        ) : clientNotes ? (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
              {clientNotes}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No notes have been added yet</p>
            <p className="text-sm text-gray-400 mb-4 text-center max-w-md">
              Add notes about this client to keep track of important
              information, requirements, or special requests.
            </p>
            <button
              onClick={() => setIsEditingNotes(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Add Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
