// src/components/DownloadButton.tsx
import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

interface DownloadButtonProps {
  url: string;
  filename: string;
}

export const DownloadButton = ({ url, filename }: DownloadButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error copying URL:", error);
      alert("Failed to copy URL to clipboard");
    }
  };

  const handleOpenInNewTab = () => {
    window.open(url, "_blank");
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleCopyUrl}
        className="p-1.5 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition-colors"
        aria-label="Copy URL"
        title="Copy URL"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>

      <button
        onClick={handleOpenInNewTab}
        className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
        aria-label="Open in new tab"
        title="Open in new tab"
      >
        <ExternalLink className="h-4 w-4" />
      </button>
    </div>
  );
};
