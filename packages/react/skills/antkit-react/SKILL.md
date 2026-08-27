---
name: antkit-react
description: Build UI with @antkit/react — a declarative React component library on Radix and Tailwind v4. Use whenever the task involves rendering, styling or composing UI in a project that depends on @antkit/react, and whenever a component name below is mentioned (Button, Table, Form, Select, DatePicker, TimePicker, Modal, Message, …). Also use when porting a screen from another React component library to antkit.
---

# antkit-react

## What this library is

`@antkit/react` gives you **declarative props** on top of Radix primitives and
Tailwind v4 tokens: `Form` takes `rules`, `Select` takes `options` and `mode`,
`Table` takes `columns` and `dataSource`, `message.success()` works from
anywhere. Props say what you want; the component does the wiring.

There is no CSS preprocessor, no `dayjs` requirement, no generated class
cascade, and nothing to theme through JavaScript. `ConfigProvider` exists but
carries only the built-in strings — colour and radius are CSS variables, and
styling is Tailwind classes against them.

## Before you write any component code

Start from `COMPONENTS.md`, next to this file. It is the whole catalogue —
every export, what it is in one line, and its main props — and it is generated
from the source, so it never claims something that isn't there. **If a name is
not in that list, the library does not have it.** Say so rather than importing
it and hoping.

Then read the source of the ones you picked. Every component carries a doc
block with a runnable example and a note on when to reach for a different
component instead. That block is the contract — prefer it over guessing from
the name.

The library is source-shipped, so the real source is in `node_modules`:

```
node_modules/@antkit/react/src/components/<kebab-name>/<kebab-name>.tsx
```

```bash
# The doc block and prop types for one component
sed -n '1,80p' node_modules/@antkit/react/src/components/select/select.tsx

# Which component owns a concept
grep -rl "showSearch\|maxTagCount" node_modules/@antkit/react/src/components
```

Your editor's LSP has the same content: hovering an imported component shows
its doc block, and autocomplete on a prop shows that prop's comment. That is
usually faster than opening the file.

## Layout

```
@antkit/react/
├── src/
│   ├── components/<name>/
│   │   ├── <name>.tsx      the component + its prop types + doc block
│   │   ├── <name>.styles.ts  tailwind-variants, only where variants exist
│   │   └── index.ts        barrel
│   ├── hooks/              use-mobile
│   ├── lib/                config + locale, use-field-disclosure
│   ├── utils/              cn, object, string
│   └── index.ts            the public surface
└── skills/antkit-react/    this skill, and COMPONENTS.md
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
from the `ConfigProvider` locale for the ones they have to render on their own
(`common.ok`, `pagination.rowsPerPage`, `datePicker.openCalendar`, …). Never
hard-code user-facing copy inside a component.

## Setup in a consuming app

```css
/* app.css */
@import 'tailwindcss';
@import '@antkit/react/styles.css';
```

That is the entire CSS setup — there is no per-component stylesheet to import
alongside a component. The single entry carries the tokens and the `@source`
that points Tailwind at the component code, and it costs a flat 21.2 KB gzip.

Do **not** write `@source '../node_modules/@antkit/react/src'` in the app's own
CSS. That is the old setup, and its relative path is a guess about where the
app's stylesheet sits and how the package manager laid out `node_modules`.

```tsx
import { ConfigProvider, MessageProvider, Toaster } from '@antkit/react';
import { viVN } from '@antkit/react/locale/vi-VN';

<ConfigProvider locale={viVN}>
  {children}
  <Toaster />
  <MessageProvider />
</ConfigProvider>;
```

Everything the kit renders on its own is **English by default** — there is no
English locale pack, each component carries its own wording. `locale` is only
ever the difference from English:

```tsx
import { viVN } from '@antkit/react/locale/vi-VN';

<ConfigProvider locale={viVN}>       // the whole thing in Vietnamese
<ConfigProvider locale={{ common: { ok: 'Xác nhận' } }}>   // just one word
```

Every key is optional, so a partial locale is normal and anything left out
stays English. Already have an i18n runtime? Build the object from it — you
only write the keys you actually use:

```tsx
<ConfigProvider locale={{ common: { ok: t('ok'), cancel: t('cancel') } }}>
```

A prop always beats the locale, so one-off wording never needs a locale entry:
`<DatePicker clearLabel="Bỏ chọn" />`.

Dark mode is the `dark` class on `<html>` — the variant is
`@custom-variant dark (&:is(.dark *))`.

## Choosing between near-neighbours

These are the pairs that get confused. The JSDoc on each says the same thing.

| Want                            | Use                     | Not             |
| ------------------------------- | ----------------------- | --------------- |
| "It worked" pill at the top     | `message.success()`     | `Toaster`       |
| A notice with an action or undo | `toast()` / `Toaster`   | `message`       |
| A notice inside the page        | `Alert`                 | `message`       |
| Commits on click                | `Switch`                | `Checkbox`      |
| Commits on submit               | `Checkbox`              | `Switch`        |
| Blank list or table             | `Empty`                 | `Result`        |
| Whole-page outcome (404, done)  | `Result`                | `Empty`         |
| Bars on a date axis             | `Gantt`                 | `Timeline`      |
| Vertical run of events          | `Timeline`              | `Gantt`         |
| Pick from a flat list           | `Select`                | `TreeSelect`    |
| Pick from a hierarchy           | `TreeSelect`            | `Cascader`      |
| Walk level by level             | `Cascader`              | `TreeSelect`    |
| Two-column move between sets    | `Transfer`              | `CheckboxGroup` |
| A dialog you can walk away from | `Modal`                 | `Popconfirm`    |
| A choice that cannot be dodged  | `Modal variant="alert"` | plain `Modal`   |
| `await` a yes/no in a handler   | `Modal.useModal()`      | `Modal` + state |
| Overflow that looks cut off     | `ScrollShadow`          | `Marquee`       |

There is no separate `AlertDialog`. An alert dialog is a `Modal` with
`variant="alert"`: `role="alertdialog"`, no close button, no dismissing by
Escape or by the mask, centred rather than a sheet on a phone, and focus
opening on cancel instead of the confirming button.

## Forms

`Form` takes `rules` on the field, not a schema and not a resolver. Controls that
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

## Extending a component

Do it from the outside first. `className` wins over the component's own classes
— that is what `tailwind-merge` is paying for — and `data-slot` attributes give
you a handle on the inner elements:

```tsx
<Select className="w-full" options={options} />

/* app.css — restyle every select's trigger */
[data-slot='select-trigger'] {
  @apply rounded-none;
}
```

If a component genuinely lacks a prop it should have, that belongs upstream:
clone the repo and read `AGENTS.md` at its root, which covers the house style
and what a new component has to ship with. Do not vendor a modified copy into
`src/` — it takes the component off the upgrade path for good.

## What it costs

Measured, gzipped, on top of React:

| you import                                                       | gzip     |
| ---------------------------------------------------------------- | -------- |
| nothing — just `cn`                                              | 10.3 KB  |
| Button, Card, Badge, Skeleton                                    | 26.5 KB  |
| Button, Input, Form, Checkbox, Alert, message                    | 47.7 KB  |
| a full CRUD page (+ Select, Table, Modal, Tooltip, DropdownMenu) | 88.6 KB  |
| every component in the barrel                                    | 180.9 KB |
| `RichTextEditor`, on its own chunk                               | +211 KB  |

The 10.3 KB floor is `tailwind-merge`, paid once per app, and it is what makes
a caller's `className` beat the component's own classes.

Heaviest single components: `sidebar` 47 KB, `date-picker` 46 KB,
`time-picker` 46 KB, `popconfirm` 40 KB, `dropdown-menu` 34 KB — the cost is
Radix's floating/dismissable-layer stack, shared between them, so importing
two of them costs far less than the sum.

## Things that will bite you

- **The stylesheet import is required.** Tailwind will not scan `node_modules`
  on its own, so without `@antkit/react/styles.css` every component renders
  unstyled and nothing in the build says why.
- **`Message` renders outside the React tree** that called it, so it cannot
  read context. Translate before calling `message.*`.
- **`RichTextEditor` is not in the root barrel.** It costs 211 KB gzip of
  TipTap/ProseMirror — 12x the next heaviest component — so it lives behind a
  subpath and an optional peer dependency:

  ```tsx
  const RichTextEditor = lazy(() =>
    import('@antkit/react/rich-text-editor').then((m) => ({
      default: m.RichTextEditor,
    })),
  );
  ```

  Install the peers first: `pnpm add @tiptap/react @tiptap/starter-kit @tiptap/pm`.
  Toolbar presets are plain data and safe to import eagerly from
  `@antkit/react/rich-text-editor/tools`.

- **`onChange` on `InputNumber` fires with out-of-range values while typing.**
  Clamping happens on blur, on purpose — so typing `5` toward `50` is not
  fought. Validate on submit, not per keystroke.
- **`DateRangePicker.onChange` fires with `to: null`** on the first click. Wait
  for both ends before querying.
