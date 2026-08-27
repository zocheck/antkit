import { useEffect, useState } from 'react';

import { Button, Progress } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Progress'],
  api: [
    {
      title: 'Progress',
      description:
        'For when you know how far along something is. Reach for `Spinner` when you do not, and `Skeleton` when you know the shape of what is coming. Takes every prop a <div> does except `children`.',
      props: [
        {
          name: 'percent',
          type: 'number',
          default: '0',
          description: '0–100. Anything outside the range is clamped.',
        },
        {
          name: 'status',
          type: "'normal' | 'active' | 'success' | 'exception'",
          default: "'normal'",
          description:
            '`success` and `exception` also swap the trailing info for an icon.',
        },
        {
          name: 'showInfo',
          type: 'boolean',
          default: 'true',
          description: 'Shows the percentage beside the bar.',
        },
        {
          name: 'format',
          type: '(percent: number) => ReactNode',
          description: 'Replaces the trailing info with a node of your own.',
        },
        {
          name: 'type',
          type: "'line' | 'circle'",
          default: "'line'",
          description: 'A bar or a ring.',
        },
        {
          name: 'size',
          type: "'sm' | 'default' | 'lg'",
          default: "'default'",
          description: '`line` only — how thick the bar is.',
        },
        {
          name: 'diameter',
          type: 'number',
          default: '96',
          description: '`circle` only — diameter in px.',
        },
        {
          name: 'strokeWidth',
          type: 'number',
          default: '8',
          description: '`circle` only — ring thickness.',
        },
      ],
    },
  ],
};

/**
 * A bar
 */
export const Basic = () => (
  <div className="grid w-full max-w-sm gap-4">
    <Progress percent={30} />
    <Progress percent={64} />
    <Progress percent={100} />
  </div>
);

/**
 * Status
 *
 * `success` and `exception` swap the number for an icon, so the outcome reads
 * without having to decode the colour.
 */
export const Status = () => (
  <div className="grid w-full max-w-sm gap-4">
    <Progress percent={100} status="success" />
    <Progress percent={72} status="exception" />
    <Progress percent={45} status="active" />
  </div>
);

/**
 * Thickness
 */
export const Sizes = () => (
  <div className="grid w-full max-w-sm gap-4">
    <Progress percent={60} size="sm" />
    <Progress percent={60} />
    <Progress percent={60} size="lg" />
  </div>
);

/**
 * A ring
 */
export const Circle = () => (
  <>
    <Progress type="circle" percent={64} />
    <Progress type="circle" percent={100} status="success" />
    <Progress type="circle" percent={38} status="exception" />
    <Progress type="circle" percent={80} diameter={64} strokeWidth={6} />
  </>
);

/**
 * Replacing the info
 *
 * `format` is handed the percentage and returns any node — useful when the
 * real number is a size rather than a ratio.
 */
export const Format = () => (
  <div className="grid w-full max-w-sm gap-4">
    <Progress
      percent={42}
      format={(percent) => `${Math.round((percent / 100) * 2048)} MB`}
    />
    <Progress type="circle" percent={75} format={() => '3 / 4'} />
    <Progress percent={50} showInfo={false} />
  </div>
);

/**
 * Running
 */
export const Live = () => {
  const [percent, setPercent] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setPercent((current) => {
        if (current >= 100) {
          setRunning(false);
          return 100;
        }
        return current + 4;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [running]);

  return (
    <div className="grid w-full max-w-sm gap-3">
      <Progress
        percent={percent}
        status={percent >= 100 ? 'success' : 'active'}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            setPercent(0);
            setRunning(true);
          }}
        >
          Restart
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setRunning(!running)}
        >
          {running ? 'Pause' : 'Resume'}
        </Button>
      </div>
    </div>
  );
};
