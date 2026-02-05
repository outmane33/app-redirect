import { useMemo } from "react";
import "./App.css";

export default function App() {
  // Extract query parameters from current URL
  const urlParams = new URLSearchParams(window.location.search);
  const mediaParam = urlParams.get("media"); // Get ?media=avatar-2012

  // Build target site URL with media parameter
  const baseTargetSite = import.meta.env.VITE_SITE_URL;
  const targetSite = mediaParam
    ? `${baseTargetSite}/${mediaParam}`
    : baseTargetSite;

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
    const url = targetSite;

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
    <div className="app-container">
      <div className="content-wrapper">
        <button
          onClick={handleContinue}
          style={{
            backgroundColor: "#111827",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            padding: "32px 64px",
            borderRadius: "16px",
            border: "none",
            cursor: "pointer",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#1f2937";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#111827";
            e.target.style.transform = "scale(1)";
          }}
          onMouseDown={(e) => {
            e.target.style.backgroundColor = "#000000";
            e.target.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.target.style.backgroundColor = "#1f2937";
            e.target.style.transform = "scale(1.05)";
          }}
        >
          إضغط هنا للمتابعة
        </button>
      </div>
    </div>
  );
}
