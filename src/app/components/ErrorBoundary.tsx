import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-black uppercase mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-8">
              An unexpected error occurred on this page. Refreshing usually fixes it.
            </p>
            <button
              onClick={() => this.setState({ error: null })}
              className="border-2 border-[#0C0C0A] px-8 py-3 font-bold hover:bg-[#0C0C0A] hover:text-white transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
