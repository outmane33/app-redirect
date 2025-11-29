import "./Spinner.css";

export default function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner-outer" />
      <div className="spinner-inner" />
      <div className="spinner-dot" />
    </div>
  );
}
