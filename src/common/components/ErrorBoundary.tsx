import React, { ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}


class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props)
      this.state = { hasError: false }
    }
  
    public static getDerivedStateFromError(error: Error) {
      console.log('getDerivedStateFromError', error)
      return { hasError: true }
    }
  
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.log('componentDidCatch', error, errorInfo)
      return { hasError: true }
    }
  
    public render() {
      const { hasError } = this.state
      const { children } = this.props
      return hasError ? <h1>エラーが発生しました。ページをリロードして下さい。</h1> : children
      // return hasError ? children : children
    }
  }

export default ErrorBoundary