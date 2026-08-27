import { useEffect, useState } from 'react';

import { AutoComplete, Label } from '@antkit/react';
import type { AutoCompleteOption } from '@antkit/react';

import type { DemoMeta } from '../lib/types';

const NAMES = [
  { value: 'Sarah Chen' },
  { value: 'Samuel Okafor' },
  { value: 'Marcus Alvarez' },
  { value: 'Maria Bellini' },
  { value: 'Priya Raghunathan' },
];

const DOMAINS = ['gmail.com', 'company.com', 'outlook.com'];

export const meta: DemoMeta = {
  imports: ['AutoComplete'],
  extraImports: ["import type { AutoCompleteOption } from '@antkit/react';"],
  api: [
    {
      title: 'AutoComplete',
      description:
        'The difference from Select: what the user types is the value. Select’s mode="tags" also takes new values, but stores them as chips, whereas the field here is free text.',
      props: [
        {
          name: 'options',
          type: 'AutoCompleteOption[]',
          description: 'The suggestions. Required.',
        },
        {
          name: 'value',
          type: 'string',
          description: 'The contents of the field.',
        },
        {
          name: 'onChange',
          type: '(value: string) => void',
          description: 'Fires on every keystroke — the field is free text.',
        },
        {
          name: 'onSelect',
          type: '(value: string, option: AutoCompleteOption) => void',
          description: 'Fires only when a suggestion is actually chosen.',
        },
        {
          name: 'filterOption',
          type: 'boolean | ((input: string, option: AutoCompleteOption) => boolean)',
          default: 'true',
          description:
            'Client-side filtering. Set `false` when the server already returned a list for the query, or the data gets filtered twice.',
        },
        {
          name: 'allowClear',
          type: 'boolean',
          default: 'false',
          description: 'A button to clear the field.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description:
            'A spinner in the field, for while the server is answering.',
        },
        {
          name: 'notFoundContent',
          type: 'ReactNode',
          description:
            'Replaces the empty block when nothing matches. Left out, it uses `Empty` — icon and all. The list only opens once something is typed: an untouched field has asked no question for "no results" to answer.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Locks the field.',
        },
      ],
    },
    {
      title: 'AutoCompleteOption',
      props: [
        {
          name: 'value',
          type: 'string',
          description: 'The value dropped into the field when chosen.',
        },
        {
          name: 'label',
          type: 'ReactNode',
          description:
            'Defaults to `value`. Use it to show more than the text that gets filled in.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Locks one suggestion.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label>Find a student</Label>
      <AutoComplete
        options={NAMES}
        value={query}
        onChange={setQuery}
        allowClear
        placeholder="Type a student's name"
      />
    </div>
  );
};

/**
 * Suggestions built from the input
 *
 * The list is generated from what is being typed — completing an email domain.
 */
export const Generated = () => {
  const [email, setEmail] = useState('');

  const options: AutoCompleteOption[] = email.includes('@')
    ? []
    : DOMAINS.map((domain) => ({ value: `${email}@${domain}` }));

  return (
    <AutoComplete
      className="max-w-xs"
      options={options}
      value={email}
      onChange={setEmail}
      filterOption={false}
      placeholder="Enter an email"
    />
  );
};

/**
 * Labels apart from values
 *
 * `label` is what the list shows; `value` is what lands in the field.
 */
export const RichOptions = () => (
  <AutoComplete
    className="max-w-xs"
    placeholder="Pick a course"
    options={[
      {
        value: 'IELTS 6.5+',
        label: (
          <span className="flex w-full items-center justify-between gap-3">
            IELTS 6.5+
            <span className="text-xs text-muted-foreground">24 sessions</span>
          </span>
        ),
      },
      {
        value: 'TOEIC 750',
        label: (
          <span className="flex w-full items-center justify-between gap-3">
            TOEIC 750
            <span className="text-xs text-muted-foreground">18 sessions</span>
          </span>
        ),
      },
      { value: 'Beginner conversation', disabled: true },
    ]}
  />
);

/**
 * Fetching from a server
 *
 * `filterOption={false}` stops the server's list being filtered a second time;
 * `loading` says it is waiting. This example fakes a 500ms delay.
 */
export const Remote = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AutoCompleteOption[]>([]);
  const [loading, setLoading] = useState(false);

  // The spinner goes on in the keystroke handler and the effect only handles
  // the wait — so the effect never sets state synchronously, and no extra
  // render is dragged along.
  const search = (value: string) => {
    setQuery(value);
    setLoading(!!value);
  };

  useEffect(() => {
    if (!query) return;

    const timer = setTimeout(() => {
      setResults(
        NAMES.filter((item) =>
          item.value.toLowerCase().includes(query.toLowerCase()),
        ),
      );
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AutoComplete
      className="max-w-xs"
      options={query ? results : []}
      value={query}
      onChange={search}
      filterOption={false}
      loading={loading}
      notFoundContent="No matching student"
      placeholder="Type to search the server"
    />
  );
};

/**
 * Catching the selection
 *
 * `onChange` fires constantly; `onSelect` fires only when a suggestion is
 * genuinely chosen — that is the moment to go and load the detail.
 */
export const OnSelect = () => {
  const [picked, setPicked] = useState<string>();

  return (
    <div className="grid w-full max-w-xs gap-2">
      <AutoComplete
        options={NAMES}
        onSelect={(value) => setPicked(value)}
        placeholder="Pick a suggestion"
      />
      <p className="text-xs text-muted-foreground">Selected: {picked ?? '—'}</p>
    </div>
  );
};
