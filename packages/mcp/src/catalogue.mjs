import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Everything this server answers with comes out of the copy of `@antkit/react`
 * the consumer installed — never a snapshot baked in here. A catalogue bundled
 * into this package would drift the moment the two versions diverge, and an
 * agent would confidently import a component that isn't there yet.
 */
const resolveReact = () => {
  const override = process.env.ANTKIT_REACT_PATH;
  if (override) return override;

  // From the project being worked on first, then from this package — the
  // second covers `npx` and the monorepo, where the cwd may be anywhere.
  const candidates = [
    createRequire(pathToFileURL(join(process.cwd(), 'noop.js'))),
    createRequire(import.meta.url),
  ];

  for (const require of candidates) {
    try {
      return dirname(require.resolve('@antkit/react/package.json'));
    } catch {
      continue;
    }
  }

  throw new Error(
    'Cannot find @antkit/react. Run this server from a project that depends ' +
      'on it, or set ANTKIT_REACT_PATH to the package directory.',
  );
};

const SKILL = 'skills/antkit-react';

export const load = async () => {
  const root = resolveReact();

  const [manifest, catalogue, guide] = await Promise.all([
    readFile(join(root, 'package.json'), 'utf8'),
    readFile(join(root, SKILL, 'catalogue.json'), 'utf8').catch(() => null),
    readFile(join(root, SKILL, 'SKILL.md'), 'utf8').catch(() => null),
  ]);

  if (!catalogue) {
    throw new Error(
      `@antkit/react at ${root} ships no ${SKILL}/catalogue.json — it predates ` +
        'the MCP server. Upgrade it, or pin @antkit/mcp to a matching version.',
    );
  }

  const parsed = JSON.parse(catalogue);
  const version = JSON.parse(manifest).version;

  // SKILL.md opens with frontmatter that exists to make an agent *load* the
  // skill. A caller of `get_guide` has already decided to read it, so the
  // trigger copy is noise — hand back the body.
  const body = guide?.replace(/^---\n[\s\S]*?\n---\n+/, '') ?? null;

  /**
   * One lookup for every name an agent might reasonably type: the slug, the
   * page title, and each exported value. `Toaster` and `Title` are the reason
   * — neither matches its page's slug.
   */
  const index = new Map();
  const add = (key, component) => {
    const folded = key.toLowerCase().replace(/[^a-z\d]/g, '');
    if (folded && !index.has(folded)) index.set(folded, component);
  };

  for (const component of parsed.components) {
    add(component.slug, component);
    add(component.title, component);
  }
  // Exports go in a second pass so a page never loses its own name to another
  // page's export — `Calendar` is exported from `date-picker`.
  for (const component of parsed.components) {
    for (const value of component.exports) add(value, component);
  }

  return { root, version, guide: body, index, ...parsed };
};

export const find = (data, name) =>
  data.index.get(
    String(name)
      .toLowerCase()
      .replace(/[^a-z\d]/g, ''),
  );
