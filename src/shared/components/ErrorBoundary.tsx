import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="error-boundary-banner" role="alert">
          <div className="error-boundary-content">
            <span className="error-icon" aria-hidden="true">
              ⚠️
            </span>
            <h3 className="error-title">حدث خطأ غير متوقع أثناء تحميل الصفحة</h3>
            <p className="error-description">
              {this.state.error.message || 'تعذر استكمال العملية بنجاح. يرجى إعادة المحاولة.'}
            </p>
            <button
              type="button"
              className="try-again-btn"
              onClick={this.handleReset}
              aria-label="إعادة محاولة تحميل الصفحة"
            >
              إعادة المحاولة (Try again)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
