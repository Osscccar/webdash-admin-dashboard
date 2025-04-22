/* eslint-disable */
"use client";

import type React from "react";
import { useState } from "react";
import { Code, Globe, Layers, ExternalLink, Loader2 } from "lucide-react";
import type { UserData } from "@/types";
import Image from "next/image";

interface WebsiteTabProps {
  userData: UserData;
  activeSubTab: string;
  updateUserField: (
    fieldName: string,
    value: any,
    successMessage: string
  ) => Promise<void>;
}

export const WebsiteTab: React.FC<WebsiteTabProps> = ({
  userData,
  activeSubTab,
  updateUserField,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateField = async (
    fieldName: string,
    inputId: string,
    successMessage: string
  ) => {
    setIsUpdating(true);
    const input = document.getElementById(inputId) as HTMLInputElement;
    const url = input.value.trim();

    try {
      await updateUserField(fieldName, url || null, successMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          {activeSubTab === "preview" && (
            <Code className="h-5 w-5 mr-2 text-blue-600" />
          )}
          {activeSubTab === "liveUrl" && (
            <Globe className="h-5 w-5 mr-2 text-blue-600" />
          )}
          {activeSubTab === "editor" && (
            <Code className="h-5 w-5 mr-2 text-blue-600" />
          )}
          {activeSubTab === "revisions" && (
            <Layers className="h-5 w-5 mr-2 text-blue-600" />
          )}
          {activeSubTab === "preview" && "Website Preview Image"}
          {activeSubTab === "liveUrl" && "Live Website URL"}
          {activeSubTab === "editor" && "Content Editor URL"}
          {activeSubTab === "revisions" && "Revisions Editor URL"}
        </h2>
      </div>

      {/* Website Preview Management */}
      {activeSubTab === "preview" && (
        <div className="space-y-6">
          {/* Current preview */}
          {userData.websitePreviewUrl ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Current Website Preview
              </p>
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={userData.websitePreviewUrl || "/placeholder.svg"}
                  alt="Website Preview"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  layout="responsive"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Code className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  No website preview image set
                </p>
                <p className="text-sm text-gray-500 max-w-md text-center">
                  Add a preview image to show the client what their website will
                  look like before it's published.
                </p>
              </div>
            </div>
          )}

          {/* Update preview URL */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Update Website Preview URL
            </p>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter image URL"
                defaultValue={userData.websitePreviewUrl || ""}
                className="flex-1 bg-white border border-gray-300 rounded-l-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="website-preview-url"
              />
              <button
                onClick={() =>
                  handleUpdateField(
                    "websitePreviewUrl",
                    "website-preview-url",
                    "Website preview image updated successfully"
                  )
                }
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 disabled:opacity-70 cursor-pointer flex items-center"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Paste a direct link to an image file (JPG, PNG, WEBP). The image
              should be at least 1200x800 pixels.
            </p>
          </div>

          {/* Remove preview */}
          {userData.websitePreviewUrl && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Remove Preview Image
              </p>
              <button
                onClick={() =>
                  updateUserField(
                    "websitePreviewUrl",
                    null,
                    "Website preview image removed"
                  )
                }
                className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Remove Preview Image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Website URL Management */}
      {activeSubTab === "liveUrl" && (
        <div className="space-y-6">
          {/* Current website URL */}
          {userData.websiteUrl ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Current Live Website URL
              </p>
              <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <a
                  href={
                    userData.websiteUrl.startsWith("http")
                      ? userData.websiteUrl
                      : `https://${userData.websiteUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex-1"
                >
                  {userData.websiteUrl}
                </a>
                <ExternalLink className="h-4 w-4 text-gray-400 ml-2" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  No website URL has been set
                </p>
                <p className="text-sm text-gray-500 max-w-md text-center">
                  Add the live website URL when the client's website is
                  published and ready to be viewed.
                </p>
              </div>
            </div>
          )}

          {/* Update website URL */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Update Live Website URL
            </p>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter website URL (e.g., example.com)"
                defaultValue={userData.websiteUrl || ""}
                className="flex-1 bg-white border border-gray-300 rounded-l-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="website-url"
              />
              <button
                onClick={() =>
                  handleUpdateField(
                    "websiteUrl",
                    "website-url",
                    "Website URL updated successfully"
                  )
                }
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 disabled:opacity-70 cursor-pointer flex items-center"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter the full URL of the customer's live website. It will be
              displayed in their dashboard.
            </p>
          </div>

          {/* Remove website URL */}
          {userData.websiteUrl && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Remove Website URL
              </p>
              <button
                onClick={() =>
                  updateUserField("websiteUrl", null, "Website URL removed")
                }
                className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Remove Website URL
              </button>
            </div>
          )}
        </div>
      )}

      {/* Editor URL Management */}
      {activeSubTab === "editor" && (
        <div className="space-y-6">
          {/* Current editor URL */}
          {userData.editorUrl ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Current Content Editor URL
              </p>
              <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Code className="h-5 w-5 text-blue-600" />
                </div>
                <a
                  href={
                    userData.editorUrl.startsWith("http")
                      ? userData.editorUrl
                      : `https://${userData.editorUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex-1"
                >
                  {userData.editorUrl}
                </a>
                <ExternalLink className="h-4 w-4 text-gray-400 ml-2" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Code className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  No editor URL has been set
                </p>
                <p className="text-sm text-gray-500 max-w-md text-center">
                  Add the editor URL to allow the client to make changes to
                  their website content.
                </p>
              </div>
            </div>
          )}

          {/* Update editor URL */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Update Editor URL
            </p>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter editor URL (e.g., editor.example.com)"
                defaultValue={userData.editorUrl || ""}
                className="flex-1 bg-white border border-gray-300 rounded-l-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="editor-url"
              />
              <button
                onClick={() =>
                  handleUpdateField(
                    "editorUrl",
                    "editor-url",
                    "Editor URL updated successfully"
                  )
                }
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 disabled:opacity-70 cursor-pointer flex items-center"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter the URL where the client can access their content management
              system.
            </p>
          </div>

          {/* Remove editor URL */}
          {userData.editorUrl && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Remove Editor URL
              </p>
              <button
                onClick={() =>
                  updateUserField("editorUrl", null, "Editor URL removed")
                }
                className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Remove Editor URL
              </button>
            </div>
          )}
        </div>
      )}

      {/* Revisions URL Management */}
      {activeSubTab === "revisions" && (
        <div className="space-y-6">
          {/* Current revisions URL */}
          {userData.revisionsUrl ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Current Revisions URL
              </p>
              <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Layers className="h-5 w-5 text-blue-600" />
                </div>
                <a
                  href={
                    userData.revisionsUrl.startsWith("http")
                      ? userData.revisionsUrl
                      : `https://${userData.revisionsUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex-1"
                >
                  {userData.revisionsUrl}
                </a>
                <ExternalLink className="h-4 w-4 text-gray-400 ml-2" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Layers className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  No revisions URL has been set
                </p>
                <p className="text-sm text-gray-500 max-w-md text-center">
                  Add the revisions URL to allow the client to request changes
                  to their website.
                </p>
              </div>
            </div>
          )}

          {/* Update revisions URL */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Update Revisions URL
            </p>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter revisions URL (e.g., revisions.example.com)"
                defaultValue={userData.revisionsUrl || ""}
                className="flex-1 bg-white border border-gray-300 rounded-l-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="revisions-url"
              />
              <button
                onClick={() =>
                  handleUpdateField(
                    "revisionsUrl",
                    "revisions-url",
                    "Revisions URL updated successfully"
                  )
                }
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 disabled:opacity-70 cursor-pointer flex items-center"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter the URL where the client can request and track revisions.
            </p>
          </div>

          {/* Remove revisions URL */}
          {userData.revisionsUrl && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Remove Revisions URL
              </p>
              <button
                onClick={() =>
                  updateUserField("revisionsUrl", null, "Revisions URL removed")
                }
                className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Remove Revisions URL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
