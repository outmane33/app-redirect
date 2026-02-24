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
    if (targetSite) {
      window.location.href = targetSite;
    }
  }, [targetSite]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
    </div>
  );
}
