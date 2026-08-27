import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Textarea,
} from '@antkit/react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

const ROLES = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
];

export const meta: DemoMeta = {
  imports: ['Form'],
  api: [
    {
      title: 'Form',
      description:
        'Takes every prop a <form> does except onSubmit — submitting belongs to the form, and only surfaces through onFinish.',
      props: [
        {
          name: 'form',
          type: 'UseFormReturn<TValues>',
          description: 'What `Form.useForm()` returned. Required.',
        },
        {
          name: 'onFinish',
          type: '(values: TValues) => unknown',
          description:
            'Called with the valid values, once every rule has passed.',
        },
        {
          name: 'onFinishFailed',
          type: '(errors) => void',
          description: 'Called when a rule fails, with the per-field errors.',
        },
        {
          name: 'layout',
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description: 'Whether the label sits above the control or beside it.',
        },
      ],
    },
    {
      title: 'Form.Item',
      props: [
        {
          name: 'name',
          type: 'FieldPath<TValues>',
          description:
            'The key in the values object. Nested paths such as `contact.email` work.',
        },
        { name: 'label', type: 'ReactNode', description: 'The field label.' },
        {
          name: 'description',
          type: 'ReactNode',
          description: 'The hint under the control.',
        },
        {
          name: 'rules',
          type: 'Rule[]',
          description: 'The validation rules. The first one to fail wins.',
        },
        {
          name: 'valuePropName',
          type: 'string',
          default: "'value'",
          description:
            'Which prop the control reads its value from. `Checkbox` and `Switch` need `"checked"`.',
        },
        {
          name: 'required',
          type: 'boolean',
          description:
            'Forces the asterisk when the rules do not imply it themselves.',
        },
      ],
    },
    {
      title: 'Rule',
      description:
        'One object can carry several constraints; they are checked in turn, and whichever fails is what gets reported.',
      props: [
        {
          name: 'required',
          type: 'boolean',
          description:
            'Rejects undefined, null, an empty string and an empty array.',
        },
        {
          name: 'whitespace',
          type: 'boolean',
          description:
            'Goes with `required`: a string of nothing but whitespace is rejected too.',
        },
        {
          name: 'type',
          type: "'string' | 'email' | 'url' | 'number' | 'integer'",
          description: 'The expected data type.',
        },
        {
          name: 'min / max',
          type: 'number',
          description:
            'String length, or the numeric value when the field is a number.',
        },
        { name: 'len', type: 'number', description: 'An exact string length.' },
        {
          name: 'pattern',
          type: 'RegExp',
          description: 'A regular expression.',
        },
        {
          name: 'validator',
          type: '(value, values) => boolean | string | void | Promise<…>',
          description:
            'A check of your own. Return true or nothing to pass; return a string and it becomes the error. It is handed the whole values object, so cross-field checks work, and it may be async.',
        },
        {
          name: 'message',
          type: 'string',
          description:
            'The message when the rule fails. It goes through ConfigProvider’s `translate`, so it can be an i18n key or the sentence itself.',
        },
      ],
    },
    {
      title: 'Form.useForm()',
      description:
        'Wraps react-hook-form’s useForm in mode "onTouched" — errors appear after leaving a field, not on the first keystroke.',
      props: [
        {
          name: 'defaultValues',
          type: 'TValues',
          description: 'The initial values.',
        },
        {
          name: 'reset()',
          type: '(values?: TValues) => void',
          description:
            'Returns the form to its defaults, or to the values you pass.',
        },
        {
          name: 'setValue()',
          type: '(name, value) => void',
          description: 'Sets one field’s value.',
        },
        {
          name: 'watch()',
          type: '(name?) => unknown',
          description: 'Watches a value, to show or hide another field.',
        },
        {
          name: 'formState',
          type: '{ isSubmitting, isDirty, errors, … }',
          description: 'The form state, for a submit button that is working.',
        },
      ],
    },
  ],
};

type BasicValues = { email: string; password: string };

/**
 * Basic
 *
 * `rules` is the whole validation story — no schema, no resolver. Press Submit
 * on an empty form to see the errors.
 */
export const Basic = () => {
  const form = Form.useForm<BasicValues>({
    defaultValues: { email: '', password: '' },
  });

  return (
    <Form
      form={form}
      className="w-full max-w-md"
      onFinish={(values) => toast.success(JSON.stringify(values))}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Enter your email' },
          { type: 'email', message: 'Enter a valid email address' },
        ]}
      >
        <Input type="email" placeholder="you@company.com" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        description="At least 8 characters."
        rules={[
          { required: true, message: 'Enter your password' },
          { min: 8, message: 'Use at least 8 characters' },
        ]}
      >
        <Input type="password" />
      </Form.Item>

      <div className="flex gap-2">
        <Button type="submit">Sign in</Button>
        <Button type="button" variant="ghost" onClick={() => form.reset()}>
          Reset
        </Button>
      </div>
    </Form>
  );
};

type ControlValues = {
  role: string;
  seats: number | null;
  plan: string;
  note: string;
  notify: boolean;
  agree: boolean;
};

/**
 * Any control drops in
 *
 * `Form.Item` clones its child and injects `value`, `onChange`, `onBlur` and
 * the aria ids — so Select, InputNumber and Radio all work directly, with no
 * adapter. Checkbox and Switch read their value from `checked`, which is what
 * `valuePropName` is for.
 */
export const Controls = () => {
  const form = Form.useForm<ControlValues>({
    defaultValues: {
      role: '',
      seats: 1,
      plan: 'pro',
      note: '',
      notify: true,
      agree: false,
    },
  });

  return (
    <Form
      form={form}
      className="w-full max-w-md"
      onFinish={(values) => toast.success(JSON.stringify(values))}
    >
      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Pick a role' }]}
      >
        <Select options={ROLES} allowClear />
      </Form.Item>

      <Form.Item name="seats" label="Seats">
        <InputNumber min={1} max={100} />
      </Form.Item>

      <Form.Item name="plan" label="Plan">
        <RadioGroup className="grid gap-2">
          <Radio value="basic">Basic</Radio>
          <Radio value="pro">Pro</Radio>
        </RadioGroup>
      </Form.Item>

      <Form.Item name="note" label="Notes">
        <Textarea autoSize={{ minRows: 2 }} />
      </Form.Item>

      <Form.Item name="notify" label="Email me" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item
        name="agree"
        valuePropName="checked"
        rules={[
          {
            validator: (value) =>
              value === true || 'You have to accept the terms',
          },
        ]}
      >
        <Checkbox />
      </Form.Item>

      <Button type="submit">Save</Button>
    </Form>
  );
};

type SignupValues = { password: string; confirm: string; username: string };

/**
 * Cross-field and async checks
 *
 * `validator` is handed the whole values object, so it can compare two fields,
 * and it may return a Promise, so it can call an API. Try the name `admin`.
 */
export const Validator = () => {
  const form = Form.useForm<SignupValues>({
    defaultValues: { password: '', confirm: '', username: '' },
  });

  return (
    <Form
      form={form}
      className="w-full max-w-md"
      onFinish={() => toast.success('Account created')}
    >
      <Form.Item
        name="username"
        label="Username"
        description="Checked for collisions by a stubbed 600ms call."
        rules={[
          { required: true, message: 'Enter a username' },
          {
            validator: async (value) => {
              await new Promise((resolve) => setTimeout(resolve, 600));
              return value !== 'admin' || 'That username is taken';
            },
          },
        ]}
      >
        <Input placeholder="sarahchen" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true },
          { min: 8, message: 'At least 8 characters' },
        ]}
      >
        <Input type="password" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm password"
        rules={[
          {
            validator: (value, values) =>
              value === values.password || 'The two passwords do not match',
          },
        ]}
      >
        <Input type="password" />
      </Form.Item>

      <Button type="submit" loading={form.formState.isSubmitting}>
        Create account
      </Button>
    </Form>
  );
};

type LayoutValues = { name: string; phone: string };

/**
 * layout="horizontal"
 *
 * The label sits on the same row as the control — right for a dense settings
 * form.
 */
export const Horizontal = () => {
  const form = Form.useForm<LayoutValues>({
    defaultValues: { name: '', phone: '' },
  });

  return (
    <Form
      form={form}
      layout="horizontal"
      className="w-full max-w-lg"
      onFinish={(values) => toast.success(JSON.stringify(values))}
    >
      <Form.Item name="name" label="Full name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[
          { pattern: /^\d{10}$/, message: 'A phone number is 10 digits' },
        ]}
      >
        <Input placeholder="4155550134" />
      </Form.Item>

      <Button type="submit" className="justify-self-start">
        Save
      </Button>
    </Form>
  );
};

type WatchValues = { hasCompany: boolean; company: string; taxCode: string };

/**
 * Dependent fields
 *
 * `form.watch()` reveals another field when a value elsewhere switches on.
 */
export const Dependent = () => {
  const form = Form.useForm<WatchValues>({
    defaultValues: { hasCompany: false, company: '', taxCode: '' },
  });

  const hasCompany = form.watch('hasCompany');

  return (
    <Form
      form={form}
      className="w-full max-w-md"
      onFinish={(values) => toast.success(JSON.stringify(values))}
    >
      <Form.Item
        name="hasCompany"
        label="Invoice a company"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      {hasCompany && (
        <>
          <Form.Item
            name="company"
            label="Company name"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="taxCode"
            label="Tax number"
            rules={[{ len: 10, message: 'A tax number is 10 digits' }]}
          >
            <Input />
          </Form.Item>
        </>
      )}

      <Button type="submit">Save</Button>
    </Form>
  );
};

type DefaultMessageValues = { website: string; age: number | null };

/**
 * The default messages
 *
 * Leave `message` out and the rule falls back to a built-in i18n key —
 * `validation.url`, `validation.required` and so on — which `ConfigProvider`’s
 * `translate` turns into words.
 */
export const DefaultMessages = () => {
  const form = Form.useForm<DefaultMessageValues>({
    defaultValues: { website: '', age: null },
  });

  return (
    <Form
      form={form}
      className="w-full max-w-md"
      onFinish={(values) => toast.success(JSON.stringify(values))}
    >
      <Form.Item
        name="website"
        label="Website"
        rules={[{ required: true }, { type: 'url' }]}
      >
        <Input placeholder="https://…" />
      </Form.Item>

      <Form.Item name="age" label="Age" rules={[{ type: 'integer' }]}>
        <InputNumber />
      </Form.Item>

      <Button type="submit">Validate</Button>
    </Form>
  );
};
