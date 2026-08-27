# antkit

Ant Design-shaped React components on [Radix](https://www.radix-ui.com) and
Tailwind v4. 63 components, source-shipped, tree-shakeable.

If you know antd you already know the API — `Form` takes `rules`,
`Select` takes `options` and `mode`, `Table` takes `columns` and
`dataSource`, `message.success()` works from anywhere. What you do not get
is Less, `ConfigProvider`, or a `.ant-*` class to fight.

## Install

```bash
pnpm add @antkit/react @antkit/styles
```

```css
/* app.css */
@import 'tailwindcss';
@import '@antkit/styles';

/* Tailwind skips node_modules — point it at the source. */
@source '../node_modules/@antkit/react/src';
```

```tsx
import { Button, Form, Input, message } from '@antkit/react';

<Form form={form} onFinish={() => message.success('Đã lưu')}>
  <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
    <Input />
  </Form.Item>
  <Button type="submit">Lưu</Button>
</Form>;
```

## Repo

```
packages/react     @antkit/react   components
packages/styles    @antkit/styles  design tokens
apps/docs          live showcase
skills/            agent skills — drop into Claude Code, Cursor, …
prompts/           system prompts for code-gen tools
```

```bash
pnpm install
pnpm dev          # http://localhost:4000
pnpm typecheck
pnpm lint
```

## Using it with an AI agent

`skills/antkit-react/SKILL.md` teaches an agent the API, the near-neighbour
choices (`message` vs `Toaster`, `Empty` vs `Result`, `TreeSelect` vs
`Cascader`) and the traps. Copy it into your project's skills directory.

Contributors and agents working on the library itself: read
[AGENTS.md](./AGENTS.md).

## License

MIT
