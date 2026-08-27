import { useState } from 'react';

import { Label, TreeSelect } from '@antkit/react';
import type { TreeNode } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const TREE: TreeNode[] = [
  {
    key: 'academy',
    label: 'Academics',
    children: [
      { key: 'course', label: 'Course management' },
      { key: 'exam', label: 'Question bank' },
      { key: 'grade', label: 'Grades', disabled: true },
    ],
  },
  {
    key: 'system',
    label: 'System',
    children: [
      { key: 'user', label: 'Users' },
      {
        key: 'role',
        label: 'Permissions',
        children: [
          { key: 'role-admin', label: 'Administrator' },
          { key: 'role-staff', label: 'Staff' },
        ],
      },
    ],
  },
];

export const meta: DemoMeta = {
  imports: ['TreeSelect'],
  extraImports: ["import type { TreeNode } from '@antkit/react';"],
  api: [
    {
      title: 'TreeSelect',
      description:
        'Reach for TreeSelect when the tree has uneven depth and the structure itself matters; reach for `Cascader` when the levels are fixed and taken one at a time.',
      props: [
        {
          name: 'treeData',
          type: 'TreeNode[]',
          description: 'The tree of choices. Required.',
        },
        {
          name: 'value',
          type: 'string | string[]',
          description:
            'One key in single mode; an array of keys with `multiple` or `treeCheckable` on.',
        },
        {
          name: 'onChange',
          type: '(value: string | string[] | undefined) => void',
          description: 'Called when the selection changes.',
        },
        {
          name: 'treeCheckable',
          type: 'boolean',
          default: 'false',
          description:
            'Adds a tick box to every branch; ticking a parent takes the whole branch.',
        },
        {
          name: 'multiple',
          type: 'boolean',
          default: 'false',
          description:
            'Selects several branches without tick boxes. Ignored once `treeCheckable` is on.',
        },
        {
          name: 'showSearch',
          type: 'boolean',
          default: 'false',
          description:
            'A filter above the tree. A parent is kept when any of its descendants match.',
        },
        {
          name: 'treeDefaultExpandAll',
          type: 'boolean',
          default: 'false',
          description: 'Opens the whole tree to start with.',
        },
        {
          name: 'maxTagCount',
          type: 'number',
          description: 'Past this many, the remainder folds into "+N".',
        },
        {
          name: 'allowClear',
          type: 'boolean',
          default: 'false',
          description: 'The button that clears the selection.',
        },
        {
          name: 'notFoundContent',
          type: 'ReactNode',
          description:
            'Replaces the empty block when the filter finds nothing. Left out, it uses `Empty` — icon and all.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the whole field.',
        },
      ],
    },
    {
      title: 'TreeNode',
      props: [
        { name: 'key', type: 'string', description: 'The branch identifier.' },
        { name: 'label', type: 'ReactNode', description: 'The text shown.' },
        {
          name: 'children',
          type: 'TreeNode[]',
          description: 'The child branches.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'An icon for the branch.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Locks the branch.',
        },
      ],
    },
  ],
};

/**
 * Single
 */
export const Single = () => {
  const [value, setValue] = useState<string>();

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label>Permission</Label>
      <TreeSelect
        treeData={TREE}
        value={value}
        onChange={(next) => setValue(next as string)}
        treeDefaultExpandAll
        allowClear
        placeholder="Pick a permission"
      />
    </div>
  );
};

/**
 * Ticking a whole branch
 *
 * With `treeCheckable`, ticking a parent takes the branch; the parent goes
 * indeterminate when only some children are ticked.
 */
export const Checkable = () => {
  const [granted, setGranted] = useState<string[]>(['course']);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <TreeSelect
        treeData={TREE}
        treeCheckable
        value={granted}
        onChange={(next) => setGranted(next as string[])}
        treeDefaultExpandAll
        maxTagCount={2}
        allowClear
      />
      <p className="text-xs text-muted-foreground">
        Granted: {granted.join(', ') || '—'}
      </p>
    </div>
  );
};

/**
 * With a search box
 *
 * The filter keeps a parent when its descendants match — drop the parent and
 * the children lose their footing, and the reader loses the context.
 */
export const Searchable = () => (
  <TreeSelect
    className="max-w-sm"
    treeData={TREE}
    showSearch
    treeDefaultExpandAll
    placeholder="Type to filter"
    searchPlaceholder="Search permissions…"
    notFoundContent="No matching permission"
  />
);

/**
 * Several, without tick boxes
 */
export const Multiple = () => (
  <TreeSelect
    className="max-w-sm"
    treeData={TREE}
    multiple
    treeDefaultExpandAll
    allowClear
    placeholder="Pick several branches"
  />
);

/**
 * States
 */
export const States = () => (
  <div className="grid w-full max-w-sm gap-2">
    <TreeSelect treeData={TREE} disabled placeholder="Locked" />
    <TreeSelect
      treeData={TREE}
      aria-invalid
      placeholder="No permission chosen"
    />
  </div>
);
