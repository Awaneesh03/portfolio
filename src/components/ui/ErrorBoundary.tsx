import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="glass rounded-2xl p-8 max-w-lg w-full text-center">
          <div className="w-14 h-14 rounded-xl bg-red-500/15 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={26} className="text-red-400" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Something went wrong</h2>
          <p className="text-gray-400 text-sm mb-4">A component crashed. Copy the error below and report it.</p>
          <pre className="bg-black/40 rounded-xl p-4 text-xs text-red-300 font-mono text-left overflow-x-auto mb-6 leading-relaxed whitespace-pre-wrap">
            {error.message}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload() }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-all text-sm"
          >
            <RefreshCw size={14} />
            Reload page
          </button>
        </div>
      </div>
    )
  }
}
