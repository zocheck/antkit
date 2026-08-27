# Form

Declarative forms: rules on the field, no schema, no resolver.

```tsx
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@antkit/react';
```

A labelled, validated field.

`rules` is the whole validation story — no resolver, no separate schema:

```tsx
<Form.Item
  name="email"
  label="Email"
  rules={[{ required: true }, { type: 'email' }]}
>
  <Input />
</Form.Item>
```

The child control is cloned with `value`/`onChange`/`onBlur` and the aria ids,
so it does not need to know it is inside a form.


Source: `@antkit/react/src/components/form/form.tsx`
