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

  // Telegram Detection (مبسطة)
  const isTelegramBrowser = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();

    // Direct detection (كافية لـ 95% من الحالات)
    if (ua.includes("telegram")) return true;
    if (typeof window.Telegram !== "undefined") return true;
    if (typeof window.TelegramWebviewProxy !== "undefined") return true;

    // Fallback: feature detection للباقي
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

  // Auto-redirect if real browser
  if (!isTelegramBrowser && targetSite) {
    window.location.href = targetSite; // بدل replace باش back button يخدم
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleContinue = () => {
    // Try multiple methods
    const url = targetSite;

    // 1. Standard window.open
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");

    // 2. Android intent (after delay)
    setTimeout(() => {
      if (!newWindow || newWindow.closed) {
        window.location.href = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
      }
    }, 500);

    // 3. iOS Safari fallback
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* الزر الرئيسي */}
        <button
          onClick={handleContinue}
          aria-label="فتح الموقع في المتصفح الخارجي"
          className="main-button"
        >
          إضغط هنا للمتابعة
        </button>

        {/* Fallback text للي ما خدمش عندهم */}
        <p className="fallback-text">
          إذا لم يفتح الموقع، انقر على "⋯" أعلى الصفحة واختر "فتح في المتصفح"
        </p>
      </div>
    </div>
  );
}
