# Tree

A hierarchy with branch-wide checking, connector lines and icons.

```tsx
import { Tree } from '@antkit/react';
```

Hierarchical list with expand/collapse, selection and optional checkboxes.

```tsx
<Tree
  checkable
  data={[
    { key: 'academy', label: 'Academic', children: [
      { key: 'course', label: 'Courses' },
      { key: 'exam', label: 'Exams' },
    ]},
  ]}
  checkedKeys={checked}
  onCheck={setChecked}
/>
```

Expansion, selection and checking each work controlled or uncontrolled — pass
the `*Keys` prop to drive it yourself, leave it off to let the tree remember.

Checking a parent checks its whole subtree, and a parent shows the
indeterminate state while only some of its descendants are checked.

With `checkable` on, clicking a node's label ticks it — see `selectable` for
the rule and how to get a highlight and a tick at the same time.

`showLines` and `showIcons` turn it into a file-explorer view:

```tsx
<Tree showLines showIcons data={files} defaultExpandedKeys={['src']} />
```

## Props

- `data`
- `defaultExpandedKeys`
- `expandedKeys`
- `onExpand`
- `selectedKeys`
- `onSelect`
- `multiple`
- `selectable`
- `checkable`
- `checkedKeys`
- `onCheck`
- `showLines`
- `showIcons`
- `indent`
- `className`

Source: `@antkit/react/src/components/tree/tree.tsx`
