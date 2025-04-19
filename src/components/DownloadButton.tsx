// src/components/DownloadButton.tsx
import { useState } from "react";
import { Download } from "lucide-react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface DownloadButtonProps {
  url: string;
  filename: string;
}

export const DownloadButton = ({ url, filename }: DownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Extract the storage path from the URL
      // This assumes your URL is a Firebase Storage URL
      let downloadUrl = url;

      // If the URL contains a Firebase Storage token, get a fresh URL
      if (url.includes("firebase") && url.includes("token=")) {
        try {
          // Get the path part of the URL (everything after /o/ and before ?)
          const pathRegex = /\/o\/([^?]+)/;
          const match = url.match(pathRegex);

          if (match && match[1]) {
            const path = decodeURIComponent(match[1]);
            const storage = getStorage();
            const storageRef = ref(storage, path);

            // Generate a fresh download URL
            downloadUrl = await getDownloadURL(storageRef);
          }
        } catch (storageError) {
          console.error("Error getting fresh download URL", storageError);
          // Continue with original URL if failed
        }
      }

      // Use a proxy approach to avoid CORS issues
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        mode: "cors", // Try different modes if this fails: 'cors', 'no-cors', etc.
      });

      if (!response.ok) {
        throw new Error(
          `Failed to download file: ${response.status} ${response.statusText}`
        );
      }

      // Convert to blob
      const blob = await response.blob();

      // Create a temporary download link
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;

      // Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(objectUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try copying the URL instead.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
      aria-label="Download file"
      title="Download file"
    >
      {isDownloading ? (
        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </button>
  );
};
