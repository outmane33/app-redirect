import { useMemo } from "react";
import "./App.css";

export default function App() {
  const currentUrl = window.location.href;
  const targetSite = import.meta.env.VITE_SITE_URL;

  // AGGRESSIVE TELEGRAM DETECTION
  const detectionResult = useMemo(() => {
    const results = {};

    // Test 1: User Agent
    const ua = navigator.userAgent;
    results.userAgent = ua;
    results.hasTelegramInUA = ua.toLowerCase().includes("telegram");

    // Test 2: Window object properties
    results.hasTelegramWebApp = typeof window.Telegram !== "undefined";
    results.hasTelegramWebView =
      typeof window.TelegramWebviewProxy !== "undefined";
    results.hasTelegramGameProxy =
      typeof window.TelegramGameProxy !== "undefined";

    // Test 3: Check for Telegram Web App API
    try {
      results.telegramWebAppData = window.Telegram?.WebApp
        ? {
            initData: !!window.Telegram.WebApp.initData,
            version: window.Telegram.WebApp.version,
            platform: window.Telegram.WebApp.platform,
          }
        : null;
    } catch (e) {
      results.telegramWebAppData = null;
    }

    // Test 4: Viewport and screen dimensions (in-app browsers have unusual ratios)
    const width = window.innerWidth;
    const height = window.innerHeight;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    results.dimensions = {
      innerWidth: width,
      innerHeight: height,
      screenWidth: screenWidth,
      screenHeight: screenHeight,
      viewportRatio: (width / height).toFixed(2),
      isFullscreen: width === screenWidth && height === screenHeight,
    };

    // Test 5: Check for missing browser features (in-app browsers lack some)
    results.features = {
      hasServiceWorker: "serviceWorker" in navigator,
      hasNotifications: "Notification" in window,
      hasPushManager: "PushManager" in window,
      hasIndexedDB: "indexedDB" in window,
      hasBeacon: "sendBeacon" in navigator,
      hasShare: "share" in navigator,
      hasWebGL: (() => {
        try {
          const canvas = document.createElement("canvas");
          return !!(
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl")
          );
        } catch (e) {
          return false;
        }
      })(),
    };

    // Test 6: Check navigation properties
    results.navigation = {
      referrer: document.referrer,
      standalone: window.navigator.standalone,
      displayMode: window.matchMedia("(display-mode: standalone)").matches
        ? "standalone"
        : "browser",
    };

    // Test 7: Check for specific CSS media queries
    results.mediaQueries = {
      isStandalone: window.matchMedia("(display-mode: standalone)").matches,
      isFullscreen: window.matchMedia("(display-mode: fullscreen)").matches,
      isMinimalUI: window.matchMedia("(display-mode: minimal-ui)").matches,
    };

    // Test 8: Touch and pointer capabilities
    results.interaction = {
      maxTouchPoints: navigator.maxTouchPoints,
      hasTouch: "ontouchstart" in window,
      pointerType: window.PointerEvent ? "supported" : "not-supported",
    };

    // Test 9: Window.chrome and other browser-specific objects
    results.browserObjects = {
      hasChrome: typeof window.chrome !== "undefined",
      hasSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
      hasOpera:
        typeof window.opr !== "undefined" ||
        typeof window.opera !== "undefined",
      hasEdge: /Edg/.test(ua),
    };

    // Test 10: Performance and timing APIs
    results.performance = {
      hasPerformanceAPI: "performance" in window,
      hasNavigationTiming: "navigation" in window.performance,
      hasResourceTiming: "getEntriesByType" in window.performance,
    };

    // Test 11: Check document properties
    results.document = {
      hasVisibilityAPI: "hidden" in document,
      hasPictureInPicture: "pictureInPictureEnabled" in document,
      hasFullscreen: "fullscreenEnabled" in document,
    };

    // Test 12: Network information
    results.network = {
      hasConnection: "connection" in navigator,
      connectionType: navigator.connection?.effectiveType || "unknown",
    };

    // FINAL DETECTION LOGIC
    let isTelegram = false;
    let confidence = 0;
    let reasons = [];

    // Direct Telegram indicators (100% confidence)
    if (results.hasTelegramInUA) {
      isTelegram = true;
      confidence = 100;
      reasons.push("Telegram found in User Agent");
    }
    if (results.hasTelegramWebApp) {
      isTelegram = true;
      confidence = 100;
      reasons.push("Telegram WebApp API detected");
    }
    if (results.hasTelegramWebView) {
      isTelegram = true;
      confidence = 100;
      reasons.push("Telegram WebView Proxy detected");
    }

    // Indirect indicators (accumulate confidence)
    if (!results.features.hasServiceWorker) {
      confidence += 15;
      reasons.push("Missing Service Worker support");
    }
    if (!results.features.hasNotifications) {
      confidence += 10;
      reasons.push("Missing Notifications API");
    }
    if (!results.features.hasPushManager) {
      confidence += 10;
      reasons.push("Missing Push Manager");
    }
    if (!results.features.hasBeacon) {
      confidence += 5;
      reasons.push("Missing Beacon API");
    }
    if (!results.browserObjects.hasChrome && ua.includes("Chrome")) {
      confidence += 20;
      reasons.push("Claims Chrome but missing chrome object");
    }
    if (results.dimensions.isFullscreen === false && ua.includes("Mobile")) {
      confidence += 10;
      reasons.push("Mobile but not fullscreen (embedded browser)");
    }
    if (results.navigation.referrer === "") {
      confidence += 5;
      reasons.push("No referrer (opened from app)");
    }

    // If confidence > 50%, likely in-app browser
    if (confidence >= 50 && !isTelegram) {
      isTelegram = true;
      reasons.push("High confidence based on missing features");
    }

    return {
      isTelegram,
      confidence,
      reasons,
      allTests: results,
    };
  }, []);

  // Auto-redirect if real browser
  if (!detectionResult.isTelegram && targetSite) {
    window.location.replace(targetSite);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleOpenInBrowser = () => {
    window.open(currentUrl, "_blank");
    setTimeout(() => {
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
    }, 300);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("✓ URL copied!");
    } catch {
      prompt("Copy this URL:", currentUrl);
    }
  };

  // Show Telegram warning
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Detection Badge */}
        <div className="mb-6 bg-red-100 border-2 border-red-300 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-red-900">In-App Browser Detected</p>
              <p className="text-sm text-red-800">
                Confidence: {detectionResult.confidence}%
              </p>
            </div>
          </div>
          {detectionResult.reasons.length > 0 && (
            <div className="mt-3 bg-red-50 rounded p-3">
              <p className="text-xs font-semibold text-red-900 mb-2">
                Detection reasons:
              </p>
              <ul className="text-xs text-red-800 space-y-1">
                {detectionResult.reasons.map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
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

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Open in Real Browser
          </h1>

          <p className="text-gray-600 text-center mb-6">
            This site requires a full browser. Please open in Chrome, Safari, or
            your default browser.
          </p>

          <div className="space-y-3 mb-6">
            <button
              onClick={handleOpenInBrowser}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              Open in Browser
            </button>
            <button
              onClick={handleCopy}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl transition-colors"
            >
              Copy URL
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Manual steps:
            </p>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Tap menu (⋯ or ⋮) at top</li>
              <li>2. Select "Open in browser"</li>
              <li>3. Choose your browser</li>
            </ol>
          </div>
        </div>

        {/* Full Debug Info */}
        <details className="mt-6 bg-gray-900 text-white rounded-xl p-4">
          <summary className="font-bold cursor-pointer mb-3">
            🔧 Full Detection Data (Developer)
          </summary>
          <div className="space-y-4 text-xs">
            <div>
              <p className="font-semibold text-yellow-400 mb-1">User Agent:</p>
              <p className="font-mono break-all bg-black p-2 rounded">
                {detectionResult.allTests.userAgent}
              </p>
            </div>

            <div>
              <p className="font-semibold text-yellow-400 mb-1">
                Telegram APIs:
              </p>
              <pre className="bg-black p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    hasTelegramWebApp:
                      detectionResult.allTests.hasTelegramWebApp,
                    hasTelegramWebView:
                      detectionResult.allTests.hasTelegramWebView,
                    telegramWebAppData:
                      detectionResult.allTests.telegramWebAppData,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            <div>
              <p className="font-semibold text-yellow-400 mb-1">Dimensions:</p>
              <pre className="bg-black p-2 rounded overflow-auto">
                {JSON.stringify(detectionResult.allTests.dimensions, null, 2)}
              </pre>
            </div>

            <div>
              <p className="font-semibold text-yellow-400 mb-1">Features:</p>
              <pre className="bg-black p-2 rounded overflow-auto">
                {JSON.stringify(detectionResult.allTests.features, null, 2)}
              </pre>
            </div>

            <div>
              <p className="font-semibold text-yellow-400 mb-1">
                Browser Objects:
              </p>
              <pre className="bg-black p-2 rounded overflow-auto">
                {JSON.stringify(
                  detectionResult.allTests.browserObjects,
                  null,
                  2,
                )}
              </pre>
            </div>

            <div>
              <p className="font-semibold text-yellow-400 mb-1">All Tests:</p>
              <pre className="bg-black p-2 rounded overflow-auto text-[10px]">
                {JSON.stringify(detectionResult.allTests, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
