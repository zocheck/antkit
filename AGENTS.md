# AGENTS.md

Guidance for coding agents working **inside this repository**. If you are
consuming `@antkit/react` in another project, read
`packages/react/skills/antkit-react/SKILL.md` instead — that one is about using
the library, this one is about building it.

## What this repo is

A React component library with declarative, dashboard-shaped props, built on
Radix primitives and Tailwind v4 tokens.

```
packages/react/src        @antkit/react   the components
packages/react/styles.css the Tailwind entry consumers import
packages/react/skills     the agent skill, published with the package
packages/react/bin        the installer that links that skill into a project
packages/mcp              @antkit/mcp     the catalogue as an MCP server
packages/styles           @antkit/styles  design tokens, one index.css
apps/docs                 the live docs — one page per component
scripts/                  generators for the agent-facing docs
prompts/                  system prompts for code-gen tools
```

Source is shipped as-is: `@antkit/react` exports `./src/index.ts`, there is no
build step. Consumers compile it with their own bundler, which is what keeps
tree-shaking honest and source-level JSDoc reachable.

That last part is why the JSDoc matters more here than in a built library.
`files` is `src`, `skills`, `bin` and `styles.css`, so a consumer's agent reads the actual
component source out of `node_modules` and their editor's LSP shows the doc
comment on hover. It is the only channel that reaches every consumer, so a
component without a doc block is a component nobody's agent can use correctly.

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
means all six of these, and `pnpm check:docs` fails until they are all there:

1. `packages/react/src/components/<slug>/` — the `.tsx`, the `index.ts`, and
   `.styles.ts` if it has variants.
2. A line in `components/index.ts`, kept alphabetical.
3. The doc block on the component — see **The doc block** below.
4. An entry in `apps/docs/src/registry.ts`, placed next to the components it
   is related to rather than alphabetically.
5. `apps/docs/src/demos/<slug>.tsx` — `meta` with the API tables, then one
   arrow component per example, each with its own JSDoc title.
6. A one-line description under `components` in **both**
   `apps/docs/src/lib/locales/en.ts` and `vi.ts`.

## House style

Read a neighbouring component before writing a new one. The conventions are
consistent and worth matching exactly.

- **Named exports, arrow components.** No default exports, no `React.FC`.
- **Props type first**, then the doc block, then the component.
- **`ComponentProps<'div'>`** for the DOM half of a props type, intersected
  with the component's own props.
- **`data-slot="<name>"`** on every element a caller might want to target.
- **Controlled and uncontrolled both work**: `value` + `onChange`, or
  `defaultValue` with internal state. Follow the pattern in `date-picker.tsx`.
- **Comments explain _why_, never _what_.** If a line needs a comment to say
  what it does, rewrite the line.

## The doc block

Every component carries one, directly above the exported component and below
its props type. It is not decoration — it is the only documentation that
reaches a consumer's agent, and `pnpm check:docs` fails without it.

Four parts, always in this order, because an agent learns the _shape_ as much
as the content:

````tsx
/**
 * A button. `asChild` renders it as another element — a router link, say —
 * while keeping the styling and the focus ring.
 *
 * ```tsx
 * <Button variant="outline" loading={saving} prefix={<SaveIcon />}>
 *   Save
 * </Button>
 * ```
 *
 * Reach for `DropdownMenu` when the click opens a list of actions rather
 * than performing one.
 *
 * `loading` implies `disabled`, and hides `suffix` — the spinner takes the
 * `prefix` slot.
 */
````

1. **One line on what it is**, plus the one prop that is not guessable.
2. **A `tsx` example that would actually compile.** No `...`, no invented props.
3. **When to use something else** — the near-neighbour, by name.
4. **The trap**, when there is one. Skip the line rather than padding it.

Enumerate union values in the block or in the type, never leave them only in
`.styles.ts`. An agent reading `button.tsx` alone has to be able to see that
`variant` takes `'ghost'`.

Files over ~300 lines put a second block at the very top, above the imports,
listing the exported parts and the composition skeleton. `sed -n '1,80p'` is
how agents read a file; `table.tsx` and `sidebar.tsx` are long enough that
everything useful otherwise falls outside that window.

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

## Cursors

Which elements get the hand is a house style, not a fact — Radix Themes puts
the arrow on everything but links, Ant Design puts the hand on anything that
responds, Chakra sits between them. Both of the first two ship a **token per
element class** rather than baking the answer in, so antkit does too:

```css
--cursor-button      --cursor-menu-item   --cursor-checkbox   --cursor-slider-thumb
--cursor-link        --cursor-option      --cursor-radio      --cursor-slider-thumb-active
--cursor-switch      --cursor-disabled
```

Defaults are Ant Design's, since that is the API the kit is shaped after. A
team wanting the macOS reading redeclares one variable and the whole product
moves; no component changes.

`--cursor-disabled` is `not-allowed`, which is the one value Radix Themes,
Chakra and Ant Design all agree on.

The rules live in `@antkit/styles`, in `@layer base`, each wrapped in
`:where()` so they all sit at the same specificity and source order decides —
the general `button` rule first, the specific roles after it. Tailwind v4
dropped `cursor: pointer` from Preflight's `button`, so without this every
button in the kit is an arrow.

Do **not** put `cursor-pointer` on a component that renders a `<button>` or
carries one of those roles: the token already answers, and a hard-coded
utility beats it, which takes that component out of the theme. Reach for a
utility only when the answer depends on a prop, and then write both sides:

```tsx
className={cn(onRowClick ? 'cursor-pointer' : 'cursor-default')}
```

## Localisation

No user-facing string is hard-coded in a component. Either the caller passes it
as a prop, or it is read off the locale **with the English default written
right there**:

```tsx
const locale = useLocale();
// …
{
  clearLabel ?? locale.datePicker?.clearDate ?? 'Clear date';
}
```

Prop, then locale, then English. That last `??` is the whole design: there is
no English locale pack to ship, so `Button`'s wording lives in `button.tsx`
and leaves with it when nobody imports the component. A shared pack would sit
in every bundle whether or not the app renders a date picker.

Adding a string is two edits: the optional field in `Locale`
(`lib/locale.ts`), grouped by the component that renders it, and the `??`
default at the read site. `lib/locale/vi-VN.ts` is the one shipped translation
— add the Vietnamese there too, or the key stays English for Vietnamese users.

Anything taking a number or a name is a function (`files: (count) =>`), never
a template the caller has to interpolate.

`message.*` renders outside the React tree that called it and cannot read the
locale — its copy comes from the caller. `NotificationProvider` is mounted in
the tree, so its cards can.

## Agent-facing docs

Five artefacts, none of them written by hand:

```
packages/react/skills/antkit-react/COMPONENTS.md    the catalogue, ships to npm
packages/react/skills/antkit-react/catalogue.json   the same, for programs
packages/react/styles/<slug>.css                    one CSS entry per component
apps/docs/public/llms.txt                           the index, per llmstxt.org
apps/docs/public/llms-full.txt                      every doc block, one file
apps/docs/public/c/<slug>.md                        one static page per component
```

`catalogue.json` is what `@antkit/mcp` serves. It ships inside `@antkit/react`
rather than inside the MCP server so the server answers from the version the
consumer installed — a catalogue baked into the server would drift the moment
the two diverge. Keep it deterministic: no timestamps, no version field, or
`check:docs` fails on a clean tree.

`pnpm gen:styles` writes the CSS entries — each one carrying the components
its component renders internally, resolved from the imports rather than listed
by hand, because a missing entry does not error. `pnpm gen:docs` writes the
rest from the doc blocks, `apps/docs/src/registry.ts`
and the English locale. `pnpm check:docs` runs in CI and fails on a component
with no doc block, a component missing from the registry or the locale, or a
generated file that no longer matches its sources. Commit what it generates —
CI checks out clean and compares.

The `.md` pages exist because the docs site is a hash-routed SPA: an agent that
fetches a component URL gets an empty shell. Static markdown is the only thing
it can read over HTTP.

`SKILL.md` is hand-written and lives beside `COMPONENTS.md`. Anything true of
_every_ component belongs there; anything true of one belongs in its doc block.

## How the CSS reaches a consumer

`packages/react/styles.css` is the entry an app imports. It pulls in
`@antkit/styles` and carries the one `@source` that points Tailwind at the
component code.

It lives in the package, not in the app's CSS, because **`@source` resolves
relative to the stylesheet it sits in**. `./src` from here is right under npm,
pnpm, a monorepo, or wherever the app keeps its own CSS; the older
`@source '../node_modules/@antkit/react/src'` was a guess about both, and a
wrong guess renders unstyled components without erroring.

One entry, deliberately. Per-component CSS entries were tried and removed: they
saved about 14 KB gzip on a small app, and cost every consumer an import to
remember and keep in step with their component imports. A flat 21 KB that
nobody has to think about beats a variable 7 KB that everybody does.

`@antkit/styles` is a real dependency of `@antkit/react`, not a peer: a
component referencing `bg-primary` does not render without it. That is what
lets the whole setup be one line.

## Bundle discipline

The library is source-shipped, so anything imported from `components/index.ts`
is reachable from every consumer's entry chunk unless tree-shaking removes it.

- Keep components free of side effects at module scope.
- `RichTextEditor` is **out of the root barrel** on purpose: 211 KB gzip, 12x
  the next heaviest component. It is reachable only at
  `@antkit/react/rich-text-editor`, and TipTap is an optional peer so a plain
  install does not download 13 MB of editor. Keep it that way.
- Anything that would add more than ~20 KB gzip to the barrel deserves the same
  treatment: a subpath export plus optional peers.
- The shared floor is 10.3 KB gzip (`tailwind-merge`). `tailwind-variants` adds
  ~3.7 KB more, but only for the components that use it.
- Before adding a dependency, check whether an existing one already does the
  job. `radix-ui`, `lucide-react` and `tailwind-variants` cover most of it.
