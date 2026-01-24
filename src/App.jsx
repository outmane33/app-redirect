import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [showPrompt, setShowPrompt] = useState(false);
  const currentUrl = window.location.href; // Current page URL

  useEffect(() => {
    // Detect if we're in an in-app browser
    const detectInAppBrowser = () => {
      const ua = navigator.userAgent.toLowerCase();
      const currentUrl = window.location.href;

      // Check various in-app browser indicators
      const isInApp =
        ua.includes("telegram") ||
        ua.includes("fbav") ||
        ua.includes("fban") ||
        ua.includes("instagram") ||
        ua.includes("line") ||
        ua.includes("wechat") ||
        window.TelegramWebviewProxy !== undefined ||
        // Additional check: if opened from another app
        (document.referrer &&
          !document.referrer.includes(window.location.hostname));

      return isInApp;
    };

    // Check if in-app browser
    if (detectInAppBrowser()) {
      // Show prompt instead of redirecting
      setShowPrompt(true);

      // Try to trigger external browser immediately (works on some platforms)
      const tryOpenExternal = () => {
        // Method 1: Deep link intent (Android)
        const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;

        // Create hidden link
        const link = document.createElement("a");
        link.href = currentUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.display = "none";
        document.body.appendChild(link);

        // Try to open
        link.click();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);

        // Fallback to intent URL (Android)
        setTimeout(() => {
          window.location.href = intentUrl;
        }, 300);
      };

      // Auto-try after 1 second
      setTimeout(tryOpenExternal, 1000);
    }
  }, []);

  const handleOpenInBrowser = () => {
    const currentUrl = window.location.href;

    // Method 1: Standard target="_blank"
    window.open(currentUrl, "_blank", "noopener,noreferrer");

    // Method 2: Intent URL for Android
    setTimeout(() => {
      const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intentUrl;
    }, 500);

    // Method 3: Try direct location change
    setTimeout(() => {
      window.location.href = currentUrl;
    }, 1000);
  };

  const handleCopyUrl = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert(
          "✓ URL copied!\n\n" +
            currentUrl +
            "\n\nPaste it in Chrome, Safari, or any browser",
        );
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          alert("✓ URL copied!\n\n" + currentUrl);
        } catch (err) {
          alert("Please copy this URL manually:\n\n" + currentUrl);
        }
        document.body.removeChild(textArea);
      });
  };

  // If not in-app browser, show normal content
  if (!showPrompt) {
    return (
      <div className="app-container">
        <div className="content-wrapper">
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome!
              </h1>
              <p className="text-gray-600">
                You're viewing this page in a standard browser.
              </p>
              <p className="text-sm text-gray-500 mt-4 font-mono break-all">
                {currentUrl}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show prompt for in-app browser users
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-orange-200">
        {/* Alert Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 rounded-full p-4 animate-pulse">
            <svg
              className="w-16 h-16 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
          ⚠️ In-App Browser Detected
        </h1>

        {/* Warning Message */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-orange-900 font-semibold mb-2">
            🚨 This page must be opened in a real browser!
          </p>
          <p className="text-orange-800 text-sm">
            You're currently viewing this in Telegram/Facebook's built-in
            browser. Please open it in Chrome, Safari, Firefox, or your default
            browser.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <p className="text-sm font-bold text-blue-900 mb-3">
            📱 How to open in your browser:
          </p>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-900">
                1
              </span>
              <p>
                Tap the <strong>menu button</strong>{" "}
                <span className="inline-block px-2 py-0.5 bg-blue-200 rounded font-mono">
                  ⋯
                </span>{" "}
                or{" "}
                <span className="inline-block px-2 py-0.5 bg-blue-200 rounded font-mono">
                  ⋮
                </span>{" "}
                (usually in the top-right corner)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-900">
                2
              </span>
              <p>
                Look for and tap: <strong>"Open in browser"</strong>,{" "}
                <strong>"Open in Chrome"</strong>,{" "}
                <strong>"Open in Safari"</strong>, or{" "}
                <strong>"Open externally"</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-900">
                3
              </span>
              <p>
                Or use the <strong>"Copy URL"</strong> button below and paste it
                in any browser
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleOpenInBrowser}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
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
            <span className="text-lg">Open in Real Browser</span>
          </button>

          <button
            onClick={handleCopyUrl}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-3 border-2 border-gray-300"
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
            Copy This Page URL
          </button>
        </div>

        {/* URL Display */}
        <div className="mt-6 p-4 bg-gray-100 rounded-xl border-2 border-gray-300">
          <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">
            Current Page URL:
          </p>
          <p className="text-sm text-gray-800 font-mono break-all leading-relaxed bg-white p-3 rounded border border-gray-300">
            {currentUrl}
          </p>
        </div>

        {/* Footer Warning */}
        <div className="mt-6 pt-4 border-t-2 border-gray-200">
          <p className="text-xs text-red-600 font-semibold text-center">
            ⚠️ This page will NOT work properly in this browser
          </p>
        </div>
      </div>
    </div>
  );
}
