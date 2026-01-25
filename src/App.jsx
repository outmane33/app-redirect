import { useMemo } from "react";
import "./App.css";

export default function App() {
  const currentUrl = window.location.href;
  const targetSite = import.meta.env.VITE_SITE_URL;

  // Advanced detection - calculated once
  const browserType = useMemo(() => {
    const ua = navigator.userAgent;
    const standalone = window.navigator.standalone;
    const referrer = document.referrer;

    // Check 1: User Agent strings
    if (ua.includes("Telegram") || ua.includes("TelegramBot"))
      return "telegram";
    if (ua.includes("FBAN") || ua.includes("FBAV")) return "facebook";
    if (ua.includes("Instagram")) return "instagram";
    if (ua.includes("Line")) return "line";
    if (ua.includes("WhatsApp")) return "whatsapp";
    if (ua.includes("Twitter")) return "twitter";
    if (ua.includes("LinkedIn")) return "linkedin";

    // Check 2: Check if Telegram WebApp
    if (window.Telegram?.WebApp || window.TelegramWebviewProxy)
      return "telegram";

    // Check 3: Missing features in in-app browsers
    const hasServiceWorker = "serviceWorker" in navigator;
    const hasIndexedDB = "indexedDB" in window;
    const hasNotifications = "Notification" in window;

    // Check 4: Referrer check
    if (referrer && !referrer.includes(window.location.hostname)) {
      // Opened from external app
      const missingFeatures =
        !hasServiceWorker || !hasIndexedDB || !hasNotifications;
      if (missingFeatures) return "in-app";
    }

    // Check 5: CSS media query hack (some in-app browsers)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    if (standalone === false && !isStandalone) {
      // Possibly in-app browser
      if (ua.includes("Mobile") && !ua.includes("Safari/")) {
        return "in-app";
      }
    }

    // Check 6: Chrome/Safari specific checks
    const isChrome = ua.includes("Chrome") && !ua.includes("Edg");
    const isSafari = ua.includes("Safari") && !ua.includes("Chrome");
    const isFirefox = ua.includes("Firefox");
    const isEdge = ua.includes("Edg");

    if (isChrome || isSafari || isFirefox || isEdge) {
      return "real-browser";
    }

    // Default: assume in-app if mobile and unclear
    if (
      ua.includes("Mobile") ||
      ua.includes("Android") ||
      ua.includes("iPhone")
    ) {
      return "in-app";
    }

    return "real-browser";
  }, []);

  // If real browser and has target site, redirect immediately
  if (browserType === "real-browser" && targetSite) {
    window.location.replace(targetSite);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Redirecting to site...</p>
        </div>
      </div>
    );
  }

  const handleOpenInBrowser = () => {
    const url = currentUrl;

    // Try multiple methods
    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      window.location.href = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
    }, 300);

    setTimeout(() => {
      window.location.href = `googlechrome://navigate?url=${encodeURIComponent(url)}`;
    }, 600);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert(
        "✓ URL copied!\n\nNow:\n1. Open Chrome or Safari\n2. Paste this URL\n3. Press Enter",
      );
    } catch {
      prompt("Copy this URL:", currentUrl);
    }
  };

  // In-app browser detected - show warning
  const browserName =
    {
      telegram: "Telegram",
      facebook: "Facebook",
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      line: "Line",
      "in-app": "In-App",
    }[browserType] || "In-App";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
          {browserName} Browser Detected
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          This website doesn't work in {browserName}'s built-in browser. You
          need to open it in Chrome, Safari, or your default browser.
        </p>

        {/* Warning Box */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-8">
          <p className="text-sm text-red-900 font-semibold mb-2">
            🚫 Why this matters:
          </p>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Limited functionality</li>
            <li>• Features won't work properly</li>
            <li>• Security restrictions</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleOpenInBrowser}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-5 px-6 rounded-xl transition-colors duration-200 text-lg"
          >
            Open in Browser
          </button>

          <button
            onClick={handleCopy}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl transition-colors duration-200"
          >
            Copy URL
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-lg">📱</span>
            Step-by-Step:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p className="text-sm text-gray-700 pt-0.5">
                Look for the menu button{" "}
                <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">
                  ⋯
                </span>{" "}
                or{" "}
                <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">
                  ⋮
                </span>{" "}
                at the top
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p className="text-sm text-gray-700 pt-0.5">
                Tap <strong>"Open in browser"</strong>,{" "}
                <strong>"Open in Chrome"</strong>, or{" "}
                <strong>"Open externally"</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p className="text-sm text-gray-700 pt-0.5">
                If you don't see those options, use the{" "}
                <strong>"Copy URL"</strong> button above
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-3 text-center font-medium">
            URL TO OPEN:
          </p>
          <p className="text-xs text-gray-400 font-mono break-all text-center bg-gray-50 p-3 rounded-lg">
            {currentUrl}
          </p>
        </div>
      </div>
    </div>
  );
}
