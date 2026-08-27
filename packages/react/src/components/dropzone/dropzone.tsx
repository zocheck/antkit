import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ComponentProps, DragEvent, ReactNode } from 'react';

import { cn } from '../../utils';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { useLocale } from '../../lib/config';
import type { Locale } from '../../lib/config';

export type FileRejectionCode =
  | 'file-invalid-type'
  | 'file-too-large'
  | 'file-too-small'
  | 'too-many-files';

export type FileRejection = {
  file: File;
  code: FileRejectionCode;
  message: string;
};

/**
 * Either the plain `accept` attribute (`'image/*,.pdf'`) or the react-dropzone
 * shape (`{ 'image/*': ['.png'] }`), so snippets from either world drop in.
 */
export type DropzoneAccept = string | Record<string, string[]>;

const DROPZONE_LABELS: Required<NonNullable<Locale['dropzone']>> = {
  title: 'Drop files here',
  description: 'or click to choose from your device',
  remove: 'Remove file',
  files: (count) => `${count} file${count === 1 ? '' : 's'} selected`,
  hint: ({ accept, minSize, maxSize, maxFiles }) => {
    const parts: string[] = [];

    if (accept) parts.push(accept);
    if (minSize && maxSize) {
      parts.push(`${formatBytes(minSize)} – ${formatBytes(maxSize)}`);
    } else if (maxSize) parts.push(`up to ${formatBytes(maxSize)}`);
    else if (minSize) parts.push(`at least ${formatBytes(minSize)}`);
    if (maxFiles && maxFiles > 1) parts.push(`up to ${maxFiles} files`);

    return parts.length ? parts.join(' · ') : null;
  },
  rejectedType: (name) => `${name}: file type not accepted`,
  rejectedTooLarge: (name, max) => `${name}: larger than ${max}`,
  rejectedTooSmall: (name, min) => `${name}: smaller than ${min}`,
  rejectedTooMany: (name, limit) => `${name}: over the ${limit} file limit`,
};

export type DropzoneLabels = {
  title: string;
  description: string;
  remove: string;
  /** Reads the constraints back to the user; `null` hides the line. */
  hint: (options: {
    accept?: string;
    minSize?: number;
    maxSize?: number;
    maxFiles?: number;
  }) => ReactNode;
  files: (count: number) => string;
};

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

/** Shared so an unset `src` doesn't hand the context a new array every render. */
const EMPTY_FILES: File[] = [];

/** `1536` → `1.5 KB`. Binary steps, because that is what file managers show. */
export const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${UNITS[exponent]}`;
};

const toAcceptList = (accept: DropzoneAccept | undefined): string[] => {
  if (!accept) return [];
  if (typeof accept === 'string') {
    return accept
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  // The object form carries both the MIME type and its extensions; either one
  // is enough to let a file through.
  const patterns: string[] = [];

  for (const [type, extensions] of Object.entries(accept)) {
    patterns.push(type, ...extensions);
  }

  return patterns;
};

const matchesAccept = (file: File, patterns: string[]) => {
  if (!patterns.length) return true;

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) {
      return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    }

    if (pattern.endsWith('/*')) {
      return file.type.startsWith(pattern.slice(0, -1));
    }

    return file.type === pattern;
  });
};

type DropzoneContextValue = {
  src: File[];
  accept: string | undefined;
  minSize?: number;
  maxSize?: number;
  maxFiles?: number;
  disabled: boolean;
  dragging: boolean;
  labels: DropzoneLabels;
  onRemove?: (file: File, index: number) => void;
  /** Opens the file dialog — for a "Choose files" button outside the drop area. */
  open: () => void;
};

const DropzoneContext = createContext<DropzoneContextValue | null>(null);

export const useDropzone = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error('useDropzone must be used inside a <Dropzone>');
  }

  return context;
};

export type DropzoneProps = Omit<
  ComponentProps<'div'>,
  'onDrop' | 'onError'
> & {
  /** The files currently held, owned by the caller. */
  src?: File[] | null;
  /** Accepted and rejected files from one drop or one dialog pick. */
  onDrop?: (accepted: File[], rejected: FileRejection[]) => void;
  /** Called once per drop when anything was rejected. */
  onError?: (error: Error) => void;
  /** Shows a remove button on each file in `DropzoneContent`. */
  onRemove?: (file: File, index: number) => void;
  accept?: DropzoneAccept;
  /** Cap per drop, not per session — existing files are not counted. */
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  /** Lets a plain form post carry the last picked files. */
  name?: string;
  form?: string;
  required?: boolean;
  labels?: Partial<DropzoneLabels>;
};

/**
 * A drop area that takes files from a drag or from the file dialog.
 *
 * ```tsx
 * <Dropzone
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024}
 *   src={files}
 *   onDrop={(accepted) => setFiles(accepted)}
 *   onRemove={(_, index) => setFiles(files.filter((__, i) => i !== index))}
 *   onError={(error) => toast.error(error.message)}
 * >
 *   <DropzoneEmptyState />
 *   <DropzoneContent />
 * </Dropzone>
 * ```
 *
 * Validation happens here — type, size, count — and both sides of the outcome
 * come back through `onDrop`, so a rejected file can be reported rather than
 * silently dropped. The component holds no files of its own: whatever `src`
 * says is what it shows.
 */
export const Dropzone = ({
  src,
  onDrop,
  onError,
  onRemove,
  accept,
  maxFiles,
  maxSize,
  minSize,
  multiple = true,
  disabled = false,
  name,
  form,
  required,
  labels,
  className,
  children,
  ...props
}: DropzoneProps) => {
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  // A drag over a child fires `dragleave` on the parent, so the state has to
  // count enters and leaves rather than toggle on each one.
  const depth = useRef(0);
  const [dragging, setDragging] = useState(false);

  const patterns = useMemo(() => toAcceptList(accept), [accept]);
  const acceptAttribute = patterns.join(',') || undefined;
  const text = useMemo(
    () => ({ ...DROPZONE_LABELS, ...locale.dropzone, ...labels }),
    [locale, labels],
  );
  const limit = multiple ? maxFiles : 1;

  const open = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const process = (files: File[]) => {
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];

    for (const file of files) {
      if (!matchesAccept(file, patterns)) {
        rejected.push({
          file,
          code: 'file-invalid-type',
          message: text.rejectedType(file.name),
        });
      } else if (maxSize !== undefined && file.size > maxSize) {
        rejected.push({
          file,
          code: 'file-too-large',
          message: text.rejectedTooLarge(file.name, formatBytes(maxSize)),
        });
      } else if (minSize !== undefined && file.size < minSize) {
        rejected.push({
          file,
          code: 'file-too-small',
          message: text.rejectedTooSmall(file.name, formatBytes(minSize)),
        });
      } else if (limit !== undefined && accepted.length >= limit) {
        rejected.push({
          file,
          code: 'too-many-files',
          message: text.rejectedTooMany(file.name, limit),
        });
      } else {
        accepted.push(file);
      }
    }

    onDrop?.(accepted, rejected);

    if (rejected.length) {
      onError?.(new Error(rejected.map((entry) => entry.message).join('\n')));
    }
  };

  const onDropFiles = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    depth.current = 0;
    setDragging(false);

    if (disabled) return;

    process(Array.from(event.dataTransfer.files));
  };

  const context = useMemo<DropzoneContextValue>(
    () => ({
      src: src ?? EMPTY_FILES,
      accept: acceptAttribute,
      minSize,
      maxSize,
      maxFiles: limit,
      disabled,
      dragging,
      labels: text,
      onRemove,
      open,
    }),
    [
      acceptAttribute,
      disabled,
      dragging,
      limit,
      maxSize,
      minSize,
      onRemove,
      open,
      src,
      text,
    ],
  );

  return (
    <DropzoneContext value={context}>
      <div
        data-slot="dropzone"
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        className={cn(
          'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background p-6 text-center transition-colors outline-none',
          'hover:border-primary/50 hover:bg-accent/50',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'data-dragging:border-primary data-dragging:bg-primary/5',
          'data-disabled:pointer-events-none data-disabled:opacity-50',
          className,
        )}
        onClick={open}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          open();
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          depth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          depth.current -= 1;
          if (depth.current <= 0) setDragging(false);
        }}
        onDrop={onDropFiles}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          form={form}
          required={required}
          accept={acceptAttribute}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          // Picking the same file twice in a row is a real thing — clearing the
          // value makes the second pick fire `change` again.
          onClick={(event) => {
            event.stopPropagation();
            event.currentTarget.value = '';
          }}
          onChange={(event) => process(Array.from(event.target.files ?? []))}
        />
        {children}
      </div>
    </DropzoneContext>
  );
};

export type DropzoneEmptyStateProps = ComponentProps<'div'>;

/** The invitation to drop, shown only while nothing has been picked. */
export const DropzoneEmptyState = ({
  className,
  children,
  ...props
}: DropzoneEmptyStateProps) => {
  const { src, accept, minSize, maxSize, maxFiles, labels } = useDropzone();

  if (src.length) return null;

  const hint = labels.hint({ accept, minSize, maxSize, maxFiles });

  return (
    <div
      data-slot="dropzone-empty-state"
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-center',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <UploadIcon className="size-4" />
          </div>
          <div className="grid gap-0.5">
            <p className="text-sm font-medium">{labels.title}</p>
            <p className="text-sm text-muted-foreground">
              {labels.description}
            </p>
          </div>
          {!!hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </>
      )}
    </div>
  );
};

export type DropzoneContentProps = ComponentProps<'div'>;

/** What was picked, shown once `src` has something in it. */
export const DropzoneContent = ({
  className,
  children,
  ...props
}: DropzoneContentProps) => {
  const { src, labels, onRemove } = useDropzone();

  if (!src.length) return null;

  return (
    <div
      data-slot="dropzone-content"
      className={cn('flex w-full flex-col gap-2', className)}
      {...props}
    >
      {children ?? (
        <>
          {src.length > 1 && (
            <p className="text-sm font-medium">{labels.files(src.length)}</p>
          )}
          {src.map((file, index) => (
            <DropzoneFile
              key={`${file.name}-${file.lastModified}-${index}`}
              file={file}
              onRemove={onRemove && (() => onRemove(file, index))}
              removeLabel={labels.remove}
            />
          ))}
        </>
      )}
    </div>
  );
};

export type DropzoneFileProps = ComponentProps<'div'> & {
  file: File;
  onRemove?: () => void;
  removeLabel?: string;
};

/** One picked file: thumbnail when it is an image, name and size otherwise. */
export const DropzoneFile = ({
  file,
  onRemove,
  removeLabel,
  className,
  ...props
}: DropzoneFileProps) => {
  const preview = useObjectUrl(file.type.startsWith('image/') ? file : null);

  return (
    <div
      data-slot="dropzone-file"
      className={cn(
        'flex items-center gap-3 rounded-md border border-border bg-card p-2 text-left',
        className,
      )}
      {...props}
    >
      {preview ? (
        <img
          src={preview}
          alt={file.name}
          className="size-10 shrink-0 rounded object-cover"
        />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
          <FileIcon className="size-4" />
        </div>
      )}

      <div className="grid min-w-0 flex-1 gap-0.5">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(file.size)}
        </p>
      </div>

      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          // The row sits inside the drop area, which opens the file dialog on
          // click — removing a file must not also reopen it.
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
};

/** An object URL that lives exactly as long as the file it points at. */
const useObjectUrl = (file: File | null) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }

    const next = URL.createObjectURL(file);

    setUrl(next);

    return () => URL.revokeObjectURL(next);
  }, [file]);

  return url;
};
