# @antkit/react — every component

Generated from the source. If a name is not here, the library does not
have it — do not import it and hope.

Import everything from the package root. The full contract for a component
— a runnable example, the near-neighbour to prefer, the trap — is the doc
block on its source file, at
`node_modules/@antkit/react/src/components/<slug>/<slug>.tsx`.

`RichTextEditor` is the exception: it is not in the root barrel. Import it
from `@antkit/react/rich-text-editor`, lazily.

## General

| Exports | What it is | Props |
| --- | --- | --- |
| `Button` `buttonStyles` | Six variants, five sizes, a loading state and an icon slot at each end. | `asChild` `prefix` `suffix` `loading` `loadingLabel` `wave` |
| `Paragraph` `Text` `Title` `Typography` | Headings, paragraphs and inline text on the @antkit/styles type scale. |  |

## Layout

| Exports | What it is | Props |
| --- | --- | --- |
| `LAYOUT_SIDER_COLLAPSED_WIDTH` `LAYOUT_SIDER_WIDTH` `Layout` `LayoutContent` `LayoutFooter` `LayoutHeader` `LayoutSider` | Page frame: header, collapsible sider, content and footer. | `hasSider` |
| `Sidebar` `SidebarContent` `SidebarFooter` `SidebarGroup` `SidebarGroupAction` `SidebarGroupContent` `SidebarGroupLabel` `SidebarHeader` `SidebarInput` `SidebarInset` `SidebarMenu` `SidebarMenuAction` `SidebarMenuBadge` `SidebarMenuButton` `SidebarMenuItem` `SidebarMenuSkeleton` `SidebarMenuSub` `SidebarMenuSubButton` `SidebarMenuSubItem` `SidebarProvider` `SidebarRail` `SidebarSeparator` `SidebarTrigger` `useSidebar` | The navigation rail: menu groups, submenus, and an icon-only collapsed mode. |  |
| `Card` `CardContent` `CardDescription` `CardFooter` `CardHeader` `CardTitle` | A content block with a header, description, body and footer. |  |
| `Separator` | A horizontal or vertical rule between blocks of content. |  |
| `ScrollShadow` | A scroll container that fades whichever edge still has content past it. | `orientation` `size` `offset` `hideScrollBar` `enabled` `visibility` `onVisibilityChange` |

## Navigation

| Exports | What it is | Props |
| --- | --- | --- |
| `Breadcrumb` `BreadcrumbEllipsis` `BreadcrumbItem` `BreadcrumbLink` `BreadcrumbList` `BreadcrumbPage` `BreadcrumbSeparator` | The trail of ancestors above the current page. |  |
| `DropdownMenu` `DropdownMenuCheckboxItem` `DropdownMenuContent` `DropdownMenuGroup` `DropdownMenuItem` `DropdownMenuLabel` `DropdownMenuPortal` `DropdownMenuRadioGroup` `DropdownMenuRadioItem` `DropdownMenuSeparator` `DropdownMenuShortcut` `DropdownMenuSub` `DropdownMenuSubContent` `DropdownMenuSubTrigger` `DropdownMenuTrigger` | A menu off a button: plain items, checkboxes, radios, groups and submenus. |  |
| `Command` `CommandDialog` `CommandEmpty` `CommandFooter` `CommandGroup` `CommandInput` `CommandItem` `CommandList` `CommandMenu` `CommandSeparator` `CommandShortcut` | The ⌘K palette: a search box over a list of actions, opened from anywhere. | `items` `open` `defaultOpen` `onOpenChange` `shortcut` `onSelect` `placeholder` `emptyText` `search` `onSearchChange` +7 |
| `Tabs` `TabsContent` `TabsList` `TabsTrigger` `tabsListStyles` | Switch panels, in a default or underline variant. |  |
| `Steps` | Progress through a multi-step task, horizontally or vertically. | `items` `current` `status` `direction` `size` `onChange` `className` |

## Data Entry

| Exports | What it is | Props |
| --- | --- | --- |
| `Form` `FormControl` `FormDescription` `FormItem` `FormLabel` `FormMessage` `hasRequiredRule` `localiseRuleMessage` `rulesToValidate` `useFieldAria` `useForm` `useFormField` | Declarative forms: rules on the field, no schema, no resolver. |  |
| `Input` | A single-line field: every HTML type, error state, icons and buttons attached. |  |
| `Textarea` | A multi-line field that grows with its content and counts characters. | `autoSize` `showCount` `wrapperClassName` |
| `InputNumber` | A number field with steppers, currency formatting and min/max bounds. | `value` `defaultValue` `onChange` `min` `max` `step` `precision` `size` `controls` `keyboard` +13 |
| `Label` | A label bound to a control — clicking it focuses the control. |  |
| `Select` | One component covering every variant: single, multiple, tags, search, groups. | `options` `value` `defaultValue` `onChange` `onBlur` `mode` `showSearch` `allowClear` `placeholder` `searchPlaceholder` +9 |
| `AutoComplete` | A free-text field that suggests, but never forces, a value. | `options` `value` `onChange` `onSelect` `onBlur` `filterOption` `placeholder` `notFoundContent` `allowClear` `disabled` +6 |
| `Cascader` | Drill through a fixed-depth hierarchy one column at a time. | `options` `value` `onChange` `onBlur` `changeOnSelect` `expandTrigger` `displayRender` `placeholder` `allowClear` `disabled` +5 |
| `TreeSelect` | A select whose list is a tree with checkable branches. | `treeData` `value` `onChange` `onBlur` `treeCheckable` `multiple` `showSearch` `treeDefaultExpandAll` `allowClear` `placeholder` +9 |
| `Transfer` | Two columns to move items between — permissions, tags, members. | `dataSource` `targetKeys` `onChange` `onBlur` `titles` `showSearch` `render` `listHeight` `disabled` `id` +1 |
| `Checkbox` | A three-state tick box, indeterminate included. |  |
| `CheckboxGroup` `CheckboxGroupItem` `CheckboxOption` `useCheckboxGroup` | Several options sharing one array of values. | `value` `defaultValue` `onValueChange` `name` `disabled` `orientation` |
| `Radio` `RadioGroup` `RadioGroupItem` | Pick one of several, with an optional line of help under each label. | `description` |
| `Switch` | An instant on/off, with a loading state for when it calls an API. | `size` `loading` `checkedChildren` `uncheckedChildren` |
| `Segmented` | A row of buttons picking one value — tighter than Radio. | `options` `value` `defaultValue` `onChange` `size` `block` `disabled` |
| `Slider` | One or two handles, with marks and a value tooltip. | `value` `defaultValue` `onChange` `onChangeComplete` `range` `vertical` `marks` `tooltip` `formatTooltip` |
| `Rate` | Star rating, with half stars and a character of your choosing. | `count` `value` `defaultValue` `onChange` `onBlur` `allowHalf` `allowClear` `disabled` `readOnly` `character` +7 |
| `Calendar` `DateField` `DateInputBox` `DatePicker` `DateRangePicker` `DateSegments` `addDays` `addMonths` `isSameDay` `isWithin` `startOfDay` `startOfMonth` `toISODate` `useDateParts` | Type into dd/mm/yyyy segments or open the calendar; ranges included. | `open` `defaultOpen` `onOpenChange` `closeOnSelect` `calendarLabels` `openLabel` `align` `side` `prefix` `className` +1 |
| `TimeField` `TimePanel` `TimePicker` `TimeRangePicker` `TimeSegments` `compareTimes` `isTimeAfter` `isTimeBefore` `isTimeWithin` `parseISOTime` `resolveTimeFormat` `toISOTime` `toTimeString` `useTimeParts` `withTime` | Pick a time by column, 12h or 24h, ranges included. | `onChange` `open` `defaultOpen` `onOpenChange` `showNow` `nowText` `okText` `openLabel` `align` `side` +3 |
| `Dropzone` `DropzoneContent` `DropzoneEmptyState` `DropzoneFile` `formatBytes` `useDropzone` | A drop area for files, with type, size and count limits. | `src` `onDrop` `onError` `onRemove` `accept` `maxFiles` `maxSize` `minSize` `multiple` `disabled` +4 |
| `COMPACT_TOOLBAR` `DEFAULT_TOOLBAR` `RichTextEditor` `isCustomTool` | A formatting editor with images and tables — load it lazily. | `value` `defaultValue` `onChange` `onBlur` `placeholder` `disabled` `readOnly` `autoFocus` `toolbar` `maxLength` +15 |

## Data Display

| Exports | What it is | Props |
| --- | --- | --- |
| `Table` `TableBody` `TableCaption` `TableCell` `TableFooter` `TableHead` `TableHeader` `TableRoot` `TableRow` `useColumnWidths` | The data grid: sorting, row selection, fixed and resizable columns, expandable rows, pagination. | `columns` `dataSource` `rowKey` `loading` `loadingRows` `empty` `onRowClick` `rowClassName` `rowSelection` `expandable` +17 |
| `Pagination` | Page numbers, with a size changer, a jump-to box and a simple mode. | `page` `pageSize` `total` `onChange` `pageSizeOptions` `showSizeChanger` `showQuickJumper` `showLessItems` `boundaries` `siblings` +8 |
| `Descriptions` | Label–value pairs for a detail page. | `items` `title` `extra` `column` `bordered` `layout` `size` |
| `Statistic` | A headline number with a prefix, suffix and trend. | `title` `value` `precision` `locale` `formatter` `prefix` `suffix` `trend` `delta` `loading` +1 |
| `CheckableTag` `Tag` | A coloured chip — closable, or toggled like a checkbox. | `children` `color` `icon` `closable` `closeIcon` `onClose` `bordered` `onClick` `className` `style` |
| `Badge` `badgeStyles` | A small status label in eight prebuilt tones. | `asChild` |
| `CountBadge` | A dot or count pinned to the corner of something else. | `children` `count` `overflowCount` `dot` `showZero` `color` `offset` `size` `title` `className` +1 |
| `Status` `StatusIndicator` `StatusLabel` | A status dot with a label and an optional pulse. | `tone` `color` `pulse` |
| `Avatar` `AvatarBadge` `AvatarFallback` `AvatarGroup` `AvatarGroupCount` `AvatarImage` | A profile image with initials to fall back on. |  |
| `Image` | An image with a placeholder, an error fallback and a zoom viewer. | `preview` `fallback` `placeholder` `wrapperClassName` `previewTitle` `previewLabels` |
| `ImageZoom` | Zoom an image in place on click. | `children` `zoomMargin` `backdropClassName` `zoomed` `onZoomChange` `disabled` `zoomLabel` `unzoomLabel` |
| `Comparison` `ComparisonHandle` `ComparisonItem` | Drag a handle to compare a before and after image. | `mode` `defaultPosition` `position` `onPositionChange` `step` `onDragStart` `onDragEnd` |
| `Calendar` | A calendar mounted straight into the page, for a date or a range. |  |
| `Timeline` `TimelineConnector` `TimelineContent` `TimelineDescription` `TimelineHeader` `TimelineIndicator` `TimelineItem` `TimelineTime` `TimelineTitle` | A timeline where each item’s status colours its dot and rail. |  |
| `Tree` | A hierarchy with branch-wide checking, connector lines and icons. | `data` `defaultExpandedKeys` `expandedKeys` `onExpand` `selectedKeys` `onSelect` `multiple` `selectable` `checkable` `checkedKeys` +5 |
| `Collapsible` `CollapsibleContent` `CollapsibleTrigger` | Open and close a block of content. |  |
| `KanbanBoard` `KanbanCard` `KanbanCards` `KanbanHeader` `KanbanProvider` | Columns of cards, dragged within and between columns. |  |
| `ListGroup` `ListHeader` `ListItem` `ListItems` `ListProvider` | Grouped rows, dragged vertically between groups. |  |
| `Gantt` | A schedule by day, week or month, with markers and zoom. | `rows` `markers` `from` `to` `unit` `zoom` `labelWidth` `rowHeight` `maxHeight` `sidebarTitle` +5 |
| `Carousel` `carousel` `carouselArrow` `carouselDot` `carouselDots` | Slides that snap, with dots, arrows, autoplay and a fade effect. | `children` `current` `defaultCurrent` `onChange` `autoplay` `autoplaySpeed` `dots` `dotPosition` `arrows` `effect` +4 |
| `Marquee` `MarqueeContent` `MarqueeFade` `MarqueeItem` `MarqueeStyles` | A looping strip of content that pauses on hover. |  |
| `Empty` | The empty state for tables, lists and searches. | `image` `title` `description` `size` `children` |
| `PLACEMENT` `Tooltip` `TooltipContent` `TooltipProvider` `TooltipRoot` `TooltipTrigger` | A short hint on hover, in twelve placements. | `title` `placement` `children` `open` `defaultOpen` `onOpenChange` `mouseEnterDelay` `className` |
| `Popover` `PopoverAnchor` `PopoverContent` `PopoverTrigger` | A card anchored to an element, controls included. |  |

## Feedback

| Exports | What it is | Props |
| --- | --- | --- |
| `Alert` | An inline notice in four states — closable, with room for actions. | `message` `description` `type` `showIcon` `icon` `closable` `onClose` `afterClose` `banner` `action` |
| `MessageProvider` `message` | A slim notice at the top of the screen, called imperatively. |  |
| `NotificationProvider` `notification` | A card in the corner of the screen with a title, body and actions. |  |
| `Toaster` | Sonner’s toast, already wired to the kit’s tokens and theme. |  |
| `Dialog` `DialogClose` `DialogContent` `DialogDescription` `DialogOverlay` `DialogPortal` `DialogTitle` `DialogTrigger` `Modal` `useModal` | A dialog declared in JSX or called imperatively, turning into a sheet on narrow screens. | `open` `variant` `title` `description` `children` `onOk` `onCancel` `okText` `cancelText` `okVariant` +8 |
| `Sheet` `SheetClose` `SheetContent` `SheetDescription` `SheetFooter` `SheetHeader` `SheetTitle` `SheetTrigger` | A panel sliding in from an edge of the screen. |  |
| `Popconfirm` | A confirmation asked right next to the button just pressed. | `title` `description` `children` `onConfirm` `onCancel` `okText` `cancelText` `okVariant` `icon` `placement` +4 |
| `Progress` | A bar or ring, with success and error states. | `type` `size` `diameter` `strokeWidth` |
| `Spinner` | A spinner for buttons and for covering a block while it loads. |  |
| `Skeleton` | Pulsing grey blocks holding the layout while data loads. |  |
| `Result` | A result page for success and for 403 / 404 / 500. | `status` `title` `subTitle` `icon` `extra` `children` |
