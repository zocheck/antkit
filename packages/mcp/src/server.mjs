import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { find, load } from './catalogue.mjs';

const text = (body) => ({ content: [{ type: 'text', text: body }] });
const failure = (body) => ({ ...text(body), isError: true });

const importLine = (component) => {
  const values = component.exports.filter((value) => /^[A-Z]/.test(value));
  return `import { ${values.join(', ')} } from '${component.import}';`;
};

/** One line per component — the shape an agent skims before drilling in. */
const line = (component) =>
  `- **${component.title}** (\`${component.slug}\`) — ${component.summary}` +
  (component.import === '@antkit/react' ? '' : ` _(${component.import})_`);

const listing = (data, components) =>
  [
    `# @antkit/react ${data.version} — ${components.length} components`,
    '',
    ...data.groups.flatMap((group) => {
      const inGroup = components.filter((one) => one.group === group.id);
      if (inGroup.length === 0) return [];
      return [`## ${group.label}`, '', ...inGroup.map(line), ''];
    }),
    'Call `get_component` for the full contract: a runnable example, the',
    'near-neighbour to prefer, and the trap.',
  ].join('\n');

const detail = (component) =>
  [
    `# ${component.title}`,
    '',
    component.summary,
    '',
    '```tsx',
    importLine(component),
    '```',
    '',
    component.doc,
    '',
    component.props.length
      ? `## Props\n\n${component.props.map((prop) => `- \`${prop}\``).join('\n')}\n`
      : '',
    `## Exports\n\n${component.exports.map((value) => `\`${value}\``).join(' ')}`,
    '',
    `Source: \`@antkit/react/${component.file}\` — the doc block above is`,
    'the contract, and it lives there.',
  ].join('\n');

/**
 * Weighted because a query is usually a name or a prop, and a stray word in a
 * long doc block should never outrank an exact export.
 */
const score = (component, needle) => {
  const has = (haystack) => haystack.toLowerCase().includes(needle);

  return (
    (has(component.title) || has(component.slug) ? 6 : 0) +
    (component.exports.some(has) ? 4 : 0) +
    (component.props.some(has) ? 3 : 0) +
    (has(component.summary) ? 2 : 0) +
    (has(component.doc) ? 1 : 0)
  );
};

/** Levenshtein, bailing once the answer can only exceed `cap`. */
const distance = (a, b, cap) => {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;

  let row = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i += 1) {
    const next = [i];
    let best = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + cost);
      best = Math.min(best, next[j]);
    }
    if (best > cap) return cap + 1;
    row = next;
  }

  return row[b.length];
};

/**
 * Everything a caller might have meant by `Buton`. A typo is the common case,
 * so a plain substring test is not enough — `buton` contains no `button`.
 */
const nearest = (data, name) => {
  const needle = name.toLowerCase().replace(/[^a-z\d]/g, '');
  const cap = needle.length <= 4 ? 1 : 2;

  return data.components
    .map((component) => {
      const slug = component.slug.replace(/-/g, '');
      const near = slug.includes(needle) || needle.includes(slug);
      return {
        title: component.title,
        gap: near ? 0 : distance(needle, slug, cap),
      };
    })
    .filter((candidate) => candidate.gap <= cap)
    .toSorted((a, b) => a.gap - b.gap)
    .map((candidate) => candidate.title)
    .slice(0, 5);
};

export const createServer = async () => {
  const data = await load();

  const server = new McpServer(
    { name: 'antkit', version: data.version },
    {
      instructions:
        'Component reference for @antkit/react, read from the version ' +
        'installed in this project. Call list_components to see what exists, ' +
        'get_component before writing any component code, and get_guide for ' +
        'setup and the house rules. Never import a name that is not here.',
    },
  );

  server.registerTool(
    'list_components',
    {
      title: 'List components',
      description:
        'Every component in the installed @antkit/react, grouped as the docs ' +
        'group them, with its one-line summary. Optionally filter to one ' +
        'group. Use this to find out what exists before importing anything.',
      inputSchema: {
        group: z
          .enum(data.groups.map((group) => group.id))
          .optional()
          .describe('Restrict to one group, e.g. "dataEntry".'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ group }) =>
      text(
        listing(
          data,
          group
            ? data.components.filter((one) => one.group === group)
            : data.components,
        ),
      ),
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get one component',
      description:
        "One component's full contract: the import line, the doc block with a " +
        'runnable example, when to reach for a different component, the trap ' +
        'to avoid, its props and its exports. Read this before writing code ' +
        'that uses the component. Accepts a name or a slug — "DatePicker", ' +
        '"date-picker" and "Toaster" all work.',
      inputSchema: {
        name: z.string().describe('Component name, slug, or exported value.'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ name }) => {
      const component = find(data, name);
      if (component) return text(detail(component));

      const suggestions = nearest(data, name);
      return failure(
        `@antkit/react has no "${name}".` +
          (suggestions.length
            ? ` Did you mean: ${suggestions.join(', ')}?`
            : '') +
          ' Call list_components to see every name.',
      );
    },
  );

  server.registerTool(
    'search_components',
    {
      title: 'Search components',
      description:
        'Find the component for a job when you do not know its name — search ' +
        'over names, exports, props, summaries and doc blocks. Try a concept ' +
        '("multi select", "date range", "drag") or a prop ("dataSource").',
      inputSchema: {
        query: z.string().min(1).describe('What you are looking for.'),
        limit: z.number().int().min(1).max(25).optional(),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ query, limit = 8 }) => {
      const needle = query.toLowerCase();
      const hits = data.components
        .map((component) => ({ component, rank: score(component, needle) }))
        .filter((hit) => hit.rank > 0)
        .toSorted(
          (a, b) =>
            b.rank - a.rank || a.component.slug.localeCompare(b.component.slug),
        )
        .slice(0, limit);

      if (hits.length === 0) {
        return text(
          `Nothing in @antkit/react matches "${query}". The library has no ` +
            'component for every job — call list_components and compose from ' +
            'what is there rather than importing a name that does not exist.',
        );
      }

      return text(
        [
          `${hits.length} match${hits.length === 1 ? '' : 'es'} for "${query}":`,
          '',
          ...hits.map(({ component }) => line(component)),
          '',
          'Call `get_component` on whichever one fits.',
        ].join('\n'),
      );
    },
  );

  server.registerTool(
    'get_guide',
    {
      title: 'Get the usage guide',
      description:
        "The library's own agent guide: installing it, the required Tailwind " +
        '`@source` line, the root providers, the styling rules, the ' +
        'near-neighbour choices, and the things that will bite you. Read it ' +
        'once per project before writing UI.',
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () =>
      data.guide
        ? text(data.guide)
        : failure(
            `@antkit/react at ${data.root} ships no ${'skills/antkit-react/SKILL.md'}.`,
          ),
  );

  server.registerResource(
    'catalogue',
    'antkit://catalogue',
    {
      title: 'Component catalogue',
      description:
        'Every component as JSON: slug, group, summary, doc, props, exports.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              package: data.package,
              version: data.version,
              groups: data.groups,
              components: data.components,
            },
            null,
            2,
          ),
        },
      ],
    }),
  );

  server.registerResource(
    'guide',
    'antkit://guide',
    {
      title: 'Usage guide',
      description: 'The antkit-react agent skill, verbatim.',
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [
        { uri: uri.href, mimeType: 'text/markdown', text: data.guide ?? '' },
      ],
    }),
  );

  return server;
};
