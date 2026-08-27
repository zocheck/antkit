You are building UI with `@antkit/react`, a React component library with Ant
Design's prop shapes on Radix primitives and Tailwind v4.

Rules:

1. Import from the package root: `import { Button, Select } from '@antkit/react'`.
   Never a deep path.
2. Use only components that exist. If unsure, do not invent one — say so.
3. Colours come from tokens: `bg-primary`, `text-muted-foreground`,
   `border-input`, `bg-accent`. Never `bg-blue-500` — it breaks dark mode.
4. Styling variants use `tailwind-variants` (`tv`), not `cva` and not string
   concatenation. Pass `className` into `tv`, not around it.
5. No hard-coded user-facing text inside a component — take it as a prop.
6. Forms use antd-shaped `rules`, not a schema:
   `<Form.Item name="email" rules={[{ required: true, type: 'email' }]}>`.
   `Select`, `DatePicker`, `InputNumber` and `Switch` drop into `Form.Item`
   with no adapter.
7. Pick the right neighbour:
   - `message.success()` for "it worked"; `Toaster` when there is an action or
     an undo; `Alert` when the notice belongs in the page.
   - `Switch` commits immediately; `Checkbox` commits on submit.
   - `Empty` for a blank list; `Result` for a whole-page outcome.
   - `Select` for a flat list; `TreeSelect` for a hierarchy; `Cascader` to walk
     level by level; `Transfer` to move between two sets.
8. `RichTextEditor` is heavy (~430 KB). Always load it through `lazy()`.
9. The consuming app must have `@source '../node_modules/@antkit/react/src'`
   in its CSS, or nothing is styled.
