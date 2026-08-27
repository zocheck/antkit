import { CodeBlock } from '../../components/code-block';
import { A, C, P, Section, Table } from '../../components/guide';
import { REGISTRY } from '../../registry';
import type { GuideMeta } from '../../lib/types';
import { link } from '../../lib/router';

export const meta: GuideMeta = {
  title: 'Installation',
  description:
    'One package, one stylesheet line, four providers. Everything below is the whole setup — there is no config file and no theme object.',
  toc: [
    { id: 'install', title: 'Install' },
    { id: 'stylesheet', title: 'The stylesheet' },
    { id: 'providers', title: 'Providers at the root' },
    { id: 'dark-mode', title: 'Dark mode' },
    { id: 'labels', title: 'Built-in labels' },
    { id: 'rich-text-editor', title: 'RichTextEditor' },
    { id: 'mcp', title: 'MCP and agents' },
    { id: 'gotchas', title: 'Things that will bite you' },
  ],
};

const INSTALL = `pnpm add @antkit/react`;

const STYLESHEET = `/* app.css */
@import 'tailwindcss';
@import '@antkit/react/styles.css';`;

const STYLESHEET_SUBSET = `/* app.css — pay for the components you use */
@import 'tailwindcss';
@import '@antkit/react/styles/base.css';

@import '@antkit/react/styles/button.css';
@import '@antkit/react/styles/input.css';
@import '@antkit/react/styles/card.css';
@import '@antkit/react/styles/select.css';`;

const PROVIDERS = `import {
  MessageProvider,
  Toaster,
  TooltipProvider,
  ConfigProvider,
} from '@antkit/react';

import './app.css';

export const App = ({ children }) => (
  <ConfigProvider translate={(key) => LABELS[key] ?? key}>
    <TooltipProvider>{children}</TooltipProvider>

    {/* Both portal to body, so anywhere in the tree will do. */}
    <Toaster />
    <MessageProvider />
  </ConfigProvider>
);`;

const DARK = `const toggle = (dark: boolean) =>
  document.documentElement.classList.toggle('dark', dark);`;

const LABELS = `const LABELS: Record<string, string> = {
  ok: 'OK',
  cancel: 'Cancel',
  noData: 'No data',
  rowsPerPage: 'Rows per page',
  // …and the rest, or fall through to the key.
};

<ConfigProvider translate={(key) => LABELS[key] ?? key}>`;

const RULE = `<Form.Item
  name="email"
  rules={[{ required: true, message: 'validation.required' }]}
>
  <Input />
</Form.Item>;`;

const SKILLS = `npx antkit-skills`;

const MCP = `pnpm add -D @antkit/mcp

# Claude Code
claude mcp add antkit -- npx -y @antkit/mcp

# or, for any client that reads an mcpServers config:
# { "mcpServers": { "antkit": { "command": "npx", "args": ["-y", "@antkit/mcp"] } } }`;

const EDITOR = `const RichTextEditor = lazy(() =>
  import('@antkit/react/rich-text-editor').then((m) => ({
    default: m.RichTextEditor,
  })),
);`;

const KEYS: { key: string; group: string; keys: string }[] = [
  {
    key: 'common',
    group: 'Everywhere',
    keys: 'ok, cancel, close, clear, remove, search, noData, selectPlaceholder, processing, dialog, dialogDescription',
  },
  { key: 'time', group: 'TimePicker', keys: 'now, startTime, endTime' },
  {
    key: 'table',
    group: 'Table',
    keys: 'rowsPerPage, perPage, previousPage, nextPage, jumpToPage, go, selectAll, selectRow, expandRow, collapseRow, resizeColumn',
  },
  {
    key: 'transfer',
    group: 'Transfer',
    keys: 'transferSource, transferTarget, transferToSource, transferToTarget',
  },
  {
    key: 'typography',
    group: 'Typography',
    keys: 'expand, collapse, copy, copied',
  },
  {
    key: 'validation',
    group: 'Form',
    keys: 'validation.required, validation.email, validation.url, validation.number, validation.integer, validation.min, validation.max, validation.len, validation.pattern, validation.invalid',
  },
];

export const Content = () => (
  <>
    <Section id="install" title="Install">
      <P>
        React 19 is the only required peer. Everything else the components need
        — Radix, lucide, tailwind-merge, and the <C>@antkit/styles</C> tokens —
        comes along as a dependency.
      </P>
      <CodeBlock code={INSTALL} collapsible={false} />
    </Section>

    <Section id="stylesheet" title="The stylesheet">
      <P>
        One line after Tailwind. <C>@antkit/react/styles.css</C> brings the
        tokens — colour, radius and font, plus the <C>dark</C> variant — and
        points Tailwind at the component source, which it would otherwise skip
        along with the rest of <C>node_modules</C>.
      </P>
      <CodeBlock code={STYLESHEET} collapsible={false} />
      <P>
        The <C>@source</C> inside it is resolved from that file, not from yours,
        so it stays correct wherever your CSS lives and however your package
        manager lays out <C>node_modules</C>. If the import itself is wrong you
        get a build error naming the specifier, rather than a page of unstyled
        components.
      </P>
      <P>
        There is nothing else to import. Tailwind scans all {REGISTRY.length}{' '}
        components to find their class names, so the CSS is a flat 19.3 KB
        gzipped whatever you use — no per-component stylesheet to add when you
        reach for a new component, and nothing to fall out of step with your
        imports.
      </P>
      <P>
        An app that uses a handful of components can pay for a handful. Import
        one entry per component instead of <C>styles.css</C>: on a four-
        component app that is{' '}
        <strong className="text-foreground">7.8 KB</strong> rather than 19.3 KB,
        measured.
      </P>
      <CodeBlock code={STYLESHEET_SUBSET} collapsible={false} />
      <P>
        Each entry already brings the components its own component renders —{' '}
        <C>select.css</C> pulls <C>popover</C>, because <C>Select</C> opens one.
        That list is generated rather than written down, since getting it wrong
        does not error: the dropdown just lands in the wrong place. For the same
        reason, do not hand-write <C>@source</C> lines pointing into{' '}
        <C>node_modules</C> — the path is a guess about your layout, and a wrong
        guess fails silently.
      </P>
      <P>
        Override any token by redeclaring it after the import. There is no theme
        object anywhere — a brand colour is one CSS variable.
      </P>
    </Section>

    <Section id="providers" title="Providers at the root">
      <P>
        Four, and only the first is strictly required. <C>ConfigProvider</C>{' '}
        supplies the built-in strings. <C>TooltipProvider</C> is what every{' '}
        <C>Tooltip</C> needs in scope — except inside <C>Sidebar</C> and{' '}
        <C>Gantt</C>, which mount one themselves. <C>Toaster</C> and{' '}
        <C>MessageProvider</C> are the mount points for the two imperative
        notification APIs; leave one out and its calls are silent.
      </P>
      <CodeBlock code={PROVIDERS} collapsible={false} />
    </Section>

    <Section id="dark-mode" title="Dark mode">
      <P>
        The <C>dark</C> class on <C>&lt;html&gt;</C>, nothing else. The variant
        in <C>@antkit/styles</C> is{' '}
        <C>@custom-variant dark (&amp;:is(.dark *))</C>, so every token flips
        with the class and no component needs to know which theme is on.
      </P>
      <CodeBlock code={DARK} collapsible={false} />
    </Section>

    <Section id="labels" title="Built-in labels">
      <P>
        No user-facing string is hard-coded inside a component. Most copy
        arrives as a prop; the strings a component has to produce on its own — a
        pagination label, a close button’s accessible name — go through{' '}
        <C>useConfig().translate(key)</C>, which is the function you passed to{' '}
        <C>ConfigProvider</C>. Miss a key and the key itself is rendered, so
        nothing ever comes out blank.
      </P>
      <CodeBlock code={LABELS} collapsible={false} />
      <P>The full set in use today:</P>
      <Table
        head={['Used by', 'Keys']}
        rows={KEYS.map((row) => ({
          key: row.key,
          cells: [
            <span key="group" className="whitespace-nowrap">
              {row.group}
            </span>,
            <span key="keys" className="font-mono text-[13px]">
              {row.keys}
            </span>,
          ],
        }))}
      />
      <P>
        <C>Form</C> puts validation messages through the same function, so a
        rule can carry a key instead of a sentence:
      </P>
      <CodeBlock code={RULE} collapsible={false} />
    </Section>

    <Section id="rich-text-editor" title="RichTextEditor">
      <P>
        The editor is 211 KB gzip of TipTap and ProseMirror — twelve times the
        next heaviest component — so it is not in the root barrel and TipTap is
        an optional peer. A plain install never downloads it.
      </P>
      <CodeBlock
        code={`pnpm add @tiptap/react @tiptap/starter-kit @tiptap/pm`}
        collapsible={false}
      />
      <P>
        Import it from its subpath, and lazily, so it lands on its own chunk:
      </P>
      <CodeBlock code={EDITOR} collapsible={false} />
      <P>
        Toolbar presets are plain data and safe to import eagerly from{' '}
        <C>@antkit/react/rich-text-editor/tools</C>.
      </P>
    </Section>

    <Section id="mcp" title="MCP and agents">
      <P>
        Two ways to hand the library to a coding agent, both reading the same
        source of truth — the doc block on each component.
      </P>
      <P>
        <C>npx antkit-skills</C> links the guide into{' '}
        <C>.claude/skills/antkit-react</C> as a file the agent reads. Nothing to
        run, nothing to configure.
      </P>
      <CodeBlock code={SKILLS} collapsible={false} />
      <P>
        <C>@antkit/mcp</C> is an MCP server that turns the same material into
        tools the agent can query: <C>list_components</C>, <C>get_component</C>,{' '}
        <C>search_components</C> and <C>get_guide</C>. Register it once per
        project.
      </P>
      <CodeBlock code={MCP} collapsible={false} />
      <P>
        It resolves <C>@antkit/react</C> from the project the client launched it
        in, so its answers track the version you actually installed — a
        component name it hands back is one the barrel really exports. Point it
        elsewhere with <C>ANTKIT_REACT_PATH</C>.
      </P>
    </Section>

    <Section id="gotchas" title="Things that will bite you">
      <Table
        head={['Symptom', 'Cause']}
        rows={[
          {
            key: 'source',
            cells: [
              'Components render unstyled',
              <span key="c">
                <C>@antkit/react/styles.css</C> is not imported, or an older
                setup is still using a hand-written <C>@source</C> whose
                relative path no longer points at the package.
              </span>,
            ],
          },
          {
            key: 'transpile',
            cells: [
              'The bundler chokes on TypeScript in node_modules',
              <span key="c">
                The package ships source on purpose. Add it to{' '}
                <C>transpilePackages</C> in Next.js; Vite needs nothing.
              </span>,
            ],
          },
          {
            key: 'message',
            cells: [
              <span key="s">
                <C>message.*</C> shows an untranslated string
              </span>,
              <span key="c">
                It renders outside the React tree that called it, so it cannot
                read context. Translate before calling.
              </span>,
            ],
          },
          {
            key: 'input-number',
            cells: [
              <span key="s">
                <C>InputNumber</C> fires <C>onChange</C> out of range
              </span>,
              'Clamping happens on blur, on purpose — so typing 5 on the way to 50 is not fought. Validate on submit.',
            ],
          },
          {
            key: 'range',
            cells: [
              <span key="s">
                <C>DateRangePicker</C> fires with <C>to: null</C>
              </span>,
              'That is the first click of a range. Wait for both ends before querying.',
            ],
          },
        ]}
      />
      <P>
        Everything else worth knowing is on the component pages, or in the JSDoc
        block at the call site. Start with{' '}
        <A href={link('/components/button')}>Button</A>.
      </P>
    </Section>
  </>
);
