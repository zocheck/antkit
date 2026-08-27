# TreeSelect

A select whose list is a tree with checkable branches.

```tsx
import { TreeSelect } from '@antkit/react';
```

A tree select: `Tree` in a dropdown, for picking from a
hierarchy — a category, a department, a permission node.

```tsx
<TreeSelect
  treeCheckable
  showSearch
  allowClear
  treeData={permissions}
  value={granted}
  onChange={setGranted}
  placeholder="Choose permissions"
/>
```

It takes `value`/`onChange`/`onBlur` and the aria props, so it drops straight
into a `Form.Item`.

When the options are a flat list, use `Select`; when the hierarchy is a fixed
number of levels the user drills through in order, `Cascader` reads better.

## Props

- `treeData`
- `value`
- `onChange`
- `onBlur`
- `treeCheckable`
- `multiple`
- `showSearch`
- `treeDefaultExpandAll`
- `allowClear`
- `placeholder`
- `searchPlaceholder`
- `notFoundContent`
- `disabled`
- `maxTagCount`
- `id`
- `name`
- `className`
- `aria-invalid`
- `aria-describedby`

Source: `@antkit/react/src/components/tree-select/tree-select.tsx`
