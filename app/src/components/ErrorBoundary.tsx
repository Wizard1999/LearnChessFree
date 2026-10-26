import { Component, type ErrorInfo, type ReactNode } from 'react'

/** A page that throws shows what happened and keeps the menu usable, instead of leaving a blank screen. */
export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, { error: Error | null; key?: string }> {
  state: { error: Error | null; key?: string } = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  static getDerivedStateFromProps(p: { resetKey?: string }, s: { error: Error | null; key?: string }) { return p.resetKey !== s.key ? { error: null, key: p.resetKey } : null }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info.componentStack) }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <main className="page">
        <h1>This page hit a problem</h1>
        <p>Your progress is safe. Try another page from the menu, or reload.</p>
        <pre className="small" style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error.stack ?? this.state.error.message).slice(0, 1200)}</pre>
        <button type="button" onClick={() => location.reload()}>Reload</button>
      </main>
    )
  }
}
