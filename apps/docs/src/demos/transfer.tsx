import { useState } from 'react';

import { Transfer } from '@antkit/react';
import type { TransferItem } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const PERMISSIONS: TransferItem[] = [
  { key: 'perm-1', title: 'View courses', description: 'course.read' },
  { key: 'perm-2', title: 'Edit courses', description: 'course.write' },
  { key: 'perm-3', title: 'Delete courses', description: 'course.delete' },
  { key: 'perm-4', title: 'View students', description: 'student.read' },
  { key: 'perm-5', title: 'Export reports', description: 'report.export' },
  {
    key: 'perm-6',
    title: 'System administration',
    description: 'system.admin',
    disabled: true,
  },
];

export const meta: DemoMeta = {
  imports: ['Transfer'],
  extraImports: ["import type { TransferItem } from '@antkit/react';"],
  api: [
    {
      title: 'Transfer',
      props: [
        {
          name: 'dataSource',
          type: 'TransferItem[]',
          description: 'Every item across both columns. Required.',
        },
        {
          name: 'targetKeys',
          type: 'string[]',
          description: 'The keys of the items currently in the right column.',
        },
        {
          name: 'onChange',
          type: '(targetKeys: string[]) => void',
          description: 'Called with the new list of keys for the right column.',
        },
        {
          name: 'titles',
          type: '[ReactNode, ReactNode]',
          description: 'The headings, `[left, right]`.',
        },
        {
          name: 'showSearch',
          type: 'boolean',
          default: 'false',
          description: 'A filter box on both columns.',
        },
        {
          name: 'render',
          type: '(item: TransferItem) => ReactNode',
          description: 'Replaces how a row is drawn.',
        },
        {
          name: 'listHeight',
          type: 'number',
          default: '240',
          description: 'The list height in each column, in px.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks both columns.',
        },
      ],
    },
    {
      title: 'TransferItem',
      props: [
        { name: 'key', type: 'string', description: 'The item identifier.' },
        { name: 'title', type: 'string', description: 'The main line.' },
        {
          name: 'description',
          type: 'string',
          description: 'The smaller line beneath it.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Stops this item being moved.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Tick a few rows, then press an arrow to move them across.
 */
export const Basic = () => {
  const [assigned, setAssigned] = useState<string[]>(['perm-2']);

  return (
    <div className="grid w-full gap-2">
      <Transfer
        dataSource={PERMISSIONS}
        targetKeys={assigned}
        onChange={setAssigned}
        titles={['Available', 'Granted']}
      />
      <p className="text-xs text-muted-foreground">
        Granted: {assigned.join(', ') || '—'}
      </p>
    </div>
  );
};

/**
 * With a search box
 *
 * Each column filters on its own, which matters once the permission list runs
 * to dozens of rows.
 */
export const Searchable = () => (
  <Transfer
    className="w-full"
    dataSource={PERMISSIONS}
    showSearch
    titles={['All', 'Selected']}
    listHeight={200}
  />
);

/**
 * Drawing the row yourself
 *
 * `render` is handed the whole item — here it folds the permission code onto
 * the same line instead of letting it wrap.
 */
export const CustomRender = () => (
  <Transfer
    className="w-full"
    dataSource={PERMISSIONS}
    render={(item) => (
      <span className="flex w-full items-center justify-between gap-3">
        {item.title}
        <code className="font-mono text-xs text-muted-foreground">
          {item.description}
        </code>
      </span>
    )}
  />
);

/**
 * Disabled
 */
export const Disabled = () => (
  <Transfer
    className="w-full"
    dataSource={PERMISSIONS}
    targetKeys={['perm-2', 'perm-4']}
    disabled
    listHeight={160}
  />
);
