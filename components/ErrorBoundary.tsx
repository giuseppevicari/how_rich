'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(err: unknown): State {
    const message = err instanceof Error ? err.message : 'Something went wrong'
    return { hasError: true, message }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
          <p className="text-red-400 text-sm font-medium">Failed to render</p>
          <p className="text-zinc-500 text-xs mt-1">{this.state.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}
