# AGENTS.md

Guidance for coding agents working **inside this repository**. If you are
consuming `@antkit/react` in another project, read `skills/antkit-react/SKILL.md`
instead — that one is about using the library, this one is about building it.

## What this repo is

A React component library with Ant Design's prop shapes, built on Radix
primitives and Tailwind v4 tokens.

```
packages/react     @antkit/react   the components
packages/styles    @antkit/styles  design tokens, one index.css
apps/docs          the live showcase — every component has a section
skills/            agent skills shipped to consumers
prompts/           system prompts for code-gen tools
```

Source is shipped as-is: `@antkit/react` exports `./src/index.ts`, there is no
build step. Consumers compile it with their own bundler, which is what keeps
tree-shaking honest and source-level JSDoc reachable.

## Commands

```bash
pnpm install
pnpm dev          # docs at http://localhost:4000
pnpm typecheck    # every workspace
pnpm lint         # oxlint
pnpm format       # oxfmt
```

Run `pnpm typecheck && pnpm lint` before you call anything done. Both are fast.

## Layout rules

One folder per component, kebab-case, matching the export:

```
components/input-number/
├── input-number.tsx        props type, JSDoc, component
├── input-number.styles.ts  only when there are variants
└── index.ts                export * from './input-number';
```

Multi-part components keep their parts in the same folder rather than spilling
into the components root — `date-picker/` owns `calendar.tsx`,
`date-field.tsx`, `parts.tsx`, `utils.ts`.

`components/index.ts` lists every folder alphabetically. Adding a component
means adding a line there and a section in `apps/docs/src/showcase.tsx`.

## House style

Read a neighbouring component before writing a new one. The conventions are
consistent and worth matching exactly.

- **Named exports, arrow components.** No default exports, no `React.FC`.
- **Props type first**, then a JSDoc block, then the component.
- **The JSDoc block is the documentation.** One line on what it is, a runnable
  `tsx` example, and a sentence on when to use a different component instead.
  Agents consuming this library read these; they are not decoration.
- **`ComponentProps<'div'>`** for the DOM half of a props type, intersected
  with the component's own props.
- **`data-slot="<name>"`** on every element a caller might want to target.
- **Controlled and uncontrolled both work**: `value` + `onChange`, or
  `defaultValue` with internal state. Follow the pattern in `date-picker.tsx`.
- **Comments explain _why_, never _what_.** If a line needs a comment to say
  what it does, rewrite the line.

## Styling

Tailwind v4 against CSS variables from `@antkit/styles`. Never a raw palette
colour — `bg-primary`, not `bg-blue-600`, or dark mode breaks.

Variants go in `<name>.styles.ts` using `tailwind-variants`:

```ts
export const button = tv({
  base: ['inline-flex items-center', 'text-sm font-medium'],
  variants: { size: { sm: 'h-8 px-3', default: 'h-9 px-4' } },
  defaultVariants: { size: 'default' },
});
```

Pass `className` **into** `tv`, not around it — `tv` already merges:

```tsx
className={button({ size, className })}          // yes
className={cn(button({ size }), className)}      // no, two merge passes
```

`cn` is for conditional classes on components with no variants.

## Accessibility

Radix carries the roles and keyboard model for anything it backs. For
hand-rolled controls (`date-picker` segments, `time-picker` columns, `tree`),
match the native equivalent: `role="spinbutton"` with `aria-valuenow`,
`role="listbox"` / `option`, `aria-selected`, roving `tabIndex`.

Never remove a focus ring without replacing it.

## Localisation

No user-facing string is hard-coded in a component. Either the caller passes
it as a prop, or it comes from `useUiConfig().translate(key)` with a prop
override:

```tsx
{
  okText ?? translate('ok');
}
```

Keys currently in use: `ok`, `cancel`, `close`, `now`, `startTime`, `endTime`,
`clear`, `remove`, `search`, `noData`, `selectPlaceholder`, `processing`,
`dialog`, `dialogDescription`, `rowsPerPage`, `previousPage`, `nextPage`,
`selectAll`, `selectRow`, `resizeColumn`. Add one and also add it to the
`LABELS` map in `apps/docs/src/app.tsx`.

## Bundle discipline

The library is source-shipped, so anything imported from `components/index.ts`
is reachable from every consumer's entry chunk unless tree-shaking removes it.

- Keep components free of side effects at module scope.
- `RichTextEditor` pulls ~430 KB of TipTap/ProseMirror. It stays in the barrel
  for discoverability, but never import it from a shared file — the moment an
  app shell touches it, every page pays. Document `lazy()` at the call site.
- Before adding a dependency, check whether an existing one already does the
  job. `radix-ui`, `lucide-react` and `tailwind-variants` cover most of it.
