import { useEffect } from "react";
import "./App.css";

export default function App() {
  useEffect(() => {
    const currentUrl = window.location.href;
    const ua = navigator.userAgent.toLowerCase();

    // Detect in-app browsers
    const isInAppBrowser =
      ua.includes("telegram") ||
      ua.includes("fbav") ||
      ua.includes("fban") ||
      ua.includes("instagram") ||
      window.TelegramWebviewProxy !== undefined;

    if (!isInAppBrowser) {
      // Redirect to main site if in normal browser
      const targetSite = import.meta.env.VITE_SITE_URL;
      if (targetSite) {
        window.location.replace(targetSite);
      }
      return;
    }

    // Auto-redirect attempts for in-app browsers
    const redirect = () => {
      // Try opening in external browser
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
    };

    // Try after 1 second
    const timer = setTimeout(redirect, 1000);
    return () => clearTimeout(timer);
  }, []);

  const currentUrl = window.location.href;

  const handleOpen = () => {
    // Multiple redirect methods
    const url = currentUrl;

    // Method 1: Window open
    window.open(url, "_blank");

    // Method 2: Android intent
    setTimeout(() => {
      window.location.href = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
    }, 200);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("URL copied to clipboard");
    } catch (err) {
      prompt("Copy this URL:", currentUrl);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
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
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Open in Browser
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          This site requires a full browser. Please open this page in Chrome,
          Safari, or your default browser.
        </p>

        {/* Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleOpen}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            Open in Browser
          </button>

          <button
            onClick={handleCopy}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            Copy URL
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            How to open manually:
          </p>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1. Tap the menu (⋯) in the top corner</li>
            <li>2. Select "Open in browser"</li>
            <li>3. Choose your preferred browser</li>
          </ol>
        </div>

        {/* URL */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2 font-medium">Current URL</p>
          <p className="text-xs text-gray-400 font-mono break-all">
            {currentUrl}
          </p>
        </div>
      </div>
    </div>
  );
}
