import { useState } from 'react';

import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@antkit/react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Dropzone', 'DropzoneEmptyState', 'DropzoneContent'],
  api: [
    {
      title: 'Dropzone',
      description:
        'The component holds no files of its own: `src` is the single source of truth, and type, size and count are checked here — both halves of the outcome come back through `onDrop`, so a rejected file can be reported rather than vanishing quietly.',
      props: [
        {
          name: 'src',
          type: 'File[] | null',
          description: 'The files currently held, owned by the caller.',
        },
        {
          name: 'onDrop',
          type: '(accepted: File[], rejected: FileRejection[]) => void',
          description:
            'The accepted and rejected files from one drop or one selection.',
        },
        {
          name: 'onError',
          type: '(error: Error) => void',
          description: 'Called once per drop that had any rejection.',
        },
        {
          name: 'onRemove',
          type: '(file: File, index: number) => void',
          description:
            'With this prop, every file in `DropzoneContent` grows a remove button.',
        },
        {
          name: 'accept',
          type: 'string | Record<string, string[]>',
          description: 'Which file types are allowed, e.g. `"image/*"`.',
        },
        {
          name: 'maxFiles',
          type: 'number',
          description:
            'A limit per drop, not per session — files already held do not count against it.',
        },
        {
          name: 'maxSize / minSize',
          type: 'number',
          description: 'Size limits, in bytes.',
        },
        {
          name: 'multiple',
          type: 'boolean',
          default: 'true',
          description: 'Allows several files at once.',
        },
        {
          name: 'name / form / required',
          type: 'string | boolean',
          description: 'Lets a plain HTML form carry the chosen files.',
        },
        {
          name: 'labels',
          type: 'Partial<DropzoneLabels>',
          description:
            'Changes the title, the description, the remove label and the line about the limits.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the drop area.',
        },
      ],
    },
    {
      title: 'DropzoneEmptyState / DropzoneContent',
      description:
        'Two faces of the same area: one draws when there are no files, the other lists the files being held. Put both inside `Dropzone`.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'Left out, the default layout is used; passed in, it replaces it entirely.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * Drag files in, or click to open the file picker.
 */
export const Basic = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-md">
      <Dropzone
        src={files}
        onDrop={(accepted) => setFiles(accepted)}
        onRemove={(_, index) =>
          setFiles(files.filter((__, position) => position !== index))
        }
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
};

/**
 * Type and size limits
 *
 * Rejected files come back through `onDrop` and `onError` — tell the user
 * rather than swallowing them.
 */
export const Limits = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-md">
      <Dropzone
        accept="image/*"
        maxFiles={3}
        maxSize={2 * 1024 * 1024}
        src={files}
        onDrop={(accepted, rejected) => {
          setFiles(accepted);
          if (rejected.length) {
            toast.error(`${rejected.length} file(s) rejected`);
          }
        }}
        onError={(error) => toast.error(error.message)}
        onRemove={(_, index) =>
          setFiles(files.filter((__, position) => position !== index))
        }
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
};

/**
 * A single file
 *
 * `multiple={false}` for a profile photo, or one contract document.
 */
export const Single = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-md">
      <Dropzone
        multiple={false}
        accept="application/pdf"
        src={files}
        onDrop={(accepted) => setFiles(accepted)}
        onRemove={() => setFiles([])}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
};

/**
 * Changing the wording
 *
 * `labels` takes one piece at a time; return `null` from `hint` and the line
 * about the limits disappears.
 */
export const Labels = () => (
  <div className="w-full max-w-md">
    <Dropzone
      accept="image/*"
      labels={{
        title: 'Drag images here',
        description: 'or click to pick them from your machine',
        hint: () => null,
      }}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  </div>
);

/**
 * Disabled
 */
export const Disabled = () => (
  <div className="w-full max-w-md">
    <Dropzone disabled>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  </div>
);
