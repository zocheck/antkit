import { useState } from 'react';

import { CheckableTag, Tag } from '@antkit/react';
import { StarIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

const TAGS = ['IELTS', 'TOEIC', 'Conversation'];

export const meta: DemoMeta = {
  imports: ['Tag', 'CheckableTag'],
  api: [
    {
      title: 'Tag',
      props: [
        {
          name: 'color',
          type: 'TagPresetColor | string',
          default: "'default'",
          description:
            'One of the preset tones — default, primary, success, processing, warning, error, red, orange, amber, green, teal, blue, indigo, purple, pink — or any CSS colour, for a state that comes out of the database.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'A glyph before the content.',
        },
        {
          name: 'closable',
          type: 'boolean',
          default: 'false',
          description: 'Adds the close button.',
        },
        {
          name: 'closeIcon',
          type: 'ReactNode',
          description: 'Replaces the default close icon.',
        },
        {
          name: 'onClose',
          type: '() => void',
          description: 'Called when the close button is pressed.',
        },
        {
          name: 'bordered',
          type: 'boolean',
          default: 'true',
          description: 'Off gives a flat chip with no outline.',
        },
        {
          name: 'onClick',
          type: '() => void',
          description: 'Makes the whole tag clickable.',
        },
      ],
    },
    {
      title: 'CheckableTag',
      description:
        'A tag that toggles like a checkbox — for a row of quick filters.',
      props: [
        {
          name: 'checked',
          type: 'boolean',
          description: 'Whether it is on.',
        },
        {
          name: 'onChange',
          type: '(checked: boolean) => void',
          description: 'Called when it is switched on or off.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks it.',
        },
      ],
    },
  ],
};

/**
 * Preset tones
 */
export const Colors = () => (
  <>
    <Tag>Default</Tag>
    <Tag color="primary">Brand</Tag>
    <Tag color="success">Active</Tag>
    <Tag color="processing">Processing</Tag>
    <Tag color="warning">Expiring soon</Tag>
    <Tag color="error">Failed</Tag>
  </>
);

/**
 * The palette
 *
 * The other nine are for when a tag is a category rather than a state.
 */
export const Palette = () => (
  <>
    {[
      'red',
      'orange',
      'amber',
      'green',
      'teal',
      'blue',
      'indigo',
      'purple',
      'pink',
    ].map((color) => (
      <Tag key={color} color={color}>
        {color}
      </Tag>
    ))}
  </>
);

/**
 * Any colour, and no border
 *
 * `color` also takes a CSS colour, for labels users pick themselves and that
 * live in the database.
 */
export const CustomColor = () => (
  <>
    <Tag color="#0ea5e9">Custom colour</Tag>
    <Tag color="#e20d2c">#e20d2c</Tag>
    <Tag bordered={false} color="teal">
      No border
    </Tag>
    <Tag color="purple" icon={<StarIcon />}>
      VIP
    </Tag>
  </>
);

/**
 * Closable
 *
 * A tag does not disappear on its own — you decide, by dropping it from the
 * list.
 */
export const Closable = () => {
  const [tags, setTags] = useState(TAGS);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <Tag
          key={tag}
          closable
          color="indigo"
          onClose={() => setTags(tags.filter((entry) => entry !== tag))}
        >
          {tag}
        </Tag>
      ))}
      {tags.length === 0 && (
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={() => setTags(TAGS)}
        >
          Restore
        </button>
      )}
    </div>
  );
};

/**
 * Toggling like a checkbox
 *
 * `CheckableTag` suits the filter row above a list.
 */
export const Checkable = () => {
  const [picked, setPicked] = useState<string[]>(['IELTS']);

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {TAGS.map((tag) => (
          <CheckableTag
            key={tag}
            checked={picked.includes(tag)}
            onChange={(checked) =>
              setPicked((current) =>
                checked
                  ? [...current, tag]
                  : current.filter((entry) => entry !== tag),
              )
            }
          >
            {tag}
          </CheckableTag>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Filtering by: {picked.join(', ') || '—'}
      </p>
    </div>
  );
};
