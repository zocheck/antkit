import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import { useT } from '../lib/i18n';

type Props = { children: ReactNode; title: string };
type State = { error?: Error };

/**
 * One demo throwing used to blank the whole site — React unmounts the tree on
 * an uncaught render error. Each example gets its own boundary so the rest of
 * the page survives, and the message says which demo to go fix.
 */
export class DemoBoundary extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Demo threw:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="w-full rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
        <p className="font-medium text-destructive">{this.props.title}</p>
        <p className="mt-1 font-mono text-[13px] text-muted-foreground">
          {this.state.error.message}
        </p>
      </div>
    );
  }
}

/**
 * The class component cannot read context with a hook, so the translated
 * heading is handed to it from here.
 */
export const DemoErrorBoundary = ({ children }: { children: ReactNode }) => (
  <DemoBoundary title={useT().page.demoBroken}>{children}</DemoBoundary>
);
