import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@antkit/react';
import { HomeIcon, SlashIcon } from 'lucide-react';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: [
    'Breadcrumb',
    'BreadcrumbList',
    'BreadcrumbItem',
    'BreadcrumbLink',
    'BreadcrumbPage',
    'BreadcrumbSeparator',
    'BreadcrumbEllipsis',
  ],
  api: [
    {
      title: 'Breadcrumb',
      description:
        'Seven small parts, each a real HTML tag, so each takes the DOM props that go with it.',
      props: [
        {
          name: 'Breadcrumb',
          type: "ComponentProps<'nav'>",
          description: 'A <nav aria-label="breadcrumb">.',
        },
        {
          name: 'BreadcrumbList',
          type: "ComponentProps<'ol'>",
          description: 'The ordered list, wrapping when it runs out of room.',
        },
        {
          name: 'BreadcrumbItem',
          type: "ComponentProps<'li'>",
          description: 'One link in the trail.',
        },
        {
          name: 'BreadcrumbLink',
          type: "ComponentProps<'a'> & { asChild?: boolean }",
          description:
            'The link itself. Use `asChild` to hand off to your router’s <Link>.',
        },
        {
          name: 'BreadcrumbPage',
          type: "ComponentProps<'span'>",
          description:
            'The current page — not a link, and it already carries aria-current="page".',
        },
        {
          name: 'BreadcrumbSeparator',
          type: "ComponentProps<'li'>",
          description: 'The divider. With no children it defaults to ">".',
        },
        {
          name: 'BreadcrumbEllipsis',
          type: "ComponentProps<'span'>",
          description: 'The "…" standing in for the levels folded away.',
        },
      ],
    },
  ],
};

/**
 * Basic
 */
export const Basic = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Academics</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Courses</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

/**
 * With an icon
 */
export const WithIcon = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#" className="flex items-center gap-1.5">
          <HomeIcon className="size-3.5" />
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Student profile</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

/**
 * A different separator
 *
 * Give `BreadcrumbSeparator` children to replace the default chevron.
 */
export const CustomSeparator = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <SlashIcon />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Reports</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <SlashIcon />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbPage>Revenue</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

/**
 * Folding the middle
 *
 * On a deep path, fold the middle into a menu and keep the root and the
 * current page.
 */
export const Collapsed = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Folded levels"
            className="cursor-pointer"
          >
            <BreadcrumbEllipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Academics</DropdownMenuItem>
            <DropdownMenuItem>Courses</DropdownMenuItem>
            <DropdownMenuItem>IELTS 6.5+</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Session 12</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

/**
 * Wired to a router
 *
 * `asChild` keeps the styling but renders your router's link component —
 * swap the `<a>` below for react-router's `<Link>` or next/link.
 */
export const WithRouter = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <a href="/components/breadcrumb">Home</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);
