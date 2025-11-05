import React from 'react';
import { cn } from '@/lib/utils';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if we're offline
      const isOffline = !navigator.onLine;
      
      return (
        <div className={cn(
          "fixed inset-0 flex items-center justify-center",
          "bg-primary-dark text-white",
          "p-6 text-center"
        )}>
          <div style={{ maxWidth: '500px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {isOffline ? '📡' : '⚠️'}
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              {isOffline ? "You're Offline" : "Something Went Wrong"}
            </h1>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
              {isOffline 
                ? "The app lost connection. Please reconnect and refresh."
                : "An unexpected error occurred. Please refresh the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#06b6d4',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#0891b2'}
              onMouseOut={(e) => e.target.style.background = '#06b6d4'}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

