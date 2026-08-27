import { useState } from 'react';

import { Label, Select } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const ROLES = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
  { label: 'Billing (not enabled)', value: 'billing', disabled: true },
];

const GROUPED = [
  {
    label: 'Academics',
    options: [
      { label: 'Course management', value: 'course' },
      { label: 'Question bank', value: 'exam' },
    ],
  },
  {
    label: 'System',
    options: [
      { label: 'Users', value: 'user' },
      { label: 'Permissions', value: 'role' },
    ],
  },
];

export const meta: DemoMeta = {
  imports: ['Select'],
  extraImports: [
    "import type { SelectOption, SelectValue } from '@antkit/react';",
  ],
  api: [
    {
      title: 'Select',
      props: [
        {
          name: 'options',
          type: '(SelectOption | SelectOptionGroup)[]',
          description:
            'A flat list or a grouped one; the two can be mixed. Required.',
        },
        {
          name: 'value',
          type: 'string | string[] | undefined',
          description:
            'A string in single mode, an array in multiple and tags.',
        },
        {
          name: 'onChange',
          type: '(value: SelectValue) => void',
          description:
            'Receives a `string` when single, `string[]` when multiple.',
        },
        {
          name: 'mode',
          type: "'multiple' | 'tags'",
          description:
            'Left out, it selects one. `multiple` selects several, shown as removable tags. `tags` is multiple plus the right to create values that are not in the list.',
        },
        {
          name: 'showSearch',
          type: 'boolean',
          description: 'On by default in multiple/tags, off in single.',
        },
        {
          name: 'allowClear',
          type: 'boolean',
          default: 'false',
          description: 'Shows the button that clears the selection.',
        },
        {
          name: 'maxTagCount',
          type: 'number',
          description: 'Past this many, the remainder folds into "+N".',
        },
        {
          name: 'placeholder',
          type: 'string',
          description: 'The greyed text before anything is chosen.',
        },
        {
          name: 'searchPlaceholder',
          type: 'string',
          description: 'The greyed text in the search box.',
        },
        {
          name: 'notFoundContent',
          type: 'ReactNode',
          description:
            'Replaces the empty block when the filter finds nothing. Left out, it uses `Empty` — icon and all.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Shows a spinner and locks interaction.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the select.',
        },
        {
          name: 'onBlur',
          type: '() => void',
          description:
            'Needed by Form.Item to know the field has been touched.',
        },
      ],
    },
    {
      title: 'SelectOption / SelectOptionGroup',
      props: [
        { name: 'label', type: 'string', description: 'The text shown.' },
        { name: 'value', type: 'string', description: 'The value behind it.' },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Locks one option on its own.',
        },
        {
          name: 'options',
          type: 'SelectOption[]',
          description: 'With this field present, the entry is read as a group.',
        },
      ],
    },
  ],
};

/**
 * Single
 */
export const Single = () => {
  const [role, setRole] = useState<string>();

  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label>Role</Label>
      <Select
        options={ROLES}
        value={role}
        onChange={(value) => setRole(value as string)}
        allowClear
        placeholder="Pick a role"
      />
    </div>
  );
};

/**
 * With a search box
 *
 * `showSearch` puts a filter inside the list — needed once the list runs past
 * one screen.
 */
export const Searchable = () => (
  <Select
    className="max-w-xs"
    options={ROLES}
    showSearch
    allowClear
    placeholder="Type to search"
    searchPlaceholder="Search roles…"
    notFoundContent="No matching role"
  />
);

/**
 * Multiple
 *
 * `maxTagCount` folds the remainder into "+N" so the field does not grow taller
 * with every choice.
 */
export const Multiple = () => {
  const [roles, setRoles] = useState<string[]>(['admin', 'editor']);

  return (
    <div className="grid w-full max-w-xs gap-2">
      <Select
        mode="multiple"
        options={ROLES}
        value={roles}
        onChange={(value) => setRoles(value as string[])}
        maxTagCount={2}
        allowClear
      />
      <p className="text-xs text-muted-foreground">
        Selected: {roles.join(', ') || '—'}
      </p>
    </div>
  );
};

/**
 * Tags mode
 *
 * Type something that is not in the list and press Enter to create it.
 */
export const Tags = () => {
  const [tags, setTags] = useState<string[]>(['vip']);

  return (
    <Select
      className="max-w-xs"
      mode="tags"
      options={[
        { label: 'vip', value: 'vip' },
        { label: 'prospect', value: 'prospect' },
      ]}
      value={tags}
      onChange={(value) => setTags(value as string[])}
      allowClear
    />
  );
};

/**
 * Grouped options
 *
 * An entry with `options` is read as a group; mixing them with flat entries is
 * fine, and the flat ones land in an unnamed group.
 */
export const Grouped = () => (
  <Select
    className="max-w-xs"
    options={GROUPED}
    showSearch
    placeholder="Pick a permission"
  />
);

/**
 * States
 */
export const States = () => (
  <div className="grid w-full max-w-xs gap-2">
    <Select options={ROLES} loading placeholder="Loading…" />
    <Select options={ROLES} disabled placeholder="Locked" />
    <Select options={ROLES} aria-invalid placeholder="Nothing chosen" />
  </div>
);
