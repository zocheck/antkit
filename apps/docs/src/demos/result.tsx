import { Button, Result } from '@antkit/react';
import { PartyPopperIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Result'],
  api: [
    {
      title: 'Result',
      description:
        'An outcome at page scale. Use `Empty` for an empty list or table. Takes every prop a <div> does except `title`.',
      props: [
        {
          name: 'status',
          type: "'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'",
          default: "'info'",
          description: 'Decides the icon and the colour behind it.',
        },
        {
          name: 'title',
          type: 'ReactNode',
          description: 'The large line.',
        },
        {
          name: 'subTitle',
          type: 'ReactNode',
          description: 'The explanation under it.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'Replaces the icon for that `status`.',
        },
        {
          name: 'extra',
          type: 'ReactNode',
          description: 'The buttons under the text.',
        },
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'An extra block at the bottom — error details, an order number, a summary.',
        },
      ],
    },
  ],
};

/**
 * Success
 */
export const Success = () => (
  <div className="w-full rounded-lg border border-border">
    <Result
      status="success"
      title="Enrolment complete"
      subTitle="Student number STU-2026-0042. A confirmation email is on its way."
      extra={
        <>
          <Button size="sm">View profile</Button>
          <Button size="sm" variant="secondary">
            Back to home
          </Button>
        </>
      }
    />
  </div>
);

/**
 * Error
 */
export const Error = () => (
  <div className="w-full rounded-lg border border-border">
    <Result
      status="error"
      title="Payment failed"
      subTitle="The bank declined the transaction. Your card has not been charged."
      extra={
        <Button size="sm" variant="destructive">
          Try again
        </Button>
      }
    >
      <div className="rounded-lg bg-muted p-3 text-left text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Details</p>
        <p>Error 51 — insufficient funds</p>
        <p>27 Aug 2026, 09:14</p>
      </div>
    </Result>
  </div>
);

/**
 * HTTP statuses
 *
 * These three carry their own icons, for error pages at router level.
 */
export const HttpStatuses = () => (
  <div className="grid w-full gap-4">
    {(['404', '403', '500'] as const).map((status) => (
      <div key={status} className="rounded-lg border border-border">
        <Result
          status={status}
          title={status}
          subTitle={
            {
              '404': 'We could not find that page.',
              '403': 'You do not have access to this area.',
              '500': 'Something went wrong on our side. We are on it.',
            }[status]
          }
          extra={
            <Button size="sm" variant="secondary">
              Back to home
            </Button>
          }
        />
      </div>
    ))}
  </div>
);

/**
 * Warning and info
 */
export const InfoAndWarning = () => (
  <div className="grid w-full gap-4 sm:grid-cols-2">
    <div className="rounded-lg border border-border">
      <Result
        status="warning"
        title="Your profile is incomplete"
        subTitle="A copy of your ID is still missing."
      />
    </div>
    <div className="rounded-lg border border-border">
      <Result
        status="info"
        title="Awaiting approval"
        subTitle="We will process your application within one working day."
      />
    </div>
  </div>
);

/**
 * A custom icon
 */
export const CustomIcon = () => (
  <div className="w-full rounded-lg border border-border">
    <Result
      icon={<PartyPopperIcon className="size-8 text-primary" />}
      title="Congratulations!"
      subTitle="You have finished the IELTS 6.5+ course."
      extra={<Button size="sm">Download certificate</Button>}
    />
  </div>
);
