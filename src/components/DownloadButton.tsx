// Components/DownloadButton.tsx
import { useState } from "react";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  url: string;
  filename: string;
}

export const DownloadButton = ({ url, filename }: DownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Fetch the image
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      // Convert to blob
      const blob = await response.blob();

      // Create a temporary download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;

      // Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
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
