import "./App.css";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const mediaParam = urlParams.get("media");

  const baseTargetSite = import.meta.env.VITE_SITE_URL;

  const targetSite = mediaParam
    ? `${baseTargetSite}/${mediaParam}`
    : baseTargetSite;

  const openInBrowser = () => {
    const cleanUrl = targetSite.replace(/^https?:\/\//, "");

    const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;

    window.location.href = intentUrl;

    // fallback
    setTimeout(() => {
      window.location.href = targetSite;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-4">
      <h1 className="text-xl font-bold text-center">Open in Browser</h1>

      <p className="text-gray-600 text-center max-w-sm">
        Facebook browser may not support all features. Open the site in Chrome
        or Safari for a better experience.
      </p>

      <button
        onClick={openInBrowser}
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Open Now
      </button>
    </div>
  );
}
