import { useEffect } from "react";
import "./App.css";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const mediaParam = urlParams.get("media");

  const baseTargetSite = import.meta.env.VITE_SITE_URL;

  const targetSite = mediaParam
    ? `${baseTargetSite}/${mediaParam}`
    : baseTargetSite;

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor;

    const isFacebookBrowser =
      ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("Instagram");

    if (isFacebookBrowser) {
      // Android Chrome Intent
      const cleanUrl = targetSite.replace(/^https?:\/\//, "");

      window.location.href = `
        intent://${cleanUrl}
        #Intent;
        scheme=https;
        package=com.android.chrome;
        end
      `.replace(/\s/g, "");
    } else {
      // Browser normal
      window.location.href = targetSite;
    }
  }, [targetSite]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>

      <p className="text-sm text-gray-600">Redirecting...</p>
    </div>
  );
}
