import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

declare global {
  interface Window { hideSplash: (errMsg?: string) => void; }
}

const rootEl = document.getElementById("root")!;
try {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  // signal ready on next frame so the splash can fade
  requestAnimationFrame(() => setTimeout(() => { try { window.hideSplash && window.hideSplash(); } catch { /* noop */ } }, 80));
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  rootEl.innerHTML = `<pre style="color:#ff8fa0;padding:16px;font-family:monospace;white-space:pre-wrap">No se pudo iniciar Maxine:\n${msg}</pre>`;
  try { window.hideSplash && window.hideSplash(msg); } catch { /* noop */ }
}
