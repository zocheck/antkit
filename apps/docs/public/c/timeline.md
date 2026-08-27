# Timeline

A timeline where each item’s status colours its dot and rail.

```tsx
import { Timeline, TimelineConnector, TimelineContent, TimelineDescription, TimelineHeader, TimelineIndicator, TimelineItem, TimelineTime, TimelineTitle } from '@antkit/react';
```

A vertical rail of events — run history, an audit trail, the steps of a
workflow. For date-positioned bars across a horizontal axis, use `Gantt`.

```tsx
<Timeline>
  <TimelineItem status="complete">
    <TimelineIndicator />
    <TimelineContent>
      <TimelineHeader>
        <TimelineTitle>Email sent</TimelineTitle>
        <TimelineTime dateTime="2026-08-27T09:00:00Z">09:00</TimelineTime>
      </TimelineHeader>
      <TimelineDescription>12 recipients</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
</Timeline>
```


Source: `@antkit/react/src/components/timeline/timeline.tsx`
