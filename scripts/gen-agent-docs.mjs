#!/usr/bin/env node
/**
 * Generates everything an agent reads, from the things a human already writes:
 * the doc block on each component, the docs registry, and the English locale.
 *
 *   node scripts/gen-agent-docs.mjs           # write
 *   node scripts/gen-agent-docs.mjs --check   # fail if anything is missing or stale
 *
 * Outputs:
 *   packages/react/skills/antkit-react/COMPONENTS.md   ships to npm with the skill
 *   apps/docs/public/llms.txt                          the index, per llmstxt.org
 *   apps/docs/public/llms-full.txt                     every doc block, one file
 *   apps/docs/public/c/<slug>.md                       one page per component
 *
 * The `.md` files exist because the docs site is a hash-routed SPA: an agent
 * fetching a component URL gets an empty shell. Static markdown is the only
 * thing it can actually read over HTTP.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS = join(ROOT, 'packages/react/src/components');
const SKILL = join(ROOT, 'packages/react/skills/antkit-react');
const PUBLIC = join(ROOT, 'apps/docs/public');

const check = process.argv.includes('--check');

/**
 * Where the generated markdown will be served from. Override once the docs
 * site has its own domain; the fallback is the GitHub Pages URL implied by the
 * repository field rather than a hostname nobody has registered.
 */
const SITE = (
  process.env.ANTKIT_DOCS_URL ?? 'https://zocheck.github.io/antkit'
).replace(/\/$/, '');

// ─── reading the sources of truth ──────────────────────────────────────────

const read = (path) => readFile(path, 'utf8');

/** `input-number` → `InputNumber`. */
const pascal = (slug) =>
  slug.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());

/**
 * The two docs pages that do not map onto a folder of their own: `Calendar` is
 * exported from `date-picker/`, and `Toast` is the kit's Sonner wrapper. Both
 * document a single file inside a shared folder, so they list that file's
 * exports rather than the whole folder's.
 */
const ALIASES = new Map([
  ['calendar', { dir: 'date-picker', file: 'calendar.tsx', name: 'Calendar' }],
  ['toast', { dir: 'sonner', file: 'sonner.tsx', name: 'Toaster' }],
]);

/**
 * Components that are not in the root barrel. Everything absent from this map
 * imports from `@antkit/react`; an agent reading the catalogue should never
 * have to know which is which.
 */
const SUBPATHS = new Map([
  ['rich-text-editor', '@antkit/react/rich-text-editor'],
]);

/**
 * The registry is TypeScript, and importing it would mean a build step for a
 * file that is a flat list of literals. One regex is the honest trade.
 */
const readRegistry = async () => {
  const raw = await read(join(ROOT, 'apps/docs/src/registry.ts'));
  const entries = [
    ...raw.matchAll(
      /\{\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',\s*group:\s*'([^']+)'/g,
    ),
  ];
  return entries.map(([, slug, title, group]) => ({ slug, title, group }));
};

/** The `components` map out of the English locale — one line per slug. */
const readSummaries = async () => {
  const raw = await read(join(ROOT, 'apps/docs/src/lib/locales/en.ts'));
  const block = raw.slice(raw.indexOf('\n  components: {'));
  const lines = [
    ...block.matchAll(/^\s{4}'?([\w-]+)'?:\s*'((?:[^'\\]|\\.)*)'/gm),
  ];
  return new Map(
    lines.map(([, slug, text]) => [slug, text.replace(/\\'/g, "'")]),
  );
};

const readGroups = async () => {
  const raw = await read(join(ROOT, 'apps/docs/src/lib/types.ts'));
  const list = raw.match(/export const GROUPS = \[([\s\S]*?)\] as const/);
  return [...list[1].matchAll(/'([^']+)'/g)].map(([, id]) => id);
};

// ─── parsing one component ─────────────────────────────────────────────────

/** Every `/** … *\/` block in a file, with the source position it ends at. */
const docBlocks = (source) =>
  [...source.matchAll(/\/\*\*[\s\S]*?\*\//g)].map((match) => ({
    raw: match[0],
    end: match.index + match[0].length,
    text: match[0]
      .slice(3, -2)
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, ''))
      .join('\n')
      .trim(),
  }));

/**
 * The contract block is the one carrying the runnable example. Anything else
 * in the file documents a prop or explains a workaround, and neither is the
 * component's contract.
 */
const contractBlock = (source, name) => {
  const blocks = docBlocks(source);
  const withExample = blocks.find((block) => block.text.includes('```tsx'));
  if (withExample) return withExample;

  const declaration = new RegExp(`^(?:export )?const ${name}\\b`, 'm').exec(
    source,
  );
  if (!declaration) return null;

  return blocks.filter((block) => block.end < declaration.index).at(-1) ?? null;
};

/** Value exports are the API surface; types are noise in a catalogue. */
const valueExports = (source) => {
  const names = new Set();

  for (const [, name] of source.matchAll(
    /^export (?:const|function|class) (\w+)/gm,
  )) {
    names.add(name);
  }

  for (const [, body] of source.matchAll(/^export \{([^}]*)\}/gm)) {
    for (const part of body.split(',')) {
      const clause = part.trim();
      if (!clause || clause.startsWith('type ')) continue;
      names.add((clause.split(/\s+as\s+/).at(-1) ?? clause).trim());
    }
  }

  return names;
};

/**
 * What the folder's `index.ts` actually re-exports. Scanning every file in the
 * folder instead would advertise `date-picker`'s internal helpers as API, and
 * an agent would import one and find it missing from the barrel.
 */
const publicExports = async (dir, files) => {
  const index = await read(join(dir, 'index.ts'));
  const names = valueExports(index);

  for (const [, stem] of index.matchAll(/^export \* from '\.\/([\w.-]+)'/gm)) {
    const file = files.find(
      (candidate) => candidate.replace(/\.tsx?$/, '') === stem,
    );
    if (!file) continue;
    for (const value of valueExports(await read(join(dir, file))))
      names.add(value);
  }

  return names;
};

/**
 * Prop names of the component's own props type, in declaration order. Only the
 * top level — a nested option object is the prop, not its contents.
 */
const propNames = (source, name) => {
  const start = source.search(new RegExp(`^export type ${name}Props\\b`, 'm'));
  if (start === -1) return [];

  let depth = 0;
  let end = start;
  for (let i = source.indexOf('=', start); i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
    if (source[i] === ';' && depth === 0 && i > start) {
      end = i;
      break;
    }
  }

  const body = source.slice(start, end);
  const names = [];
  let level = 0;

  for (const line of body.split('\n')) {
    // Any indent, not a fixed one: `= {` puts props two spaces in, while an
    // intersection — `ComponentProps<'div'> & {` — puts them four.
    const declaration = level === 1 && line.match(/^\s+'?([\w$-]+)'?\??:/);
    if (declaration) names.push(declaration[1]);

    level +=
      (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
  }

  return names;
};

const parseComponent = async (slug) => {
  const alias = ALIASES.get(slug);
  const folder = alias?.dir ?? slug;
  const dir = join(COMPONENTS, folder);
  const files = (await readdir(dir)).filter((file) => /\.tsx?$/.test(file));
  const name = alias?.name ?? pascal(slug);

  const main =
    alias?.file ??
    (files.includes(`${slug}.tsx`) ? `${slug}.tsx` : `${slug}.ts`);
  const source = await read(join(dir, main));

  const exports = alias
    ? valueExports(source)
    : await publicExports(dir, files);
  const block = contractBlock(source, name);

  return {
    slug,
    name,
    file: `src/components/${folder}/${main}`,
    doc: block?.text ?? null,
    summary: block ? block.text.split('\n\n')[0].replace(/\s+/g, ' ') : null,
    exports: [...exports].sort(),
    props: propNames(source, name),
  };
};

// ─── rendering ─────────────────────────────────────────────────────────────

const label = (group) =>
  group
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());

const componentsMarkdown = (groups, byGroup, summaries) => {
  const sections = groups
    .filter((group) => byGroup.get(group)?.length)
    .map((group) => {
      const rows = byGroup.get(group).map(({ entry, parsed }) => {
        const exports = parsed.exports.map((value) => `\`${value}\``).join(' ');
        const props = parsed.props
          .slice(0, 10)
          .map((prop) => `\`${prop}\``)
          .join(' ');
        const extra =
          parsed.props.length > 10 ? ` +${parsed.props.length - 10}` : '';
        const line = summaries.get(entry.slug) ?? parsed.summary ?? '';
        return `| ${exports} | ${line.replace(/\|/g, '\\|')} | ${props}${extra} |`;
      });

      return [
        `## ${label(group)}`,
        '',
        '| Exports | What it is | Props |',
        '| --- | --- | --- |',
        ...rows,
        '',
      ].join('\n');
    });

  return [
    '# @antkit/react — every component',
    '',
    'Generated from the source. If a name is not here, the library does not',
    'have it — do not import it and hope.',
    '',
    'Import everything from the package root. The full contract for a component',
    '— a runnable example, the near-neighbour to prefer, the trap — is the doc',
    'block on its source file, at',
    '`node_modules/@antkit/react/src/components/<slug>/<slug>.tsx`.',
    '',
    '`RichTextEditor` is the exception: it is not in the root barrel. Import it',
    'from `@antkit/react/rich-text-editor`, lazily.',
    '',
    ...sections,
  ].join('\n');
};

const pageMarkdown = (entry, parsed, summary) =>
  [
    `# ${entry.title}`,
    '',
    summary ?? '',
    '',
    `\`\`\`tsx`,
    `import { ${parsed.exports.filter((value) => /^[A-Z]/.test(value)).join(', ')} } from '@antkit/react';`,
    '```',
    '',
    parsed.doc ?? '',
    '',
    parsed.props.length
      ? `## Props\n\n${parsed.props.map((prop) => `- \`${prop}\``).join('\n')}\n`
      : '',
    `Source: \`@antkit/react/${parsed.file}\``,
    '',
  ].join('\n');

const llmsIndex = (groups, byGroup, summaries) =>
  [
    '# @antkit/react',
    '',
    '> Declarative React components on Radix primitives and Tailwind v4 tokens.',
    `> ${[...byGroup.values()].flat().length} components, source-shipped and tree-shakeable. No theme object,`,
    '> no CSS preprocessor, no generated class cascade.',
    '',
    '- Import from the package root; the barrel tree-shakes and deep paths are not public API.',
    '- Colours are tokens (`bg-primary`, `text-muted-foreground`), never a raw palette shade.',
    "- The consuming app needs `@import '@antkit/react/styles.css'` in its CSS, after Tailwind.",
    '',
    ...groups
      .filter((group) => byGroup.get(group)?.length)
      .flatMap((group) => [
        `## ${label(group)}`,
        '',
        ...byGroup.get(group).map(({ entry, parsed }) => {
          const line = summaries.get(entry.slug) ?? parsed.summary ?? '';
          return `- [${entry.title}](${SITE}/c/${entry.slug}.md): ${line}`;
        }),
        '',
      ]),
    '## Optional',
    '',
    `- [Everything, inlined](${SITE}/llms-full.txt): every doc block in one file.`,
    '',
  ].join('\n');

/**
 * The same catalogue as `COMPONENTS.md`, in the shape a program wants. It
 * ships inside the package so `@antkit/mcp` can answer from the version the
 * consumer actually installed rather than from a copy baked into itself.
 *
 * Deliberately no timestamp and no version field: `pnpm check:docs` compares
 * bytes, so anything that moves on its own would make CI fail on a clean tree.
 */
const catalogueJson = (groups, byGroup, summaries) =>
  `${JSON.stringify(
    {
      package: '@antkit/react',
      groups: groups
        .filter((group) => byGroup.get(group)?.length)
        .map((group) => ({ id: group, label: label(group) })),
      components: groups
        .filter((group) => byGroup.get(group)?.length)
        .flatMap((group) =>
          byGroup.get(group).map(({ entry, parsed: component }) => ({
            slug: entry.slug,
            title: entry.title,
            group,
            summary: summaries.get(entry.slug) ?? component.summary ?? '',
            doc: component.doc ?? '',
            exports: component.exports,
            props: component.props,
            file: component.file,
            import: SUBPATHS.get(entry.slug) ?? '@antkit/react',
          })),
        ),
    },
    null,
    2,
  )}\n`;

// ─── writing, or checking ──────────────────────────────────────────────────

const written = [];

const emit = async (path, content) => {
  written.push({ path, content });
  if (check) return;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
};

const verify = async () => {
  const stale = [];
  for (const { path, content } of written) {
    const current = await read(path).catch(() => null);
    if (current !== content) stale.push(path.replace(`${ROOT}/`, ''));
  }
  return stale;
};

// ─── main ──────────────────────────────────────────────────────────────────

const [registry, summaries, groups] = await Promise.all([
  readRegistry(),
  readSummaries(),
  readGroups(),
]);

const slugs = (await readdir(COMPONENTS, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const registered = new Set(registry.map((entry) => entry.slug));
const parsed = new Map();
const problems = [];

for (const slug of new Set([...slugs, ...registered])) {
  try {
    parsed.set(slug, await parseComponent(slug));
  } catch {
    problems.push(`${slug} — in the registry, but no source to document it`);
  }
}

/** A folder reached only through an alias page is documented under that page. */
const aliased = new Set([...ALIASES.values()].map((alias) => alias.dir));

for (const slug of slugs) {
  if (aliased.has(slug) || registered.has(slug)) continue;
  problems.push(`${slug} — missing from apps/docs/src/registry.ts`);
}

for (const [slug, component] of parsed) {
  if (!component.doc) {
    problems.push(`${slug} — no doc block on ${component.file}`);
  } else if (!component.doc.includes('```tsx')) {
    problems.push(`${slug} — doc block has no \`\`\`tsx example`);
  }
  if (registered.has(slug) && !summaries.has(slug)) {
    problems.push(`${slug} — missing from apps/docs/src/lib/locales/en.ts`);
  }
}

const byGroup = new Map(groups.map((group) => [group, []]));
for (const entry of registry) {
  const component = parsed.get(entry.slug);
  if (component) byGroup.get(entry.group)?.push({ entry, parsed: component });
}

await emit(
  join(SKILL, 'COMPONENTS.md'),
  componentsMarkdown(groups, byGroup, summaries),
);
await emit(
  join(SKILL, 'catalogue.json'),
  catalogueJson(groups, byGroup, summaries),
);
await emit(join(PUBLIC, 'llms.txt'), llmsIndex(groups, byGroup, summaries));

for (const entry of registry) {
  const component = parsed.get(entry.slug);
  if (!component) continue;
  await emit(
    join(PUBLIC, 'c', `${entry.slug}.md`),
    pageMarkdown(entry, component, summaries.get(entry.slug)),
  );
}

await emit(
  join(PUBLIC, 'llms-full.txt'),
  [
    llmsIndex(groups, byGroup, summaries),
    '---',
    '',
    ...registry.flatMap((entry) => {
      const component = parsed.get(entry.slug);
      return component
        ? [pageMarkdown(entry, component, summaries.get(entry.slug)), '---', '']
        : [];
    }),
  ].join('\n'),
);

if (check) {
  const stale = await verify();
  const failures = [
    ...problems,
    ...stale.map((path) => `${path} — out of date, run \`pnpm gen:docs\``),
  ];

  if (failures.length) {
    console.error(`\n${failures.length} problem(s):\n`);
    for (const failure of failures) console.error(`  ${failure}`);
    console.error('');
    process.exit(1);
  }

  console.log(
    `${slugs.length} components documented, ${written.length} generated files up to date.`,
  );
} else {
  // A slug that disappears has to take its page with it, or the site keeps
  // serving a component that no longer exists.
  const keep = new Set(registry.map((entry) => `${entry.slug}.md`));
  for (const file of await readdir(join(PUBLIC, 'c')).catch(() => [])) {
    if (!keep.has(file)) await rm(join(PUBLIC, 'c', file));
  }

  console.log(`${slugs.length} components → ${written.length} files`);
  if (problems.length) {
    console.warn(
      `\n${problems.length} problem(s) — \`pnpm check:docs\` will fail:\n`,
    );
    for (const problem of problems) console.warn(`  ${problem}`);
  }
}
