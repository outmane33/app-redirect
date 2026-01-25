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

  // Just button - nothing else
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <button
        onClick={handleContinue}
        className="bg-gray-900 hover:bg-gray-800 active:bg-black text-white text-2xl font-bold py-8 px-16 rounded-2xl transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95"
      >
        Continue
      </button>
    </div>
  );
}
