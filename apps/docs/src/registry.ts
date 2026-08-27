import type { RegistryEntry } from './lib/types';

export { GROUPS } from './lib/types';

/**
 * The catalogue. One entry per page, `slug` matching a file in `src/demos` and
 * a key in each locale's `components` map. Order inside a group is the order
 * shown in the sidebar, so related components stay next to each other rather
 * than falling alphabetically apart.
 *
 * Nothing here is language: titles are component names, and the one-line
 * description lives in `lib/locales/<code>.ts`.
 */
export const REGISTRY: RegistryEntry[] = [
  { slug: 'button', title: 'Button', group: 'general' },
  { slug: 'typography', title: 'Typography', group: 'general' },

  { slug: 'layout', title: 'Layout', group: 'layout' },
  { slug: 'sidebar', title: 'Sidebar', group: 'layout' },
  { slug: 'card', title: 'Card', group: 'layout' },
  { slug: 'separator', title: 'Separator', group: 'layout' },
  { slug: 'scroll-shadow', title: 'ScrollShadow', group: 'layout' },

  { slug: 'breadcrumb', title: 'Breadcrumb', group: 'navigation' },
  { slug: 'dropdown-menu', title: 'Dropdown Menu', group: 'navigation' },
  { slug: 'command-menu', title: 'CommandMenu', group: 'navigation' },
  { slug: 'tabs', title: 'Tabs', group: 'navigation' },
  { slug: 'steps', title: 'Steps', group: 'navigation' },

  { slug: 'form', title: 'Form', group: 'dataEntry' },
  { slug: 'input', title: 'Input', group: 'dataEntry' },
  { slug: 'textarea', title: 'Textarea', group: 'dataEntry' },
  { slug: 'input-number', title: 'InputNumber', group: 'dataEntry' },
  { slug: 'label', title: 'Label', group: 'dataEntry' },
  { slug: 'select', title: 'Select', group: 'dataEntry' },
  { slug: 'auto-complete', title: 'AutoComplete', group: 'dataEntry' },
  { slug: 'cascader', title: 'Cascader', group: 'dataEntry' },
  { slug: 'tree-select', title: 'TreeSelect', group: 'dataEntry' },
  { slug: 'transfer', title: 'Transfer', group: 'dataEntry' },
  { slug: 'checkbox', title: 'Checkbox', group: 'dataEntry' },
  { slug: 'checkbox-group', title: 'CheckboxGroup', group: 'dataEntry' },
  { slug: 'radio', title: 'Radio', group: 'dataEntry' },
  { slug: 'switch', title: 'Switch', group: 'dataEntry' },
  { slug: 'segmented', title: 'Segmented', group: 'dataEntry' },
  { slug: 'slider', title: 'Slider', group: 'dataEntry' },
  { slug: 'rate', title: 'Rate', group: 'dataEntry' },
  { slug: 'date-picker', title: 'DatePicker', group: 'dataEntry' },
  { slug: 'time-picker', title: 'TimePicker', group: 'dataEntry' },
  { slug: 'dropzone', title: 'Dropzone', group: 'dataEntry' },
  { slug: 'rich-text-editor', title: 'RichTextEditor', group: 'dataEntry' },

  { slug: 'table', title: 'Table', group: 'dataDisplay' },
  { slug: 'pagination', title: 'Pagination', group: 'dataDisplay' },
  { slug: 'descriptions', title: 'Descriptions', group: 'dataDisplay' },
  { slug: 'statistic', title: 'Statistic', group: 'dataDisplay' },
  { slug: 'tag', title: 'Tag', group: 'dataDisplay' },
  { slug: 'badge', title: 'Badge', group: 'dataDisplay' },
  { slug: 'count-badge', title: 'CountBadge', group: 'dataDisplay' },
  { slug: 'status', title: 'Status', group: 'dataDisplay' },
  { slug: 'avatar', title: 'Avatar', group: 'dataDisplay' },
  { slug: 'image', title: 'Image', group: 'dataDisplay' },
  { slug: 'image-zoom', title: 'ImageZoom', group: 'dataDisplay' },
  { slug: 'comparison', title: 'Comparison', group: 'dataDisplay' },
  { slug: 'calendar', title: 'Calendar', group: 'dataDisplay' },
  { slug: 'timeline', title: 'Timeline', group: 'dataDisplay' },
  { slug: 'tree', title: 'Tree', group: 'dataDisplay' },
  { slug: 'collapsible', title: 'Collapsible', group: 'dataDisplay' },
  { slug: 'kanban', title: 'Kanban', group: 'dataDisplay' },
  { slug: 'list', title: 'List', group: 'dataDisplay' },
  { slug: 'gantt', title: 'Gantt', group: 'dataDisplay' },
  { slug: 'carousel', title: 'Carousel', group: 'dataDisplay' },
  { slug: 'marquee', title: 'Marquee', group: 'dataDisplay' },
  { slug: 'empty', title: 'Empty', group: 'dataDisplay' },
  { slug: 'tooltip', title: 'Tooltip', group: 'dataDisplay' },
  { slug: 'popover', title: 'Popover', group: 'dataDisplay' },

  { slug: 'alert', title: 'Alert', group: 'feedback' },
  { slug: 'message', title: 'Message', group: 'feedback' },
  { slug: 'notification', title: 'Notification', group: 'feedback' },
  { slug: 'toast', title: 'Toast', group: 'feedback' },
  { slug: 'modal', title: 'Modal', group: 'feedback' },
  { slug: 'sheet', title: 'Sheet', group: 'feedback' },
  { slug: 'popconfirm', title: 'Popconfirm', group: 'feedback' },
  { slug: 'progress', title: 'Progress', group: 'feedback' },
  { slug: 'spinner', title: 'Spinner', group: 'feedback' },
  { slug: 'skeleton', title: 'Skeleton', group: 'feedback' },
  { slug: 'result', title: 'Result', group: 'feedback' },
];

export const BY_SLUG = new Map(REGISTRY.map((entry) => [entry.slug, entry]));

/**
 * The prose pages, in sidebar order, each one a file under
 * `content/<locale>/`. The first is what an unknown route lands on.
 */
export const GUIDES = ['introduction', 'installation'] as const;
