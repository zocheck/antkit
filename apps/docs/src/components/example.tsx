import type { ReactNode } from 'react';

import { LinkIcon } from 'lucide-react';

import { useT } from '../lib/i18n';
import { CodeBlock } from './code-block';
import { DemoErrorBoundary } from './demo-boundary';
import { Prose } from './prose';

export const Example = ({
  id,
  href,
  title,
  description,
  code,
  children,
}: {
  id: string;
  /** Full route hash for this example, so the link survives hash routing. */
  href: string;
  title: string;
  description?: string;
  code: string;
  children: ReactNode;
}) => {
  const t = useT();

  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-3">
        <h3 className="group/heading flex items-center gap-2 text-md font-medium">
          {title}
          <a
            href={href}
            aria-label={t.page.linkTo(title)}
            className="text-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100"
          >
            <LinkIcon className="size-3.5" />
          </a>
        </h3>
        {!!description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            <Prose text={description} />
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex min-w-0 flex-wrap items-start gap-4 bg-background p-6">
          <DemoErrorBoundary>{children}</DemoErrorBoundary>
        </div>
        <div className="border-t border-border">
          <CodeBlock code={code} className="[&>div]:rounded-none" />
        </div>
      </div>
    </section>
  );
};
