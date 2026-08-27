import { Status, StatusIndicator, StatusLabel } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const SERVICES = [
  { name: 'API', tone: 'online', label: 'Operational' },
  { name: 'Email delivery', tone: 'degraded', label: 'Slow' },
  { name: 'Report export', tone: 'maintenance', label: 'Maintenance' },
  { name: 'CRM sync', tone: 'offline', label: 'Down' },
] as const;

export const meta: DemoMeta = {
  imports: ['Status', 'StatusIndicator', 'StatusLabel'],
  api: [
    {
      title: 'Status',
      description:
        'Takes every prop `Badge` does except `variant` — the status dot has already decided how it looks.',
      props: [
        {
          name: 'tone',
          type: "'online' | 'offline' | 'degraded' | 'maintenance' | 'neutral'",
          default: "'neutral'",
          description: 'A preset tone for a service or record state.',
        },
        {
          name: 'color',
          type: 'string',
          description:
            'Any CSS colour, for states the tone list does not cover — a workflow step whose colour comes from the database, say. Wins over `tone`.',
        },
        {
          name: 'pulse',
          type: 'boolean',
          default: 'false',
          description:
            'A pulsing halo. Off for a settled state, on for something live.',
        },
      ],
    },
    {
      title: 'StatusIndicator / StatusLabel',
      description:
        'The two halves apart, for layouts `Status` does not cover — the dot in one table cell and the label in another.',
      props: [
        {
          name: 'tone / color / pulse',
          type: 'StatusTone | string | boolean',
          description: 'As on `Status`, set on `StatusIndicator`.',
        },
      ],
    },
  ],
};

/**
 * Preset tones
 */
export const Tones = () => (
  <>
    <Status tone="online">Running</Status>
    <Status tone="degraded">Degraded</Status>
    <Status tone="maintenance">Maintenance</Status>
    <Status tone="offline">Offline</Status>
    <Status tone="neutral">Unknown</Status>
  </>
);

/**
 * Pulsing
 *
 * `pulse` is for something genuinely happening right now — turn it on
 * everywhere and nothing stands out any more.
 */
export const Pulse = () => (
  <>
    <Status tone="online" pulse>
      Processing
    </Status>
    <Status tone="degraded" pulse>
      Slowing down
    </Status>
  </>
);

/**
 * Any colour
 */
export const CustomColor = () => (
  <>
    <Status color="#17a2b8">In progress</Status>
    <Status color="#28a745">On track</Status>
    <Status color="#7c3aed">Awaiting signature</Status>
  </>
);

/**
 * A service status board
 */
export const ServiceList = () => (
  <div className="grid w-full max-w-sm gap-2 text-sm">
    {SERVICES.map((service) => (
      <div
        key={service.name}
        className="flex items-center justify-between gap-3 border-b border-border pb-2"
      >
        <span>{service.name}</span>
        <Status tone={service.tone} pulse={service.tone === 'degraded'}>
          {service.label}
        </Status>
      </div>
    ))}
  </div>
);

/**
 * Dot and label apart
 *
 * For when the dot and the text have to sit in two different table cells.
 */
export const Parts = () => (
  <div className="flex items-center gap-2 text-sm">
    <StatusIndicator tone="online" pulse />
    <StatusLabel>Primary server</StatusLabel>
  </div>
);
