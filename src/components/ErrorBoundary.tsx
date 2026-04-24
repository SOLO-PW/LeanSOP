import { Component } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            padding: 40,
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ fontSize: 24, marginBottom: 12, color: "#FF4D4F" }}>应用出现异常</h1>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 20, maxWidth: 500 }}>
            {this.state.error?.message || "发生了未知错误"}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: "8px 24px",
              fontSize: 14,
              borderRadius: 6,
              border: "none",
              background: "#1677FF",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
