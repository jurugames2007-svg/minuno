import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { err: string | null }

export default class ErrorBound extends Component<Props, State> {
  state: State = { err: null };

  static getDerivedStateFromError(e: Error): State {
    return { err: e.message || String(e) };
  }

  componentDidCatch(e: Error, info: ErrorInfo) {
    console.error(e, info.componentStack);
    try { window.hideSplash?.(); } catch { /* */ }
  }

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="absolute inset-0 z-[80] flex flex-col items-center justify-center p-4" style={{ background: "#1a0c04" }}>
        <div className="font-display font-bold text-amber-50 text-[18px] mb-2">Se trabó Maxine</div>
        <p className="font-display text-[12px] text-amber-200/80 text-center mb-3">{this.state.err}</p>
        <button
          className="font-display font-bold px-4 py-2"
          style={{ background: "#ffd27a", color: "#3a1808" }}
          onClick={() => { this.setState({ err: null }); window.location.reload(); }}
        >Recargar</button>
      </div>
    );
  }
}
