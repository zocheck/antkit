# antkit

Declarative React components on [Radix](https://www.radix-ui.com) and
Tailwind v4. 63 components, source-shipped, tree-shakeable.

The props say what you want, not how to wire it — `Form` takes `rules`,
`Select` takes `options` and `mode`, `Table` takes `columns` and
`dataSource`, `message.success()` works from anywhere. What you do not get is
a preprocessor, a theme object, or a class cascade to fight: `ConfigProvider`
here carries the built-in strings and nothing else.

## Install

```bash
pnpm add @antkit/react
```

```css
/* app.css */
@import 'tailwindcss';
@import '@antkit/react/styles.css';
```

That is the whole CSS setup. The line brings the design tokens and points
Tailwind at the component source, which it would otherwise skip along with the
rest of `node_modules`. The `@source` doing that lives inside the package and
resolves relative to itself, so it is right wherever your CSS sits and however
your package manager lays out `node_modules` — and if you mistype the import
you get a build error instead of a page of unstyled components.

```tsx
import { Button, Form, Input, message } from '@antkit/react';

<Form form={form} onFinish={() => message.success('Đã lưu')}>
  <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
    <Input />
  </Form.Item>
  <Button type="submit">Lưu</Button>
</Form>;
```

## Weight

Measured, gzipped, on top of React:

| you import                                                       | gzip     |
| ---------------------------------------------------------------- | -------- |
| nothing — just `cn`                                              | 10.3 KB  |
| Button, Card, Badge, Skeleton                                    | 26.5 KB  |
| Button, Input, Form, Checkbox, Alert, message                    | 47.7 KB  |
| a full CRUD page (+ Select, Table, Modal, Tooltip, DropdownMenu) | 88.6 KB  |
| all 62 components                                                | 180.9 KB |

That is the JavaScript. The CSS is a flat **19.3 KB gzip** whatever you
import, because Tailwind scans the whole library to find its class names —
there is no per-component CSS to wire up, and nothing to keep in step with
your imports.

An app that uses a handful of components can pay for a handful instead, by
importing one entry per component rather than `styles.css`:

```css
@import 'tailwindcss';
@import '@antkit/react/styles/base.css';
@import '@antkit/react/styles/button.css';
@import '@antkit/react/styles/select.css';
```

Measured on a four-component app that is **7.8 KB** rather than 19.3 KB. Each
entry brings the components its own component renders — `select.css` pulls
`popover` — so the list cannot be under-specified, and every path resolves
inside the package rather than guessing at your `node_modules`.

Source is shipped unbuilt and the barrel tree-shakes, so you pay for what you
import and nothing else. `RichTextEditor` is the one component heavy enough
(211 KB gzip of TipTap) to be kept out of the barrel entirely — it sits behind
`@antkit/react/rich-text-editor` with TipTap as an optional peer, so a plain
install never downloads it.

## Repo

```
packages/react     @antkit/react   components, and the agent skill
packages/mcp       @antkit/mcp     the catalogue as an MCP server
packages/styles    @antkit/styles  design tokens
apps/docs          live docs — one page per component
scripts/           generators for the agent-facing docs
prompts/           system prompts for code-gen tools
```

```bash
pnpm install
pnpm dev          # http://localhost:4000
pnpm typecheck
pnpm lint
```

## Using it with an AI agent

The package ships an agent skill. One command links it into your project:

```bash
npx antkit-skills            # → .claude/skills/antkit-react
npx antkit-skills --target .cursor/skills
```

It writes a symlink into `node_modules`, not a copy, so the skill your agent
reads is always the one that shipped with the version you have installed —
`pnpm update` updates the instructions along with the code. Pass `--copy` if
your agent doesn't follow symlinks.

Inside are `SKILL.md` — the API, the near-neighbour choices (`message` vs
`Toaster`, `Empty` vs `Result`, `TreeSelect` vs `Cascader`) and the traps —
and `COMPONENTS.md`, the generated catalogue of all 63 components. Both are
also readable straight out of
`node_modules/@antkit/react/skills/antkit-react/`.

Because the library is source-shipped, your agent can also read the real
component source in `node_modules`, and your editor's LSP shows each
component's doc block on hover.

### MCP

If your agent speaks MCP, `@antkit/mcp` serves the same material as tools it
can query rather than a document it has to read:

```bash
pnpm add -D @antkit/mcp
claude mcp add antkit -- npx -y @antkit/mcp
```

`list_components`, `get_component`, `search_components`, `get_guide`. It
resolves `@antkit/react` from your project, so a component name it returns is
one your installed version really exports. See
[packages/mcp](./packages/mcp/README.md).

Contributors and agents working on the library itself: read
[AGENTS.md](./AGENTS.md).

## License

MIT
