import { useEffect } from "react";
import "./App.css";

export default function App() {
  useEffect(() => {
    const currentUrl = window.location.href;
    const ua = navigator.userAgent.toLowerCase();

    // Detect Telegram or other in-app browsers
    const isInAppBrowser =
      ua.includes("telegram") ||
      ua.includes("fbav") ||
      ua.includes("fban") ||
      ua.includes("instagram") ||
      ua.includes("line") ||
      ua.includes("wechat") ||
      window.TelegramWebviewProxy !== undefined;

    if (isInAppBrowser) {
      // For Android - Open in external browser using Intent
      const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`;

      // Try to open in external browser
      window.location.href = intentUrl;

      // Fallback: If intent doesn't work, try normal redirect
      setTimeout(() => {
        window.location.replace(currentUrl);
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Opening in Browser...
        </h1>

        <p className="text-gray-600 mb-6">
          Please wait while we redirect you to your default browser
        </p>

        {/* Manual Instructions (in case auto-redirect fails) */}
        <div className="bg-blue-50 rounded-lg p-4 text-left">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            If the page doesn't open automatically:
          </p>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Tap the menu button (⋯ or ⋮)</li>
            <li>Select "Open in browser" or "Open in Chrome"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
