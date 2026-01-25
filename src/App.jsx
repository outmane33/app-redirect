import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [attempts, setAttempts] = useState(0);
  const currentUrl = window.location.href;

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    // Detect in-app browser
    const isInAppBrowser =
      ua.includes("telegram") ||
      ua.includes("fbav") ||
      ua.includes("fban") ||
      ua.includes("instagram") ||
      ua.includes("line") ||
      ua.includes("wechat") ||
      window.TelegramWebviewProxy !== undefined;

    if (!isInAppBrowser) {
      // Normal browser - just show content or redirect to your site
      const targetSite = import.meta.env.VITE_SITE_URL;
      if (targetSite && window.location.href !== targetSite) {
        window.location.replace(targetSite);
      }
      return;
    }

    // Try automatic redirect multiple times
    const tryRedirect = (attemptNum) => {
      if (attemptNum > 3) return; // Stop after 3 attempts

      const methods = [
        // Method 1: Standard window.open
        () => {
          const opened = window.open(
            currentUrl,
            "_blank",
            "noopener,noreferrer",
          );
          return !!opened;
        },

        // Method 2: Android Intent for Chrome
        () => {
          window.location.href = `googlechrome://navigate?url=${encodeURIComponent(currentUrl)}`;
          return true;
        },

        // Method 3: Generic intent
        () => {
          const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
          window.location.href = intentUrl;
          return true;
        },
      ];

      // Try each method with delay
      methods[attemptNum % methods.length]();

      setAttempts(attemptNum + 1);

      // Try again after delay
      setTimeout(() => tryRedirect(attemptNum + 1), 2000);
    };

    // Start trying after 500ms
    const timer = setTimeout(() => tryRedirect(0), 500);

    return () => clearTimeout(timer);
  }, [currentUrl]);

  const handleManualOpen = () => {
    // Try all methods when user clicks
    const currentUrl = window.location.href;

    // Method 1: Create and click link
    const link = document.createElement("a");
    link.href = currentUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Method 2: Chrome intent (Android)
    setTimeout(() => {
      window.location.href = `googlechrome://navigate?url=${encodeURIComponent(currentUrl)}`;
    }, 300);

    // Method 3: Generic browser
    setTimeout(() => {
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert(
          "✅ URL Copied!\n\n" +
            currentUrl +
            "\n\nNow:\n1. Open Chrome or Safari\n2. Paste this URL\n3. Press Enter",
        );
      })
      .catch(() => {
        prompt("Copy this URL:", currentUrl);
      });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              {attempts > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                  {attempts}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Browser Required
          </h1>

          {/* Message */}
          <p className="text-gray-300 text-center mb-6 leading-relaxed">
            This website doesn't work in Telegram's built-in browser. Please
            open it in your phone's browser.
          </p>

          {/* Status */}
          {attempts > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-6">
              <p className="text-blue-400 text-sm text-center font-medium">
                ⚡ Attempting to open... (Try #{attempts})
              </p>
            </div>
          )}

          {/* Big Action Button */}
          <button
            onClick={handleManualOpen}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl mb-4 flex items-center justify-center gap-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="text-lg">Open in Browser</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 mb-6 flex items-center justify-center gap-2"
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
            Copy URL Instead
          </button>

          {/* Instructions */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="text-lg">📱</span>
              Manual Steps:
            </p>
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span>
                  Tap the <strong className="text-white">⋯</strong> or{" "}
                  <strong className="text-white">⋮</strong> button (top-right
                  corner)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span>
                  Select{" "}
                  <strong className="text-white">"Open in browser"</strong> or{" "}
                  <strong className="text-white">"Open in Chrome"</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span>
                  Or use <strong className="text-white">"Copy URL"</strong>{" "}
                  button above
                </span>
              </li>
            </ol>
          </div>

          {/* URL Display */}
          <div className="mt-5 p-4 bg-black/40 rounded-xl border border-gray-700">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">
              Current URL:
            </p>
            <p className="text-xs text-gray-400 font-mono break-all leading-relaxed">
              {currentUrl}
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs mt-6">
          ⚠️ This page requires a full browser to function properly
        </p>
      </div>
    </div>
  );
}
