# Dropzone

A drop area for files, with type, size and count limits.

```tsx
import { Dropzone, DropzoneContent, DropzoneEmptyState, DropzoneFile } from '@antkit/react';
```

A drop area that takes files from a drag or from the file dialog.

```tsx
<Dropzone
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  src={files}
  onDrop={(accepted) => setFiles(accepted)}
  onRemove={(_, index) => setFiles(files.filter((__, i) => i !== index))}
  onError={(error) => toast.error(error.message)}
>
  <DropzoneEmptyState />
  <DropzoneContent />
</Dropzone>
```

Validation happens here — type, size, count — and both sides of the outcome
come back through `onDrop`, so a rejected file can be reported rather than
silently dropped. The component holds no files of its own: whatever `src`
says is what it shows.

## Props

- `src`
- `onDrop`
- `onError`
- `onRemove`
- `accept`
- `maxFiles`
- `maxSize`
- `minSize`
- `multiple`
- `disabled`
- `name`
- `form`
- `required`
- `labels`

Source: `@antkit/react/src/components/dropzone/dropzone.tsx`
