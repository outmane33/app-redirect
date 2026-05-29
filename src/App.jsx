import "./App.css";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const mediaParam = urlParams.get("media");

  const baseTargetSite = import.meta.env.VITE_SITE_URL;

  const targetSite = mediaParam
    ? `${baseTargetSite}/${mediaParam}`
    : baseTargetSite;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetSite);
      alert("Link copied! Now open it in Chrome or Safari.");
    } catch (err) {
      alert("Copy failed, please copy manually: " + targetSite);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center gap-5">
      <h1 className="text-2xl font-bold">Open in Browser</h1>

      <p className="text-gray-600 max-w-sm">
        Facebook browser may not support this page properly. Please open it in
        your external browser.
      </p>

      <button
        onClick={copyLink}
        className="bg-black text-white px-6 py-3 rounded-xl w-64"
      >
        Copy Link
      </button>

      <div className="bg-gray-100 p-4 rounded-xl w-full max-w-sm text-left">
        <p className="font-semibold mb-2">How to open:</p>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>Tap ⋮ (top right corner)</li>
          <li>Choose "Open in browser"</li>
          <li>Paste the link if needed</li>
        </ol>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        If nothing works, copy the link above manually.
      </p>
    </div>
  );
}
