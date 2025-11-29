import { useDevToolsProtection } from "./hooks/useDevToolsProtection";

export default function App() {
  const redirectUrl = import.meta.env.VITE_SITE_URL;
  useDevToolsProtection(redirectUrl);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        color: "#333",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>Welcome</h1>
    </div>
  );
}
