import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../utils';
import {
  ImageOffIcon,
  RotateCcwIcon,
  RotateCwIcon,
  ZoomInIcon,
  ZoomOutIcon,
  XIcon,
} from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useEffect, useState } from 'react';

import { Skeleton } from '../skeleton';

const MIN_SCALE = 0.25;
const MAX_SCALE = 4;
const SCALE_STEP = 0.25;

export type ImageProps = Omit<ComponentProps<'img'>, 'placeholder'> & {
  /** Click to open the full-screen viewer. */
  preview?: boolean;
  /** Shown when the image fails to load — a URL, a node, or the default icon. */
  fallback?: ReactNode | string;
  /** `true` shows a skeleton while loading, or pass your own node. */
  placeholder?: ReactNode | boolean;
  /** Styles the wrapper; `className` still goes to the `<img>` itself. */
  wrapperClassName?: string;
  /** Accessible name for the viewer dialog. Defaults to `alt`. */
  previewTitle?: string;
  previewLabels?: ImagePreviewLabels;
};

export type ImagePreviewLabels = {
  open: string;
  close: string;
  zoomIn: string;
  zoomOut: string;
  rotateLeft: string;
  rotateRight: string;
};

const DEFAULT_LABELS: ImagePreviewLabels = {
  open: 'Xem ảnh',
  close: 'Đóng',
  zoomIn: 'Phóng to',
  zoomOut: 'Thu nhỏ',
  rotateLeft: 'Xoay trái',
  rotateRight: 'Xoay phải',
};

/**
 * An image that knows how to be loading, broken, and zoomable.
 *
 * ```tsx
 * <Image src={avatar} alt="Ảnh học viên" width={160} className="rounded-lg" />
 * <Image src={proof} alt="Ảnh chuyển khoản" placeholder preview={false} />
 * ```
 */
export const Image = ({
  src,
  alt = '',
  preview = true,
  fallback,
  placeholder,
  wrapperClassName,
  previewTitle,
  previewLabels,
  className,
  onLoad,
  onError,
  ...props
}: ImageProps) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );
  const [open, setOpen] = useState(false);
  const labels = { ...DEFAULT_LABELS, ...previewLabels };

  // A new src is a new load, so the previous outcome must not stick around.
  useEffect(() => {
    setStatus('loading');
  }, [src]);

  const isBroken = status === 'error' || !src;
  const canPreview = preview && !isBroken;

  return (
    <>
      <div
        data-slot="image"
        data-status={isBroken ? 'error' : status}
        className={cn(
          'relative inline-flex max-w-full overflow-hidden align-middle',
          wrapperClassName,
        )}
      >
        {isBroken ? (
          typeof fallback === 'string' ? (
            <img
              src={fallback}
              alt={alt}
              className={cn('max-w-full object-cover', className)}
              {...props}
            />
          ) : (
            (fallback ?? (
              <span
                data-slot="image-fallback"
                aria-label={alt || undefined}
                role="img"
                className={cn(
                  'flex min-h-16 min-w-16 flex-auto items-center justify-center bg-muted text-muted-foreground',
                  className,
                )}
              >
                <ImageOffIcon className="size-6" />
              </span>
            ))
          )
        ) : (
          <>
            <img
              src={src}
              alt={alt}
              onLoad={(event) => {
                setStatus('loaded');
                onLoad?.(event);
              }}
              onError={(event) => {
                setStatus('error');
                onError?.(event);
              }}
              className={cn(
                'max-w-full object-cover transition-opacity',
                status === 'loading' && placeholder
                  ? 'opacity-0'
                  : 'opacity-100',
                className,
              )}
              {...props}
            />

            {status === 'loading' && !!placeholder && (
              <div
                data-slot="image-placeholder"
                className="absolute inset-0 flex items-center justify-center"
              >
                {placeholder === true ? (
                  <Skeleton className="size-full rounded-none" />
                ) : (
                  placeholder
                )}
              </div>
            )}

            {canPreview && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={labels.open}
                className={cn(
                  'absolute inset-0 flex cursor-zoom-in items-center justify-center gap-1.5',
                  'bg-black/50 text-sm font-medium text-white opacity-0 transition-opacity',
                  'hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-hidden',
                )}
              >
                <ZoomInIcon className="size-4" />
                {labels.open}
              </button>
            )}
          </>
        )}
      </div>

      {canPreview && (
        <ImagePreview
          open={open}
          onOpenChange={setOpen}
          src={String(src)}
          alt={alt}
          title={previewTitle ?? alt}
          labels={labels}
        />
      )}
    </>
  );
};

type ImagePreviewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
  title: string;
  labels: ImagePreviewLabels;
};

const toolbarButton = cn(
  'flex size-9 cursor-pointer items-center justify-center rounded-md text-white/80 transition-colors',
  'hover:bg-white/15 hover:text-white',
  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/70',
  'disabled:pointer-events-none disabled:opacity-40',
);

const ImagePreview = ({
  open,
  onOpenChange,
  src,
  alt,
  title,
  labels,
}: ImagePreviewProps) => {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  // Every viewing starts from the same place, however the last one ended.
  useEffect(() => {
    if (open) {
      setScale(1);
      setRotate(0);
    }
  }, [open]);

  const zoom = (delta: number) =>
    setScale((current) =>
      Math.min(MAX_SCALE, Math.max(MIN_SCALE, current + delta)),
    );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/85',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed inset-0 z-50 flex flex-col items-center justify-center outline-hidden',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {title || labels.open}
          </DialogPrimitive.Title>

          <img
            src={src}
            alt={alt}
            // Zoom and rotation are continuous values — inline transform is the
            // only way to express them.
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            className="max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-200"
          />

          <div
            data-slot="image-preview-toolbar"
            className="absolute bottom-8 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm"
          >
            <button
              type="button"
              aria-label={labels.zoomOut}
              disabled={scale <= MIN_SCALE}
              onClick={() => zoom(-SCALE_STEP)}
              className={toolbarButton}
            >
              <ZoomOutIcon className="size-4" />
            </button>
            <span className="w-12 text-center text-xs text-white/80 tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              aria-label={labels.zoomIn}
              disabled={scale >= MAX_SCALE}
              onClick={() => zoom(SCALE_STEP)}
              className={toolbarButton}
            >
              <ZoomInIcon className="size-4" />
            </button>
            <span aria-hidden className="mx-1 h-5 w-px bg-white/20" />
            <button
              type="button"
              aria-label={labels.rotateLeft}
              onClick={() => setRotate((current) => current - 90)}
              className={toolbarButton}
            >
              <RotateCcwIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label={labels.rotateRight}
              onClick={() => setRotate((current) => current + 90)}
              className={toolbarButton}
            >
              <RotateCwIcon className="size-4" />
            </button>
          </div>

          <DialogPrimitive.Close
            aria-label={labels.close}
            className={cn(toolbarButton, 'absolute top-4 right-4 bg-black/40')}
          >
            <XIcon className="size-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
