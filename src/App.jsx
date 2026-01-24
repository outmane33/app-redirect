import { useEffect } from "react";
import "./App.css";

export default function App() {
  const targetUrl = import.meta.env.VITE_SITE_URL || "https://www.google.com";

  // Detect Telegram in-app browser
  const isTelegramBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    return (
      ua.includes("telegram") ||
      window.TelegramWebviewProxy !== undefined ||
      ua.includes("tgwebapp")
    );
  };

  // Detect other in-app browsers
  const isInAppBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    return (
      ua.includes("fbav") || // Facebook
      ua.includes("fban") || // Facebook
      ua.includes("instagram") ||
      ua.includes("line") ||
      ua.includes("wechat") ||
      ua.includes("snapchat") ||
      isTelegramBrowser()
    );
  };

  // Calculate showPrompt outside of useEffect
  const showPrompt = isInAppBrowser();

  useEffect(() => {
    if (showPrompt) {
      // Try automatic redirect (works on some platforms)
      setTimeout(() => {
        // Intent URL for Android
        const intentUrl = `intent://${targetUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;

        // Try to open in external browser
        window.location.href = targetUrl;

        // Fallback for Android
        setTimeout(() => {
          window.location.href = intentUrl;
        }, 500);
      }, 2000);
    } else {
      // Normal browser, redirect directly
      window.location.replace(targetUrl);
    }
  }, [targetUrl]);

  const handleOpenInBrowser = () => {
    // Create a link that forces external browser
    const link = document.createElement("a");
    link.href = targetUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl).then(() => {
      alert("✓ URL copied! Paste it in your browser");
    });
  };

  if (!showPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 rounded-full p-4">
            <svg
              className="w-12 h-12 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Open in Browser
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          For the best experience, please open this page in your default browser
          (Chrome, Safari, etc.)
        </p>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            How to open:
          </p>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Tap the "⋯" menu button (top right)</li>
            <li>Select "Open in browser" or "Open in Chrome"</li>
            <li>Or copy the URL and paste in your browser</li>
          </ol>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleOpenInBrowser}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open in Browser
          </button>

          <button
            onClick={handleCopyUrl}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy URL
          </button>
        </div>

        {/* URL Display */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Target URL:</p>
          <p className="text-sm text-gray-700 font-mono break-all">
            {targetUrl}
          </p>
        </div>
      </div>
    </div>
  );
}
