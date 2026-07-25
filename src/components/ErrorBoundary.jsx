import { Component } from 'react';

/*
 * Keeps a failure local.
 *
 * Without one of these anywhere in the tree, a single throw — a missing WebGL
 * context, a malformed asset, a bug in one visual — unmounts everything and
 * leaves an empty #root over a near-black page. Wrapping the heavy, optional
 * parts means the worst case is one missing decoration, not a blank site.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error(`[${this.props.label ?? 'section'}] failed and was skipped:`, error, info?.componentStack);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
