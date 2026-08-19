import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

declare global {
  interface Window { hideSplash: (errMsg?: string) => void; }
}

const rootEl = document.getElementById("root")!;

function showBootError(msg: string) {
  rootEl.innerHTML = `<div style="color:#fff3d6;padding:24px;font-family:sans-serif;background:#1a0c04;min-height:100%">
    <b>Maxine no arrancó</b>
    <pre style="white-space:pre-wrap;color:#ff8fa0;font-size:12px;margin-top:12px">${msg}</pre>
    <button onclick="location.reload()" style="margin-top:12px;padding:8px 16px;background:#ffd27a;border:0;font-weight:700">Recargar</button>
  </div>`;
  try { window.hideSplash?.(); } catch { /* */ }
}

import("./App")
  .then(({ default: App }) => {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    requestAnimationFrame(() => {
      try { window.hideSplash?.(); } catch { /* */ }
    });
  })
  .catch((err: unknown) => {
    const msg = err instanceof Error ? (err.stack || err.message) : String(err);
    showBootError(msg);
  });
