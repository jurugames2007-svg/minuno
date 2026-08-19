import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

declare global {
  interface Window { hideSplash: (errMsg?: string) => void; }
}

const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
try { window.hideSplash?.(); } catch { /* */ }
