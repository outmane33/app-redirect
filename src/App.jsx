import "./App.css";
import { useDevToolsProtection } from "./hooks/useDevToolsProtection";
import Spinner from "./components/Spinner";

export default function App() {
  const redirectUrl = import.meta.env.VITE_SITE_URL;
  useDevToolsProtection(redirectUrl);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <Spinner />
      </div>
    </div>
  );
}
