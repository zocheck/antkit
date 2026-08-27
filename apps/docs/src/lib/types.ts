import type { ComponentType } from 'react';

/** One row of an API table. `type` is rendered as code, so keep it copy-pastable. */
export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

/** Components with parts (Card, Timeline, Tabs…) get one table per part. */
export type ApiTable = {
  title: string;
  description?: string;
  props: PropRow[];
};

export type DemoMeta = {
  /** Names to show in the page's import line. */
  imports: string[];
  /** Extra import lines, for types or icons a demo needs. */
  extraImports?: string[];
  api: ApiTable[];
};

/**
 * A demo module: one file per component, exporting `meta` plus one arrow
 * component per example. Every other export is treated as an example, in file
 * order, with its JSDoc block supplying the title and description.
 */
export type DemoModule = {
  meta: DemoMeta;
} & Record<string, ComponentType | DemoMeta>;

export type RegistryEntry = {
  /** URL segment, matching the demo file name. */
  slug: string;
  /** Heading on the page and label in the nav. */
  title: string;
  group: string;
  description: string;
};
