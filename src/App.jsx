import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [userChoice, setUserChoice] = useState(null); // null, 'browser', 'continue'
  const [countdown, setCountdown] = useState(5);
  const targetUrl = import.meta.env.VITE_SITE_URL || "https://www.google.com";

  // Enhanced detection
  const detectBrowserType = () => {
    const ua = navigator.userAgent.toLowerCase();

    // Check for Telegram
    if (ua.includes("telegram") || window.TelegramWebviewProxy !== undefined) {
      return "telegram";
    }

    // Check for other in-app browsers
    if (ua.includes("fbav") || ua.includes("fban")) return "facebook";
    if (ua.includes("instagram")) return "instagram";
    if (ua.includes("line")) return "line";
    if (ua.includes("wechat")) return "wechat";

    // Check if likely in-app browser by looking at window features
    const isLikelyInApp =
      !window.opener &&
      window.navigator.standalone === false &&
      !/safari/i.test(ua) &&
      /mobile/i.test(ua);

    if (isLikelyInApp) return "in-app";

    return "normal";
  };

  const browserType = detectBrowserType();
  const isInAppBrowser = browserType !== "normal";

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (userChoice === "continue" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (userChoice === "continue" && countdown === 0) {
      window.location.replace(targetUrl);
    }
  }, [userChoice, countdown, targetUrl]);

  const handleOpenInBrowser = () => {
    // Try multiple methods to open in external browser

    // Method 1: Intent URL for Android
    const intentUrl = `intent://${targetUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;

    // Method 2: Create link with target blank
    const link = document.createElement("a");
    link.href = targetUrl;
    link.target = "_system"; // For some mobile browsers
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Method 3: Try intent URL (Android)
    setTimeout(() => {
      window.location.href = intentUrl;
    }, 500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(targetUrl)
      .then(() => {
        alert(
          "✓ URL copied!\n\nPaste it in:\n• Chrome\n• Safari\n• Firefox\n• Or any browser you prefer",
        );
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = targetUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("✓ URL copied!");
      });
  };

  const handleContinueAnyway = () => {
    setUserChoice("continue");
  };

  // If normal browser, redirect immediately
  if (!isInAppBrowser && userChoice === null) {
    window.location.replace(targetUrl);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Countdown screen
  if (userChoice === "continue") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full">
              <span className="text-4xl font-bold text-indigo-600">
                {countdown}
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Redirecting...
          </h2>
          <p className="text-gray-600">
            You will be redirected in {countdown} seconds
          </p>
          <button
            onClick={() => window.location.replace(targetUrl)}
            className="mt-6 text-indigo-600 hover:text-indigo-700 font-semibold underline"
          >
            Skip and redirect now
          </button>
        </div>
      </div>
    );
  }

  // Main prompt screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Warning Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-amber-100 rounded-full px-4 py-2 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold text-amber-800">
              {browserType === "telegram" && "Telegram Browser Detected"}
              {browserType === "facebook" && "Facebook Browser Detected"}
              {browserType === "instagram" && "Instagram Browser Detected"}
              {browserType === "in-app" && "In-App Browser Detected"}
            </span>
          </div>
        </div>

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
          Choose How to Continue
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          For the best experience and security, we recommend opening this page
          in your default browser.
        </p>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            📱 How to open in browser:
          </p>
          <ol className="text-sm text-blue-800 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>
                Tap the menu button{" "}
                <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">
                  ⋯
                </span>{" "}
                or{" "}
                <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">
                  ⋮
                </span>{" "}
                (usually top-right)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>
                Select <strong>"Open in browser"</strong>,{" "}
                <strong>"Open in Chrome"</strong>, or{" "}
                <strong>"Open in Safari"</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>
                Or use the <strong>"Copy URL"</strong> button below
              </span>
            </li>
          </ol>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleOpenInBrowser}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
            Open in External Browser
          </button>

          <button
            onClick={handleCopyUrl}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
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

          <button
            onClick={handleContinueAnyway}
            className="w-full bg-white hover:bg-gray-50 text-gray-600 font-medium py-3 px-4 rounded-lg transition duration-200 border border-gray-300"
          >
            Continue Here Anyway
          </button>
        </div>

        {/* URL Display */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1.5 font-semibold">
            🔗 Target URL:
          </p>
          <p className="text-sm text-gray-700 font-mono break-all leading-relaxed">
            {targetUrl}
          </p>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Some features may not work properly in in-app browsers
        </p>
      </div>
    </div>
  );
}
