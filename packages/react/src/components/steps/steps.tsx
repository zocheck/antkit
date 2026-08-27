import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import { CheckIcon, XIcon } from 'lucide-react';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export type StepItem = {
  title: ReactNode;
  description?: ReactNode;
  /** Replaces the number/tick in the marker. */
  icon?: ReactNode;
  /** Overrides the status derived from `current`. */
  status?: StepStatus;
  disabled?: boolean;
  /** Only needed if the list is reordered; position is the identity otherwise. */
  key?: string;
};

export type StepsProps = {
  items: StepItem[];
  /** Zero-based index of the step in progress. */
  current?: number;
  /** Status of the *current* step — the others are derived from their position. */
  status?: StepStatus;
  direction?: 'horizontal' | 'vertical';
  size?: 'default' | 'sm';
  /** Makes the steps clickable. They stay reachable by keyboard. */
  onChange?: (current: number) => void;
  className?: string;
};

const MARKER: Record<StepStatus, string> = {
  wait: 'border-border bg-background text-muted-foreground',
  process: 'border-primary bg-primary text-primary-foreground',
  finish: 'border-primary bg-primary/10 text-primary',
  error: 'border-destructive bg-destructive text-white',
};

const TITLE: Record<StepStatus, string> = {
  wait: 'text-muted-foreground',
  process: 'font-medium text-foreground',
  finish: 'text-foreground',
  error: 'font-medium text-destructive',
};

/** Half the marker, so the vertical rail runs down its centre. */
const RAIL_OFFSET = { default: '1rem', sm: '0.75rem' } as const;

/**
 * Progress through a multi-step task — a wizard, an import,
 * an approval chain.
 *
 * ```tsx
 * <Steps
 *   current={step}
 *   onChange={setStep}
 *   items={[
 *     { title: 'Details', description: 'Name and contact' },
 *     { title: 'Course' },
 *     { title: 'Payment' },
 *   ]}
 * />
 * ```
 *
 * Everything before `current` reads as finished, everything after as waiting.
 * Set `status="error"` to mark the current step as failed, or pin a single step
 * with its own `status` when the order isn't strictly linear.
 */
export const Steps = ({
  items,
  current = 0,
  status = 'process',
  direction = 'horizontal',
  size = 'default',
  onChange,
  className,
}: StepsProps) => {
  const vertical = direction === 'vertical';
  const small = size === 'sm';

  const steps = useMemo(
    () =>
      items.map((item, index) => ({
        item,
        index,
        id: item.key ?? `step-${index}`,
        status:
          item.status ??
          (index === current ? status : index < current ? 'finish' : 'wait'),
      })),
    [items, current, status],
  );

  return (
    <ol
      data-slot="steps"
      data-direction={direction}
      className={cn(
        'flex w-full min-w-0',
        vertical ? 'flex-col' : 'flex-row items-start',
        className,
      )}
    >
      {steps.map(({ item, index, id, status: state }) => {
        const last = index === steps.length - 1;
        const clickable = !!onChange && !item.disabled;

        const body = (
          <span
            className={cn(
              'flex min-w-0 gap-3',
              vertical ? 'flex-row' : 'flex-col items-start',
            )}
          >
            <span
              className={cn(
                'flex shrink-0 items-center justify-center rounded-full border font-medium tabular-nums',
                small ? 'size-6 text-xs' : 'size-8 text-sm',
                MARKER[state],
              )}
            >
              {item.icon ??
                (state === 'finish' ? (
                  <CheckIcon className={small ? 'size-3' : 'size-4'} />
                ) : state === 'error' ? (
                  <XIcon className={small ? 'size-3' : 'size-4'} />
                ) : (
                  index + 1
                ))}
            </span>

            <span
              className={cn(
                'flex min-w-0 flex-col gap-0.5 text-left',
                // Leaves room for the rail to run past this step to the next.
                vertical && !last && 'pb-6',
              )}
            >
              <span className={cn(small ? 'text-xs' : 'text-sm', TITLE[state])}>
                {item.title}
              </span>
              {!!item.description && (
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              )}
            </span>
          </span>
        );

        return (
          <li
            key={id}
            data-slot="step"
            data-status={state}
            aria-current={state === 'process' ? 'step' : undefined}
            className={cn(
              'relative flex min-w-0',
              vertical
                ? 'flex-col'
                : 'flex-1 flex-row items-start last:flex-none',
            )}
          >
            {clickable ? (
              <button
                type="button"
                onClick={() => onChange(index)}
                className={cn(
                  'flex min-w-0 cursor-pointer rounded-md text-left transition-opacity hover:opacity-80',
                  'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                {body}
              </button>
            ) : (
              body
            )}

            {/* Drawn by the step it leaves, so the last one has none. */}
            {!last && (
              <span
                aria-hidden="true"
                style={vertical ? { left: RAIL_OFFSET[size] } : undefined}
                className={cn(
                  index < current ? 'bg-primary/40' : 'bg-border',
                  vertical
                    ? cn(
                        'absolute w-px',
                        small ? 'top-7 bottom-1' : 'top-9 bottom-1',
                      )
                    : cn('mx-2 h-px min-w-4 flex-1', small ? 'mt-3' : 'mt-4'),
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};
