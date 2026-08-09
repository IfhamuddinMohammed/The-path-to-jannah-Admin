import React from "react";

// There was no error boundary anywhere in this app — if any component throws during render
// (a bad response shape, a browser/WebView API the device doesn't support, anything), React
// unmounts the whole tree and the screen just goes blank white, with no indication of what
// happened. This turns that into a visible, readable error instead — and its message/stack is
// exactly what's needed to actually diagnose a "white screen" report from a real device that
// can't be reproduced in a desktop browser.
export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error rendering the app:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-lg w-full bg-white border border-red-200 rounded-lg p-6">
          <h1 className="text-lg font-semibold text-red-600 mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-600 mb-4">
            {this.state.error?.message || String(this.state.error)}
          </p>
          <pre className="text-xs text-gray-400 whitespace-pre-wrap max-h-64 overflow-auto bg-gray-50 p-3 rounded border border-gray-100">
            {this.state.error?.stack}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-md bg-emerald-800 text-white text-sm font-medium"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
