import { useState } from 'react';

import { Button, Tooltip } from '@antkit/react';
import { CheckIcon, ChevronDownIcon, CopyIcon } from 'lucide-react';

import { highlight } from '../lib/highlight';
import { useT } from '../lib/i18n';

/** Past this many lines a snippet is collapsed behind a "show more" fade. */
const COLLAPSE_AT = 20;

export const CodeBlock = ({
  code,
  collapsible = true,
  wrap = false,
  className,
}: {
  code: string;
  collapsible?: boolean;
  /** Soft-wraps instead of scrolling — for one-liners that run long. */
  wrap?: boolean;
  className?: string;
}) => {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lines = code.split('\n').length;
  const collapsed = collapsible && !expanded && lines > COLLAPSE_AT;

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={`group relative min-w-0 ${className ?? ''}`}>
      <div
        className="overflow-x-auto rounded-lg bg-code p-4 transition-[max-height]"
        style={
          collapsed ? { maxHeight: '22rem', overflowY: 'hidden' } : undefined
        }
      >
        <pre
          className={`font-mono text-[13px] leading-6 text-code-foreground ${
            wrap ? 'pr-10 whitespace-pre-wrap' : 'w-max min-w-full'
          }`}
        >
          <code>{highlight(code)}</code>
        </pre>
      </div>

      {collapsed && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center rounded-b-lg bg-gradient-to-t from-code to-transparent">
          <Button
            size="xs"
            variant="secondary"
            className="pointer-events-auto mb-3"
            onClick={() => setExpanded(true)}
            suffix={<ChevronDownIcon />}
          >
            {t.page.showAll(lines)}
          </Button>
        </div>
      )}

      <Tooltip title={copied ? t.page.copied : t.page.copy}>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={t.page.copy}
          onClick={copy}
          className="absolute top-2 right-2 bg-code text-code-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:bg-code hover:text-code-foreground"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </Tooltip>
    </div>
  );
};
