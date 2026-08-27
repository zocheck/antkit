#!/usr/bin/env node
/**
 * Links the skills shipped inside `@antkit/react` into the consuming project.
 *
 *   npx antkit-skills            # symlink into .claude/skills
 *   npx antkit-skills --copy     # copy instead, for agents that don't follow links
 *   npx antkit-skills --target .cursor/skills
 *
 * A symlink is the default because it points at `node_modules`, so the skill an
 * agent reads is always the one that shipped with the installed version. A copy
 * goes stale the first time anyone runs `pnpm update`.
 *
 * No postinstall hook: writing into someone's agent config is their call to
 * make, not something that should happen while they install a dependency.
 */
import {
  cp,
  lstat,
  mkdir,
  readdir,
  readlink,
  rm,
  symlink,
} from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'skills');

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const option = (name, fallback) => {
  const at = argv.indexOf(`--${name}`);
  return at === -1 ? fallback : (argv[at + 1] ?? fallback);
};

const targetDir = resolve(process.cwd(), option('target', '.claude/skills'));
const useCopy = flag('copy');
const force = flag('force');

/** Whether `path` is already the link we are about to write. */
const linksTo = async (path, destination) => {
  try {
    const stats = await lstat(path);
    if (!stats.isSymbolicLink()) return false;
    return resolve(dirname(path), await readlink(path)) === destination;
  } catch {
    return false;
  }
};

const exists = async (path) => {
  try {
    await lstat(path);
    return true;
  } catch {
    return false;
  }
};

const install = async (name) => {
  const from = join(SOURCE, name);
  const to = join(targetDir, name);

  if (await linksTo(to, from)) return `${name} — already linked`;

  if (await exists(to)) {
    if (!force)
      return `${name} — skipped, ${relative(process.cwd(), to)} exists (--force to replace)`;
    await rm(to, { force: true, recursive: true });
  }

  if (useCopy) {
    await cp(from, to, { recursive: true });
    return `${name} — copied`;
  }

  try {
    await symlink(relative(targetDir, from), to, 'dir');
    return `${name} — linked`;
  } catch (error) {
    // Windows refuses symlinks without developer mode or elevation.
    if (error.code !== 'EPERM' && error.code !== 'EACCES') throw error;
    await cp(from, to, { recursive: true });
    return `${name} — copied (symlink not permitted)`;
  }
};

const names = (await readdir(SOURCE, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

await mkdir(targetDir, { recursive: true });
for (const name of names) console.log(await install(name));
console.log(
  `\n${names.length} skill(s) → ${relative(process.cwd(), targetDir) || targetDir}`,
);
