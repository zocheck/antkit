---
name: antkit-react
description: Build UI with @antkit/react — an Ant Design-shaped React component library on Radix and Tailwind v4. Use whenever the task involves rendering, styling or composing UI in a project that depends on @antkit/react, and whenever a component name below is mentioned (Button, Table, Form, Select, DatePicker, TimePicker, Modal, Message, …). Also use when converting an antd or shadcn/ui screen to antkit.
---

# antkit-react

## What this library is

`@antkit/react` gives you Ant Design's **prop shapes** on top of Radix
primitives and Tailwind v4 tokens. If you know antd, you already know the API:
`Form` takes `rules`, `Select` takes `options` and `mode`, `Table` takes
`columns` and `dataSource`, `message.success()` works from anywhere.

It is **not** antd. There is no `ConfigProvider`, no Less, no `dayjs`
requirement, no `.ant-*` class names. Styling is Tailwind classes against CSS
variables.

## Before you write any component code

Read the source. Every component carries a JSDoc block with a runnable example
and a note on when to reach for a different component instead. That block is
the contract — prefer it over guessing from the name.

```
packages/react/src/components/<kebab-name>/<kebab-name>.tsx
```

The fastest way to find the right one:

```bash
# What exists
ls packages/react/src/components

# The doc comment and prop type for one component
sed -n '1,80p' packages/react/src/components/select/select.tsx

# Which component owns a concept
grep -rl "showSearch\|maxTagCount" packages/react/src/components
```

## Layout

```
packages/react/src/
├── components/<name>/
│   ├── <name>.tsx          the component + its prop types + JSDoc
│   ├── <name>.styles.ts    tailwind-variants, only where variants exist
│   └── index.ts            barrel
├── hooks/                  use-mobile
├── lib/                    ui-config (translate), use-field-disclosure
├── utils/                  cn, object, string
└── index.ts                the public surface
```

Multi-file components keep their parts in the same folder — `date-picker/`
holds `calendar.tsx`, `date-field.tsx`, `parts.tsx`, `utils.ts`.

## Rules that matter

**Import from the package root.** The barrel tree-shakes; deep paths are not a
public API.

```tsx
import { Button, Form, Select } from '@antkit/react'; // yes
import { Button } from '@antkit/react/src/components/button'; // no
```

**Styling is `tailwind-variants`, not `cva`, and not string concatenation.**
When a component has variants, they live in `<name>.styles.ts`:

```ts
import { tv, type VariantProps } from 'tailwind-variants';

export const button = tv({
  base: ['inline-flex items-center justify-center', 'text-sm font-medium'],
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      ghost: 'hover:bg-accent',
    },
    size: { sm: 'h-8 px-3', default: 'h-9 px-4' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export type ButtonVariants = VariantProps<typeof button>;
```

`tv` runs tailwind-merge itself, so pass `className` **into** it rather than
wrapping the call in `cn` — one merge pass, and the caller's class still wins:

```tsx
className={button({ variant, size, className })}   // yes
className={cn(button({ variant, size }), className)}   // no, merges twice
```

Use `cn` only for conditional classes on a component that has no variants.

**Colours come from tokens, never raw Tailwind palette.** `bg-primary`,
`text-muted-foreground`, `border-input`, `bg-accent`. A literal `bg-blue-500`
breaks dark mode. The tokens live in `packages/styles/index.css`.

**Every element that a caller might target gets `data-slot`.** It is how the
library is styled from outside without exporting class names.

**Text is the host app's job.** Components take strings through props, or
through `UiConfigProvider translate` for the handful of built-in labels
(`ok`, `cancel`, `close`, `noData`, `now`, …). Never hard-code user-facing
copy inside a component.

## Setup in a consuming app

```css
/* app.css */
@import 'tailwindcss';
@import '@antkit/styles';

/* Tailwind skips node_modules, so point it at the source explicitly. */
@source '../node_modules/@antkit/react/src';
```

```tsx
import { MessageProvider, Toaster, UiConfigProvider } from '@antkit/react';

<UiConfigProvider translate={t}>
  {children}
  <Toaster />
  <MessageProvider />
</UiConfigProvider>;
```

Dark mode is the `dark` class on `<html>` — the variant is
`@custom-variant dark (&:is(.dark *))`.

## Choosing between near-neighbours

These are the pairs that get confused. The JSDoc on each says the same thing.

| Want                            | Use                   | Not             |
| ------------------------------- | --------------------- | --------------- |
| "It worked" pill at the top     | `message.success()`   | `Toaster`       |
| A notice with an action or undo | `toast()` / `Toaster` | `message`       |
| A notice inside the page        | `Alert`               | `message`       |
| Commits on click                | `Switch`              | `Checkbox`      |
| Commits on submit               | `Checkbox`            | `Switch`        |
| Blank list or table             | `Empty`               | `Result`        |
| Whole-page outcome (404, done)  | `Result`              | `Empty`         |
| Bars on a date axis             | `Gantt`               | `Timeline`      |
| Vertical run of events          | `Timeline`            | `Gantt`         |
| Pick from a flat list           | `Select`              | `TreeSelect`    |
| Pick from a hierarchy           | `TreeSelect`          | `Cascader`      |
| Walk level by level             | `Cascader`            | `TreeSelect`    |
| Two-column move between sets    | `Transfer`            | `CheckboxGroup` |

## Forms

`Form` is antd-shaped: `rules`, not a schema and not a resolver. Controls that
take `value` / `onChange` / `onBlur` plus the aria props drop into `Form.Item`
with no adapter — that includes `Select`, `DatePicker`, `InputNumber` and
`Switch`.

```tsx
<Form form={form} onFinish={(values) => save(values)}>
  <Form.Item
    name="email"
    label="Email"
    rules={[
      { required: true, message: t('emailRequired') },
      { type: 'email', message: t('emailInvalid') },
    ]}
  >
    <Input type="email" />
  </Form.Item>
</Form>
```

`Form.Item` injects into a `Switch` and `Checkbox` through `valuePropName`
— check the prop's doc comment before writing an adapter.

## Adding a component

1. `packages/react/src/components/<kebab-name>/`
2. `<kebab-name>.tsx` — props type first, then a JSDoc block with a real
   example, then the component.
3. `<kebab-name>.styles.ts` only if there are variants.
4. `index.ts` — `export * from './<kebab-name>';`
5. Add the folder to `components/index.ts` (kept alphabetical).
6. Add a section to `apps/docs/src/showcase.tsx`.
7. `pnpm typecheck && pnpm lint`

Match the surrounding code: named exports, arrow components, `ComponentProps<'x'>`
for the DOM half of a props type, `data-slot` on every meaningful element.

## Things that will bite you

- **`@source` is required.** Tailwind will not scan `node_modules`, so without
  it the app renders unstyled components and you will chase the wrong bug.
- **`Message` renders outside the React tree** that called it, so it cannot
  read context. Translate before calling `message.*`.
- **`RichTextEditor` drags in ~430 KB** of TipTap/ProseMirror. Always reach it
  through `lazy()`; never import it into an app shell.
- **`onChange` on `InputNumber` fires with out-of-range values while typing.**
  Clamping happens on blur, on purpose — so typing `5` toward `50` is not
  fought. Validate on submit, not per keystroke.
- **`DateRangePicker.onChange` fires with `to: null`** on the first click. Wait
  for both ends before querying.
