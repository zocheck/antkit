import { useState } from 'react';

import {
  Checkbox,
  DatePicker,
  Label,
  Segmented,
  Select,
  Switch,
} from '@antkit/react';

const PLANS = [
  { label: 'Basic', value: 'basic' },
  { label: 'Standard', value: 'standard' },
  { label: 'Enterprise', value: 'enterprise' },
];

/**
 * The controls whose behaviour is the point: each one here answers to the
 * keyboard, and none of that behaviour is written in this file.
 */
export const KeyboardPreview = () => {
  const [plan, setPlan] = useState('standard');

  return (
    <div className="grid gap-5 rounded-2xl border border-border bg-card p-6">
      <Segmented
        defaultValue="month"
        options={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
        ]}
      />

      <div className="grid gap-2">
        <Label htmlFor="home-plan">Plan</Label>
        <Select
          id="home-plan"
          options={PLANS}
          value={plan}
          onChange={(value) => setPlan(value as string)}
          showSearch
          allowClear
        />
      </div>

      <div className="grid gap-2">
        <Label>Start date</Label>
        <DatePicker locale="en-US" clearable />
      </div>

      <Label className="flex items-center gap-2 font-normal">
        <Checkbox defaultChecked />
        Renew automatically
      </Label>

      <Label className="flex items-center gap-2 font-normal">
        <Switch defaultChecked />
        Push notifications
      </Label>
    </div>
  );
};
