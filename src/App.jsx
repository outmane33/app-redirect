import { useMemo } from "react";
import "./App.css";

export default function App() {
  const currentUrl = window.location.href;
  const targetSite = import.meta.env.VITE_SITE_URL;

  // Telegram Detection
  const isTelegramBrowser = useMemo(() => {
    const ua = navigator.userAgent;

    // Direct detection
    if (ua.toLowerCase().includes("telegram")) return true;
    if (typeof window.Telegram !== "undefined") return true;
    if (typeof window.TelegramWebviewProxy !== "undefined") return true;

    // Indirect detection - missing features
    const hasServiceWorker = "serviceWorker" in navigator;
    const hasNotifications = "Notification" in window;
    const hasPushManager = "PushManager" in window;
    const hasChrome = typeof window.chrome !== "undefined";
    const noReferrer = document.referrer === "";

    const missingFeatures = [
      !hasNotifications,
      !hasPushManager,
      !hasServiceWorker,
      ua.includes("Chrome") && !hasChrome,
      noReferrer,
    ].filter(Boolean).length;

    // If 3+ missing features, likely in-app browser
    return missingFeatures >= 3;
  }, []);

  // Auto-redirect if real browser
  if (!isTelegramBrowser && targetSite) {
    window.location.replace(targetSite);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleContinue = () => {
    const url = currentUrl;

    // Try to open in external browser
    window.open(url, "_blank", "noopener,noreferrer");

    // Android intent
    setTimeout(() => {
      window.location.href = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
    }, 300);

    // Chrome specific
    setTimeout(() => {
      window.location.href = `googlechrome://navigate?url=${encodeURIComponent(url)}`;
    }, 600);
  };

  // Simple interface
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center">
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Open in Browser
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          This website needs to open in your phone's browser to work properly.
        </p>

        {/* Big Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gray-900 hover:bg-gray-800 active:bg-black text-white text-xl font-bold py-6 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          Continue
        </button>

        {/* Small help text */}
        <p className="text-sm text-gray-500 mt-8">
          This will open the page in Chrome, Safari, or your default browser
        </p>
      </div>
    </div>
  );
}
