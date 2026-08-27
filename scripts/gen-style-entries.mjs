#!/usr/bin/env node
/**
 * Writes one CSS entry per component, so an app can pay for the classes of
 * the components it uses instead of all of them.
 *
 *   @import '@antkit/react/styles/base.css';
 *   @import '@antkit/react/styles/select.css';
 *
 * Every path inside these files is relative to the package, which is the whole
 * point: the app never has to guess where its node_modules put us, and a
 * component's entry already carries the components it renders internally —
 * `select.css` brings `popover` because `Select` renders one. Getting that
 * list wrong is invisible until a dropdown lands in the wrong place, so it is
 * derived here rather than left to the reader.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'packages/react/src/components');
const OUT = join(ROOT, 'packages/react/styles');
const check = process.argv.includes('--check');

const folders = (await readdir(SRC, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

/** Which other component folders a folder's own files import from. */
const direct = new Map();
for (const folder of folders) {
  const files = (await readdir(join(SRC, folder))).filter((f) =>
    /\.tsx?$/.test(f),
  );
  const found = new Set();
  for (const file of files) {
    const source = await readFile(join(SRC, folder, file), 'utf8');
    for (const [, dep] of source.matchAll(
      /from '\.\.\/([\w-]+)(?:\/[^']*)?'/g,
    )) {
      if (folders.includes(dep) && dep !== folder) found.add(dep);
    }
  }
  direct.set(folder, found);
}

const closure = (start) => {
  const seen = new Set();
  const queue = [start];
  while (queue.length) {
    const next = queue.pop();
    if (seen.has(next)) continue;
    seen.add(next);
    for (const dep of direct.get(next) ?? []) queue.push(dep);
  }
  return [...seen].sort();
};

const written = [];
const emit = (name, body) => written.push({ name, body });

emit(
  'base.css',
  `/* Design tokens only — no component classes. Pair it with one entry per\n * component you use, or with '@antkit/react/styles.css' for all of them. */\n@import '@antkit/styles';\n`,
);

for (const folder of folders) {
  const needs = closure(folder);
  const also = needs.filter((one) => one !== folder);
  emit(
    `${folder}.css`,
    [
      `/* ${folder}${also.length ? `, and the components it renders: ${also.join(', ')}` : ''} */`,
      `@import './base.css';`,
      ...needs.map((one) => `@source '../src/components/${one}';`),
      '',
    ].join('\n'),
  );
}

if (check) {
  const stale = [];
  for (const { name, body } of written) {
    const current = await readFile(join(OUT, name), 'utf8').catch(() => null);
    if (current !== body) stale.push(name);
  }
  console.log(
    stale.length
      ? `stale: ${stale.join(', ')}`
      : `${written.length} style entries up to date.`,
  );
  process.exit(stale.length ? 1 : 0);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
for (const { name, body } of written) await writeFile(join(OUT, name), body);
console.log(`${written.length} style entries → packages/react/styles/`);
