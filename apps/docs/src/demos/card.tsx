import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@antkit/react';
import { MoreVerticalIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: [
    'Card',
    'CardHeader',
    'CardTitle',
    'CardDescription',
    'CardContent',
    'CardFooter',
  ],
  api: [
    {
      title: 'Card',
      description:
        'All six parts are <div>s taking every DOM prop. None is required — compose the ones you need.',
      props: [
        {
          name: 'Card',
          type: "ComponentProps<'div'>",
          description:
            'The outer frame: border, 12px radius, card background and 24px of vertical padding.',
        },
        {
          name: 'CardHeader',
          type: "ComponentProps<'div'>",
          description: 'The title block, with 24px of horizontal padding.',
        },
        {
          name: 'CardTitle',
          type: "ComponentProps<'div'>",
          description: 'The title line, set medium.',
        },
        {
          name: 'CardDescription',
          type: "ComponentProps<'div'>",
          description: 'The description line, small and muted.',
        },
        {
          name: 'CardContent',
          type: "ComponentProps<'div'>",
          description: 'The body.',
        },
        {
          name: 'CardFooter',
          type: "ComponentProps<'div'>",
          description: 'The footer, a horizontal flex row by default.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>IELTS 6.5+ course</CardTitle>
      <CardDescription>Starts 12 Sep · 24 sessions</CardDescription>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      Mon / Wed / Fri evenings at the downtown campus. Twelve students maximum.
    </CardContent>
  </Card>
);

/**
 * With a footer
 *
 * `CardFooter` is already a horizontal flex row, so buttons dropped in line up
 * on their own.
 */
export const WithFooter = () => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Confirm enrolment</CardTitle>
      <CardDescription>
        Tuition is $12,500, payable before the first session.
      </CardDescription>
    </CardHeader>
    <CardFooter className="gap-2">
      <Button size="sm">Confirm</Button>
      <Button size="sm" variant="ghost">
        Later
      </Button>
    </CardFooter>
  </Card>
);

/**
 * An action in the corner
 *
 * The header is a flex column, so putting a button to the right of the title
 * means wrapping them in a row of their own.
 */
export const WithAction = () => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1.5">
          <CardTitle>Sarah Chen</CardTitle>
          <CardDescription>Account manager: Dana Whitfield</CardDescription>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">
          <MoreVerticalIcon />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="flex items-center gap-2">
      <Badge variant="success">Active</Badge>
      <Badge variant="muted">IELTS 6.5+</Badge>
    </CardContent>
  </Card>
);

/**
 * A profile card
 *
 * Paired with Avatar and Separator for a block about a person.
 */
export const Profile = () => (
  <Card className="w-full max-w-sm">
    <CardContent className="flex items-center gap-3">
      <Avatar className="size-11">
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">Sarah Chen</p>
        <p className="truncate text-sm text-muted-foreground">
          sarah.chen@example.com
        </p>
      </div>
    </CardContent>
    <Separator />
    <CardFooter className="justify-between text-sm">
      <span className="text-muted-foreground">Sessions attended</span>
      <span className="font-medium">18 / 24</span>
    </CardFooter>
  </Card>
);

/**
 * In a grid
 *
 * Card is already a flex column and min-w-0, so it drops into a grid cleanly.
 */
export const Grid = () => (
  <div className="grid w-full gap-4 sm:grid-cols-3">
    {[
      { title: 'Active students', value: '248' },
      { title: 'Open classes', value: '17' },
      { title: 'Revenue this month', value: '$412k' },
    ].map((item) => (
      <Card key={item.title}>
        <CardHeader>
          <CardDescription>{item.title}</CardDescription>
          <CardTitle className="text-xl">{item.value}</CardTitle>
        </CardHeader>
      </Card>
    ))}
  </div>
);
