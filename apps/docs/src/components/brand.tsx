import pkg from '@antkit/react/package.json';
import { link } from '../lib/router';

/** Wordmark plus the version of `@antkit/react` these docs are built against. */
export const Brand = ({ className = '' }: { className?: string }) => (
  <a href={link('/')} className={`flex items-center gap-2 ${className}`}>
    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      {/*
        Three segments on a diagonal: an ant at a glance, and — unlike the
        vertical arrangement — never mistaken for a ⋮ overflow menu. Legs and
        antennae were tried and turn to mush at 16px.
      */}
      <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
        <circle cx="8" cy="7" r="2.6" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="16.5" cy="17.5" r="3.8" />
      </svg>
    </span>
    <span className="text-[15px] font-semibold tracking-tight">antkit</span>
    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums">
      {pkg.version}
    </span>
  </a>
);
