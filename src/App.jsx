import { useMemo, useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [showInstructions, setShowInstructions] = useState(false);

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

  // Auto-redirect inside useEffect
  useEffect(() => {
    if (!isTelegramBrowser && targetSite) {
      window.location.href = targetSite;
    }
  }, [isTelegramBrowser, targetSite]);

  const handleContinue = () => {
    const url = targetSite;

    // Android: يفتح popup لاختيار المتصفح
    if (/android/i.test(navigator.userAgent)) {
      window.location.href = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
    } else {
      // iOS/Desktop: window.open
      window.open(url, "_blank", "noopener,noreferrer");
    }

    // بعد 2 ثانية، نعرض التعليمات إذا المستخدم لسا موجود
    setTimeout(() => {
      setShowInstructions(true);
    }, 2000);
  };

  // Loading state during redirect
  if (!isTelegramBrowser && targetSite) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {!showInstructions ? (
          // الزر الأولي
          <div className="button-section">
            <button
              onClick={handleContinue}
              aria-label="فتح الموقع في المتصفح الخارجي"
              className="main-button"
            >
              اضغط هنا للمتابعة
            </button>
            <p className="hint-text">انقر للوصول إلى المحتوى</p>
          </div>
        ) : (
          // التعليمات بعد الضغط
          <div className="instructions-section">
            <div className="alert-box">
              <span className="alert-icon">⚠️</span>
              <p className="alert-text">
                لم يتم فتح الرابط؟ اتبع الخطوات التالية:
              </p>
            </div>

            <p className="instruction-title">كيفية فتح الموقع في المتصفح:</p>

            {/* الصور التوضيحية */}
            <div className="tutorial-images">
              <div className="tutorial-step">
                <img
                  src="/step1.jpg"
                  alt="الخطوة الأولى: اضغط على النقاط الثلاث"
                  className="tutorial-image"
                />
                <p className="step-description">1️⃣ اضغط على "⋯" أعلى الصفحة</p>
              </div>

              <div className="tutorial-step">
                <img
                  src="/step2.jpg"
                  alt="الخطوة الثانية: اختر فتح في المتصفح"
                  className="tutorial-image"
                />
                <p className="step-description">
                  2️⃣ اختر "فتح في المتصفح" أو "Open in Browser"
                </p>
              </div>
            </div>

            <div className="info-box">
              <p className="info-text">
                📱 بعد فتح الرابط في المتصفح، سيعمل الموقع بشكل طبيعي
              </p>
            </div>

            {/* زر إعادة المحاولة */}
            <button onClick={handleContinue} className="retry-button">
              إعادة المحاولة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
