import { A, C, P, Section, Table } from '../../components/guide';
import { CodeBlock } from '../../components/code-block';
import { useT } from '../../lib/i18n';
import { GROUPS, REGISTRY } from '../../registry';
import type { GuideMeta } from '../../lib/types';

export const meta: GuideMeta = {
  title: 'Introduction',
  description: `A React component library with declarative, dashboard-shaped props, built on Radix primitives and Tailwind v4 tokens. ${REGISTRY.length} components, shipped as source, tree-shakeable.`,
  toc: [
    { id: 'what-it-is', title: 'What antkit is' },
    { id: 'familiar-api', title: 'A familiar API' },
    { id: 'what-you-dont-get', title: 'What you do not get' },
    { id: 'how-it-ships', title: 'How it ships' },
    { id: 'weight', title: 'What it weighs' },
    { id: 'components', title: 'The components' },
    { id: 'near-neighbours', title: 'Near-neighbours' },
    { id: 'agents', title: 'Building with an agent' },
    { id: 'packages', title: 'The packages' },
  ],
};

const FORM = `import { Button, Form, Input, Select, message } from '@antkit/react';

<Form form={form} onFinish={(values) => save(values)}>
  <Form.Item
    name="email"
    label="Email"
    rules={[{ required: true, type: 'email' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item name="roles" label="Roles">
    <Select options={roles} mode="multiple" showSearch />
  </Form.Item>

  <Button type="submit">Save</Button>
</Form>;`;

const SLOTS = `/* Every element a caller might want to reach carries a data-slot. */
[data-slot='card-header'] {
  padding-block: --spacing(5);
}`;

const WEIGHT: { key: string; cells: [string, string] }[] = [
  { key: 'floor', cells: ['nothing — just `cn`', '10.3 KB'] },
  { key: 'basics', cells: ['Button, Card, Badge, Skeleton', '26.5 KB'] },
  {
    key: 'form',
    cells: ['Button, Input, Form, Checkbox, Alert, message', '47.7 KB'],
  },
  {
    key: 'crud',
    cells: [
      'a full CRUD page (+ Select, Table, Modal, Tooltip, DropdownMenu)',
      '88.6 KB',
    ],
  },
  { key: 'all', cells: ['every component in the barrel', '180.9 KB'] },
  { key: 'editor', cells: ['RichTextEditor, on its own chunk', '+211 KB'] },
];

const NEIGHBOURS: { key: string; want: string; use: string; not: string }[] = [
  {
    key: 'message',
    want: 'An “it worked” pill at the top',
    use: 'message.success()',
    not: 'Toaster',
  },
  {
    key: 'toast',
    want: 'A notice with an action or undo',
    use: 'toast()',
    not: 'message',
  },
  {
    key: 'alert',
    want: 'A notice inside the page',
    use: 'Alert',
    not: 'message',
  },
  { key: 'switch', want: 'Commits on click', use: 'Switch', not: 'Checkbox' },
  { key: 'empty', want: 'A blank list or table', use: 'Empty', not: 'Result' },
  {
    key: 'result',
    want: 'A whole-page outcome (404, done)',
    use: 'Result',
    not: 'Empty',
  },
  {
    key: 'tree-select',
    want: 'Pick from a hierarchy',
    use: 'TreeSelect',
    not: 'Cascader',
  },
  {
    key: 'cascader',
    want: 'Walk level by level',
    use: 'Cascader',
    not: 'TreeSelect',
  },
  { key: 'gantt', want: 'Bars on a date axis', use: 'Gantt', not: 'Timeline' },
];

export const Content = () => {
  const t = useT();

  return (
    <>
      <Section id="what-it-is" title="What antkit is">
        <P>
          Two packages. <C>@antkit/react</C> is {REGISTRY.length} components
          whose props describe an outcome rather than a wiring;{' '}
          <C>@antkit/styles</C> is one CSS file of colour, radius and font
          tokens plus the <C>dark</C> variant. Underneath,{' '}
          <A href="https://www.radix-ui.com">Radix</A> carries the roles, the
          keyboard model and focus management, and Tailwind v4 carries the look.
        </P>
        <P>
          It is aimed at a team building admin screens in Tailwind — props that
          say what the screen does, over primitives you style with the same
          utilities as the rest of your app.
        </P>
      </Section>

      <Section id="familiar-api" title="A familiar API">
        <P>
          <C>Form</C> takes <C>rules</C>, <C>Select</C> takes <C>options</C> and{' '}
          <C>mode</C>, <C>Table</C> takes <C>columns</C> and <C>dataSource</C>,
          and <C>message.success()</C> works from anywhere — it renders outside
          the React tree, so a service module can call it with no component in
          scope. Controls that speak <C>value</C> / <C>onChange</C> drop into a{' '}
          <C>Form.Item</C> with no adapter.
        </P>
        <CodeBlock code={FORM} collapsible={false} />
      </Section>

      <Section id="what-you-dont-get" title="What you do not get">
        <P>
          No CSS preprocessor, no <C>dayjs</C> requirement, no generated class
          cascade to fight, and nothing to theme through JavaScript —{' '}
          <C>ConfigProvider</C> is here, but it carries the built-in strings and
          nothing else. Theming is redeclaring a CSS variable; dark mode is the{' '}
          <C>dark</C> class on <C>&lt;html&gt;</C>. Every element a caller might
          want to reach carries a <C>data-slot</C>, which is how the library is
          styled from outside without exporting class names.
        </P>
        <CodeBlock code={SLOTS} collapsible={false} />
        <P>
          No user-facing string is hard-coded either. Components take their copy
          through props, or through <C>ConfigProvider</C> for the handful of
          built-in labels — see{' '}
          <A href="/installation/labels">Localising the built-in labels</A>.
        </P>
      </Section>

      <Section id="how-it-ships" title="How it ships">
        <P>
          <C>@antkit/react</C> publishes its TypeScript source and nothing else:{' '}
          <C>exports</C> points at <C>./src/index.ts</C>, there is no build step
          and no <C>dist</C>. Your bundler compiles it along with your own code,
          which is what keeps tree-shaking honest, keeps the JSDoc on every
          component reachable at the call site, and makes a stack trace point at
          a line you can actually read.
        </P>
        <P>
          The price is two setup details: Tailwind has to be told to scan the
          package (<C>@source</C>), and a bundler that ignores TypeScript inside{' '}
          <C>node_modules</C> has to be told not to — <C>transpilePackages</C>{' '}
          in Next.js, nothing at all in Vite.{' '}
          <A href="/installation">Installation</A> covers both.
        </P>
      </Section>

      <Section id="weight" title="What it weighs">
        <P>Measured, gzipped, on top of React:</P>
        <Table
          head={['You import', 'gzip']}
          rows={WEIGHT.map((row) => ({
            key: row.key,
            cells: [
              <span key="what">{row.cells[0]}</span>,
              <span key="size" className="font-mono text-[13px]">
                {row.cells[1]}
              </span>,
            ],
          }))}
        />
        <P>
          The 10.3 KB floor is <C>tailwind-merge</C>, paid once per app, and it
          is what makes your <C>className</C> beat the component’s own classes.
          The heavy components — <C>Sidebar</C>, <C>DatePicker</C>,{' '}
          <C>TimePicker</C>, <C>DropdownMenu</C> — are heavy because of Radix’s
          floating and dismissable-layer stack, which they share, so importing
          two of them costs far less than the sum of the two.
        </P>
        <P>
          <C>RichTextEditor</C> is the one component kept out of the root barrel
          on purpose: 211 KB gzip of TipTap, twelve times the next heaviest. It
          lives at <C>@antkit/react/rich-text-editor</C> with TipTap as an
          optional peer, so a plain install never downloads it.
        </P>
      </Section>

      <Section id="components" title="The components">
        <P>
          {REGISTRY.length} pages, grouped the way the sidebar groups them. Each
          one is the component running, the code that produced it, and its prop
          table.
        </P>
        <div className="grid gap-4">
          {GROUPS.map((group) => {
            const entries = REGISTRY.filter((entry) => entry.group === group);
            if (entries.length === 0) return null;

            return (
              <div key={group} className="grid gap-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {t.groups[group]}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {entries.map((entry) => (
                    <a
                      key={entry.slug}
                      href={`/components/${entry.slug}`}
                      className="rounded-xl border border-border p-3 transition-colors hover:border-primary hover:bg-accent/40"
                    >
                      <p className="font-medium">{entry.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                        {t.components[entry.slug]}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="near-neighbours" title="Near-neighbours">
        <P>
          These are the pairs that get picked wrong. The JSDoc on each component
          says the same thing at the call site.
        </P>
        <Table
          head={['You want', 'Reach for']}
          rows={NEIGHBOURS.map((row) => ({
            key: row.key,
            cells: [
              <span key="want">{row.want}</span>,
              <span key="use">
                <C>{row.use}</C>, not <C>{row.not}</C>
              </span>,
            ],
          }))}
        />
      </Section>

      <Section id="agents" title="Building with an agent">
        <P>
          The JSDoc block on every component — one line on what it is, a
          runnable example, and a sentence on when to reach for something else —
          is written to be read by a coding agent, not just by a human hovering
          a prop. Because the package ships source, that block is in{' '}
          <C>node_modules</C> where an agent can grep for it.
        </P>
        <P>
          On top of that the package ships an agent skill. Run{' '}
          <C>npx antkit-skills</C> and it is linked into{' '}
          <C>.claude/skills/antkit-react</C> — a symlink into{' '}
          <C>node_modules</C>, so the instructions stay pinned to the version
          you actually have installed. It carries the API, the near-neighbour
          choices, the traps, and a generated catalogue of every component, so
          an agent can check whether a name exists before importing it.
        </P>
        <P>
          If your agent speaks <C>MCP</C>, <C>@antkit/mcp</C> serves the same
          material as tools it can query rather than a document it has to read —{' '}
          <C>list_components</C>, <C>get_component</C>, <C>search_components</C>
          , <C>get_guide</C>. It answers from the version installed in the
          project, so a name it returns is a name that exists.{' '}
          <A href="/installation/mcp">Installation</A> has the setup.
        </P>
      </Section>

      <Section id="packages" title="The packages">
        <Table
          head={['Package', 'What it is']}
          rows={[
            {
              key: 'react',
              cells: [
                <C key="name">@antkit/react</C>,
                'The components. React 19 peer, source-shipped, side-effect free.',
              ],
            },
            {
              key: 'styles',
              cells: [
                <C key="name">@antkit/styles</C>,
                'One CSS file: colour, radius and font tokens, plus the dark variant.',
              ],
            },
            {
              key: 'editor',
              cells: [
                <C key="name">@antkit/react/rich-text-editor</C>,
                'The TipTap editor, behind a subpath and optional peers.',
              ],
            },
          ]}
        />
        <P>
          MIT licensed, developed at{' '}
          <A href="https://github.com/zocheck/antkit">
            github.com/zocheck/antkit
          </A>
          . Ready to install? <A href="/installation">Installation</A> is two
          commands and a stylesheet.
        </P>
      </Section>
    </>
  );
};
