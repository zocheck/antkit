import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Progress,
  Statistic,
  Status,
  Tag,
} from '@antkit/react';
import { ArrowRightIcon } from 'lucide-react';

const ROWS = [
  {
    initials: 'SC',
    name: 'Sarah Chen',
    tag: 'IELTS 6.5+',
    tone: 'online',
    state: 'Paid',
  },
  {
    initials: 'MA',
    name: 'Marcus Alvarez',
    tag: 'TOEIC',
    tone: 'degraded',
    state: 'Owing',
  },
  {
    initials: 'PR',
    name: 'Priya Raghunathan',
    tag: 'HSK 4',
    tone: 'neutral',
    state: 'Pending',
  },
] as const;

/**
 * The hero's proof: a panel built from real components rather than a picture
 * of one. Everything here is a live `@antkit/react` render, which is the whole
 * claim of the page above it.
 */
export const HeroPreview = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5">
    <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
      <span className="size-2.5 rounded-full bg-destructive/50" />
      <span className="size-2.5 rounded-full bg-muted-foreground/30" />
      <span className="size-2.5 rounded-full bg-muted-foreground/20" />
      <span className="ml-3 truncate font-mono text-[11px] text-muted-foreground">
        app.example.com/campaigns
      </span>
    </div>

    <div className="grid gap-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-sm font-medium">Autumn campaign</p>
          <Status tone="online" pulse>
            Running
          </Status>
        </div>
        <Badge variant="success">Q3</Badge>
      </div>

      {/*
        Compact units, not the full figure: $125,400 crowds its neighbour. Two
        across on a phone for the same reason — the third number only fits once
        the panel has the width to itself.
      */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Statistic
          title="Revenue"
          value={125.4}
          precision={1}
          prefix="$"
          suffix="k"
          trend="up"
          delta="+12.4%"
        />
        <Statistic title="Students" value={1_284} trend="up" delta="+86" />
        <Statistic
          title="Churn"
          value={3.2}
          precision={1}
          suffix="%"
          trend="down"
          delta="-0.8%"
          className="hidden sm:grid"
        />
      </div>

      <div className="grid gap-1.5">
        <p className="text-xs text-muted-foreground">Quarterly target</p>
        <Progress percent={64} />
      </div>

      <div className="grid gap-1">
        {ROWS.map((row) => (
          <div key={row.name} className="flex items-center gap-3 py-1.5">
            <Avatar size="sm">
              <AvatarFallback>{row.initials}</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate text-sm">{row.name}</span>
            <Tag color="processing">{row.tag}</Tag>
            <Status tone={row.tone} className="hidden sm:inline-flex">
              {row.state}
            </Status>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Export report
        </Button>
        <Button size="sm" suffix={<ArrowRightIcon />}>
          Continue
        </Button>
      </div>
    </div>
  </div>
);
