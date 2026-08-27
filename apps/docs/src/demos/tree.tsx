import { useState } from 'react';

import { Tree } from '@antkit/react';
import type { TreeNode } from '@antkit/react';
import { FileTextIcon, FolderIcon } from 'lucide-react';
import { toast } from 'sonner';

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
  imports: ['Tree'],
  extraImports: ["import type { TreeNode } from '@antkit/react';"],
  api: [
    {
      title: 'Tree',
      description:
        'A hierarchy. Use `TreeSelect` when the point is to pick one value out of a tree and collapse it into a field.',
      props: [
        {
          name: 'data',
          type: 'TreeNode[]',
          description: 'The tree data. Required.',
        },
        {
          name: 'defaultExpandedKeys',
          type: 'string[]',
          description:
            'Which branches start open. Ignored when `expandedKeys` is given.',
        },
        {
          name: 'expandedKeys / onExpand',
          type: 'string[] | (keys: string[]) => void',
          description: 'The controlled expanded state.',
        },
        {
          name: 'selectedKeys / onSelect',
          type: 'string[] | (keys: string[], node: TreeNode) => void',
          description: 'Which branches are selected.',
        },
        {
          name: 'multiple',
          type: 'boolean',
          default: 'false',
          description:
            'Allows several branches to be selected. Ignored when `checkable` is on.',
        },
        {
          name: 'selectable',
          type: 'boolean',
          description:
            'What clicking the label does. It defaults to `!checkable`, so a checkable tree ticks when the label is clicked — the box is only 16px wide and everyone aims at the text.',
        },
        {
          name: 'checkable',
          type: 'boolean',
          default: 'false',
          description:
            'Adds a tick box to every branch, with parents reflecting their children.',
        },
        {
          name: 'checkedKeys / onCheck',
          type: 'string[] | (keys: string[], node: TreeNode) => void',
          description: 'Which branches are ticked.',
        },
        {
          name: 'showLines',
          type: 'boolean',
          default: 'false',
          description:
            'Draws connector lines from children back to their parent.',
        },
        {
          name: 'showIcons',
          type: 'boolean',
          default: 'false',
          description:
            'Uses folder and file icons for branches that carry none of their own.',
        },
        {
          name: 'indent',
          type: 'number',
          description:
            'How many px each level indents. The connector lines follow this value.',
        },
      ],
    },
    {
      title: 'TreeNode',
      props: [
        { name: 'key', type: 'string', description: 'The branch identifier.' },
        { name: 'label', type: 'ReactNode', description: 'What is displayed.' },
        {
          name: 'children',
          type: 'TreeNode[]',
          description: 'The child branches.',
        },
        { name: 'icon', type: 'ReactNode', description: 'An icon of its own.' },
        { name: 'disabled', type: 'boolean', description: 'Locks the branch.' },
        {
          name: 'isLeaf',
          type: 'boolean',
          description:
            'Marks it as a folder even before its children have been fetched.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Tree
    className="w-full max-w-sm"
    data={TREE}
    defaultExpandedKeys={['academy', 'system']}
    onSelect={(_, node) => toast(String(node.label))}
  />
);

/**
 * Ticking a whole branch
 *
 * Ticking a parent ticks the branch; the parent goes indeterminate when only
 * some children are ticked.
 */
export const Checkable = () => {
  const [checked, setChecked] = useState<string[]>(['course']);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Tree
        checkable
        data={TREE}
        defaultExpandedKeys={['academy', 'system']}
        checkedKeys={checked}
        onCheck={setChecked}
      />
      <p className="text-xs text-muted-foreground">
        Ticked: {checked.join(', ') || '—'}
      </p>
    </div>
  );
};

/**
 * Lines and icons
 */
export const LinesAndIcons = () => (
  <Tree
    className="w-full max-w-sm"
    showLines
    showIcons
    data={TREE}
    defaultExpandedKeys={['academy', 'system', 'role']}
  />
);

/**
 * A custom icon per branch
 */
export const CustomIcons = () => (
  <Tree
    className="w-full max-w-sm"
    defaultExpandedKeys={['docs']}
    data={[
      {
        key: 'docs',
        label: 'Documents',
        icon: <FolderIcon className="size-4 text-primary" />,
        children: [
          {
            key: 'contract',
            label: 'contract.pdf',
            icon: <FileTextIcon className="size-4 text-muted-foreground" />,
          },
          {
            key: 'invoice',
            label: 'invoice.pdf',
            icon: <FileTextIcon className="size-4 text-muted-foreground" />,
          },
        ],
      },
    ]}
  />
);

/**
 * Selecting several
 *
 * Several branches can be selected without tick boxes — for when the selection
 * is transient, a bulk delete say.
 */
export const Multiple = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Tree
        multiple
        data={TREE}
        defaultExpandedKeys={['academy']}
        selectedKeys={selected}
        onSelect={setSelected}
      />
      <p className="text-xs text-muted-foreground">
        Selected: {selected.join(', ') || '—'}
      </p>
    </div>
  );
};

/**
 * Indentation
 */
export const Indent = () => (
  <div className="grid w-full gap-4 sm:grid-cols-2">
    <Tree
      data={TREE}
      showLines
      indent={12}
      defaultExpandedKeys={['system', 'role']}
    />
    <Tree
      data={TREE}
      showLines
      indent={32}
      defaultExpandedKeys={['system', 'role']}
    />
  </div>
);
