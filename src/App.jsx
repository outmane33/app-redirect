import { useMemo } from "react";
import "./App.css";

export default function App() {
  // Extract query parameters from current URL
  const urlParams = new URLSearchParams(window.location.search);
  const mediaParam = urlParams.get("media");

  // Build target site URL with media parameter
  const baseTargetSite = import.meta.env.VITE_SITE_URL;
  const targetSite = mediaParam
    ? `${baseTargetSite}/${mediaParam}`
    : baseTargetSite;

  // Telegram Detection
  const isTelegramBrowser = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes("telegram")) return true;
    if (typeof window.Telegram !== "undefined") return true;
    if (typeof window.TelegramWebviewProxy !== "undefined") return true;

    const hasServiceWorker = "serviceWorker" in navigator;
    const hasNotifications = "Notification" in window;
    const hasPushManager = "PushManager" in window;

    const missingFeatures = [
      !hasNotifications,
      !hasPushManager,
      !hasServiceWorker,
    ].filter(Boolean).length;

    return missingFeatures >= 2;
  }, []);

  const handleContinue = () => {
    const url = targetSite;

    // 1. Try window.open first
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");

    // 2. Android intent fallback
    setTimeout(() => {
      if (!newWindow || newWindow.closed) {
        window.location.href = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
      }
    }, 500);

    // 3. Direct navigation fallback (last resort)
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* عرض الزر ديما - سواء Telegram أو لا */}
        <button
          onClick={handleContinue}
          aria-label="فتح الموقع في المتصفح الخارجي"
          className="main-button"
        >
          إضغط هنا للمتابعة
        </button>

        {/* Fallback text فقط للي في Telegram */}
        {isTelegramBrowser && (
          <p className="fallback-text">
            إذا لم يفتح الموقع، انقر على "⋯" أعلى الصفحة واختر "فتح في المتصفح"
          </p>
        )}
      </div>
    </div>
  );
}
