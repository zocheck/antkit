import { useState } from 'react';
import type { CSSProperties } from 'react';

import { Button } from '@antkit/react';
import { ArrowRightIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Button'],
  extraImports: [
    "import { ArrowRightIcon, PlusIcon, TrashIcon } from 'lucide-react';",
  ],
  api: [
    {
      title: 'Button',
      description: 'Takes every prop a <button> does, plus the ones below.',
      props: [
        {
          name: 'variant',
          type: "'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'",
          default: "'default'",
          description: 'How it looks.',
        },
        {
          name: 'size',
          type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
          default: "'default'",
          description:
            'Height and padding. The icon-* sizes are square, for buttons that are only an icon.',
        },
        {
          name: 'radius',
          type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'",
          default: "'md'",
          description: 'Corner radius.',
        },
        {
          name: 'block',
          type: 'boolean',
          default: 'false',
          description: 'Stretches the button to the width of its parent.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description:
            'Swaps the prefix for a spinner and locks the button, so it cannot submit twice.',
        },
        {
          name: 'loadingLabel',
          type: 'string',
          default: "'Loading'",
          description: 'Read out by screen readers while loading.',
        },
        {
          name: 'wave',
          type: 'boolean',
          default: 'true',
          description:
            'A ripple spreading from the border on click. `ghost` and `link` have none. Tune it with `--wave-opacity`, `--wave-spread`, `--wave-duration`.',
        },
        {
          name: 'prefix',
          type: 'ReactNode',
          description: 'Content before the label, usually an icon.',
        },
        {
          name: 'suffix',
          type: 'ReactNode',
          description: 'Content after the label, usually an icon.',
        },
        {
          name: 'asChild',
          type: 'boolean',
          default: 'false',
          description:
            'Pushes the styling onto the child element instead of rendering a <button> — for when you need an <a>. Not compatible with prefix/suffix, since Slot accepts exactly one child.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the button.',
        },
      ],
    },
  ],
};

/**
 * Variants
 *
 * Six built in. `default` for the screen's main action, `destructive` for the
 * one that cannot be undone, the rest for everything secondary.
 */
export const Variants = () => (
  <>
    <Button>Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
    <Button variant="destructive">Destructive</Button>
  </>
);

/**
 * Sizes
 *
 * Five heights, from 24px to 48px.
 */
export const Sizes = () => (
  <>
    <Button size="xs">Extra small</Button>
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Large</Button>
    <Button size="xl">Extra large</Button>
  </>
);

/**
 * Icons at either end
 *
 * `prefix` and `suffix` take any node; icons are scaled to 16px for you.
 */
export const WithIcon = () => (
  <>
    <Button prefix={<PlusIcon />}>Add student</Button>
    <Button variant="secondary" suffix={<ArrowRightIcon />}>
      Next step
    </Button>
    <Button variant="destructive" prefix={<TrashIcon />}>
      Delete
    </Button>
  </>
);

/**
 * Icon only
 *
 * The `icon-*` sizes come out square. Remember `aria-label` — there is no text
 * left for a screen reader to read.
 */
export const IconOnly = () => (
  <>
    <Button size="icon-xs" variant="ghost" aria-label="Add">
      <PlusIcon />
    </Button>
    <Button size="icon-sm" variant="secondary" aria-label="Add">
      <PlusIcon />
    </Button>
    <Button size="icon" aria-label="Add">
      <PlusIcon />
    </Button>
    <Button size="icon-lg" variant="outline" aria-label="Add">
      <PlusIcon />
    </Button>
    <Button size="icon" radius="full" variant="destructive" aria-label="Delete">
      <TrashIcon />
    </Button>
  </>
);

/**
 * Loading
 *
 * Press it: the button locks itself while it runs, so `disabled` is redundant.
 */
export const Loading = () => {
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Saved');
    }, 1500);
  };

  return (
    <>
      <Button loading={saving} onClick={save}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
      <Button loading variant="secondary">
        Always loading
      </Button>
      <Button loading size="icon" aria-label="Loading" />
    </>
  );
};

/**
 * Disabled
 */
export const Disabled = () => (
  <>
    <Button disabled>Default</Button>
    <Button disabled variant="secondary">
      Secondary
    </Button>
    <Button disabled variant="outline">
      Outline
    </Button>
    <Button disabled variant="destructive">
      Destructive
    </Button>
  </>
);

/**
 * Corner radius
 */
export const Radius = () => (
  <>
    <Button radius="none">none</Button>
    <Button radius="sm">sm</Button>
    <Button radius="md">md</Button>
    <Button radius="lg">lg</Button>
    <Button radius="full">full</Button>
  </>
);

/**
 * Full width
 *
 * `block` is for the submit button in a narrow form, or on a pricing card.
 */
export const Block = () => (
  <div className="grid w-full max-w-sm gap-2">
    <Button block>Sign in</Button>
    <Button block variant="secondary">
      Create an account
    </Button>
  </div>
);

/**
 * Rendering as something else
 *
 * `asChild` pushes the whole style onto the child — the only way to get a link
 * that looks like a button while staying a real <a> for screen readers and the
 * right-click menu. The icon then has to live inside that child, because
 * `prefix`/`suffix` would be a second child and Slot accepts exactly one.
 */
export const AsChild = () => (
  <Button asChild variant="outline">
    <a href="https://www.radix-ui.com" target="_blank" rel="noreferrer">
      Open Radix UI
      <ArrowRightIcon />
    </a>
  </Button>
);

/**
 * The click ripple
 *
 * On by default, and deliberately faint. Turn it off with `wave={false}`, or
 * tune it through three CSS variables — no need to patch the library.
 */
export const Wave = () => (
  <>
    <Button>Default</Button>
    <Button
      style={
        { '--wave-opacity': 0.28, '--wave-spread': '8px' } as CSSProperties
      }
    >
      Stronger
    </Button>
    <Button wave={false}>Off</Button>
  </>
);
