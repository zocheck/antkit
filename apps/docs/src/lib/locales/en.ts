import type { Dictionary } from '../types';

export const en: Dictionary = {
  name: 'English',
  lang: 'en',

  chrome: {
    openMenu: 'Open the menu',
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
    language: 'Language',
    search: 'Search components…',
    noResults: 'No matches.',
    gettingStarted: 'Getting started',
    tagline: 'Declarative React components.',
    docs: 'Docs',
    components: 'Components',
    github: 'GitHub repository',
    searchTitle: 'Search the docs',
    searchDescription: 'Find a guide or a component by name.',
    hintNavigate: 'navigate',
    hintOpen: 'open',
    hintClose: 'close',
  },

  page: {
    onThisPage: 'On this page',
    api: 'API',
    prop: 'Prop',
    type: 'Type',
    default: 'Default',
    description: 'Description',
    linkTo: (title) => `Link to ${title}`,
    missingDemo: (path) =>
      `This page has no demos yet. Add ${path} and they show up here.`,
    demoBroken: 'This demo is throwing',
    showAll: (lines) => `Show all ${lines} lines`,
    copy: 'Copy code',
    copied: 'Copied',
  },

  home: {
    installCommand: 'pnpm add @antkit/react',
    headlineLead: 'Props that say what.',
    headlineRest: 'A Tailwind codebase.',
    subtitle: (components) =>
      `${components} React components whose props say what you want, on Radix primitives and Tailwind v4 tokens. Shipped as source, so your bundler compiles it and your agent can read it.`,
    ctaStart: 'Get started',
    ctaBrowse: 'Browse components',
    trust: 'MIT licensed · no build step · tree-shakeable',

    stats: {
      components: 'components',
      packages: 'packages',
      buildSteps: 'build steps',
      licence: 'licence',
    },

    api: {
      title: 'Props that describe the outcome',
      body: 'Form takes rules. Select takes options and mode. Table takes columns and dataSource. Nothing sits between your controls and your form — no schema library, no resolver, no adapter.',
    },
    radix: {
      title: 'Radix underneath, Tailwind on top',
      body: 'Roles, focus management and the keyboard model come from Radix primitives, so a dialog traps focus and a menu answers to arrow keys without you writing any of it. The look is Tailwind v4 utilities you override with the same classes as the rest of your app.',
    },
    tokens: {
      title: 'One CSS file of tokens',
      body: '@antkit/styles is colour, radius and the type scale as CSS variables, plus a dark variant. Change a token and every component follows — no theme provider, no runtime, no rebuild.',
    },
    agents: {
      title: 'Written to be read by agents',
      body: 'Every component carries a doc block with an example that would actually compile. npx antkit-skills links the guide into your project, and @antkit/mcp serves the same material as tools. Your agent reads the real source out of node_modules, not a summary of it.',
    },
    gallery: {
      title: (groups, components) =>
        `${groups} groups, ${components} components`,
      body: 'Everything an admin panel needs, from a button to a Gantt chart.',
      cta: 'See all components',
    },
    install: {
      title: 'Two packages, one import line',
      body: 'Add the packages, point Tailwind at the source, import the stylesheet. That is the whole setup.',
      cta: 'Read the installation guide',
    },
    footer: {
      docs: 'Docs',
      components: 'Components',
      source: 'Source',
      licence: 'MIT licensed.',
    },
  },

  guides: {
    introduction: 'Introduction',
    installation: 'Installation',
  },

  groups: {
    general: 'General',
    layout: 'Layout',
    navigation: 'Navigation',
    dataEntry: 'Data entry',
    dataDisplay: 'Data display',
    feedback: 'Feedback',
  },

  components: {
    button:
      'Six variants, five sizes, a loading state and an icon slot at each end.',
    typography:
      'Headings, paragraphs and inline text on the @antkit/styles type scale.',

    layout: 'Page frame: header, collapsible sider, content and footer.',
    sidebar:
      'The navigation rail: menu groups, submenus, and an icon-only collapsed mode.',
    card: 'A content block with a header, description, body and footer.',
    separator: 'A horizontal or vertical rule between blocks of content.',
    'scroll-shadow':
      'A scroll container that fades whichever edge still has content past it.',

    breadcrumb: 'The trail of ancestors above the current page.',
    'dropdown-menu':
      'A menu off a button: plain items, checkboxes, radios, groups and submenus.',
    'command-menu':
      'The ⌘K palette: a search box over a list of actions, opened from anywhere.',
    tabs: 'Switch panels, in a default or underline variant.',
    steps: 'Progress through a multi-step task, horizontally or vertically.',

    form: 'Declarative forms: rules on the field, no schema, no resolver.',
    input:
      'A single-line field: every HTML type, error state, icons and buttons attached.',
    textarea:
      'A multi-line field that grows with its content and counts characters.',
    'input-number':
      'A number field with steppers, currency formatting and min/max bounds.',
    label: 'A label bound to a control — clicking it focuses the control.',
    select:
      'One component covering every variant: single, multiple, tags, search, groups.',
    'auto-complete':
      'A free-text field that suggests, but never forces, a value.',
    cascader: 'Drill through a fixed-depth hierarchy one column at a time.',
    'tree-select': 'A select whose list is a tree with checkable branches.',
    transfer: 'Two columns to move items between — permissions, tags, members.',
    checkbox: 'A three-state tick box, indeterminate included.',
    'checkbox-group': 'Several options sharing one array of values.',
    radio:
      'Pick one of several, with an optional line of help under each label.',
    switch: 'An instant on/off, with a loading state for when it calls an API.',
    segmented: 'A row of buttons picking one value — tighter than Radio.',
    slider: 'One or two handles, with marks and a value tooltip.',
    rate: 'Star rating, with half stars and a character of your choosing.',
    'date-picker':
      'Type into dd/mm/yyyy segments or open the calendar; ranges included.',
    'time-picker': 'Pick a time by column, 12h or 24h, ranges included.',
    dropzone: 'A drop area for files, with type, size and count limits.',
    'rich-text-editor':
      'A formatting editor with images and tables — load it lazily.',

    table:
      'The data grid: sorting, row selection, fixed and resizable columns, expandable rows, pagination.',
    pagination:
      'Page numbers, with a size changer, a jump-to box and a simple mode.',
    descriptions: 'Label–value pairs for a detail page.',
    statistic: 'A headline number with a prefix, suffix and trend.',
    tag: 'A coloured chip — closable, or toggled like a checkbox.',
    badge: 'A small status label in eight prebuilt tones.',
    'count-badge': 'A dot or count pinned to the corner of something else.',
    status: 'A status dot with a label and an optional pulse.',
    avatar: 'A profile image with initials to fall back on.',
    image: 'An image with a placeholder, an error fallback and a zoom viewer.',
    'image-zoom': 'Zoom an image in place on click.',
    comparison: 'Drag a handle to compare a before and after image.',
    calendar:
      'A calendar mounted straight into the page, for a date or a range.',
    timeline: 'A timeline where each item’s status colours its dot and rail.',
    tree: 'A hierarchy with branch-wide checking, connector lines and icons.',
    collapsible: 'Open and close a block of content.',
    kanban: 'Columns of cards, dragged within and between columns.',
    list: 'Grouped rows, dragged vertically between groups.',
    gantt: 'A schedule by day, week or month, with markers and zoom.',
    carousel:
      'Slides that snap, with dots, arrows, autoplay and a fade effect.',
    marquee: 'A looping strip of content that pauses on hover.',
    empty: 'The empty state for tables, lists and searches.',
    tooltip: 'A short hint on hover, in twelve placements.',
    popover: 'A card anchored to an element, controls included.',

    alert: 'An inline notice in four states — closable, with room for actions.',
    message: 'A slim notice at the top of the screen, called imperatively.',
    notification:
      'A card in the corner of the screen with a title, body and actions.',
    toast: 'Sonner’s toast, already wired to the kit’s tokens and theme.',
    modal:
      'A dialog declared in JSX or called imperatively, turning into a sheet on narrow screens.',
    sheet: 'A panel sliding in from an edge of the screen.',
    popconfirm: 'A confirmation asked right next to the button just pressed.',
    progress: 'A bar or ring, with success and error states.',
    spinner: 'A spinner for buttons and for covering a block while it loads.',
    skeleton: 'Pulsing grey blocks holding the layout while data loads.',
    result: 'A result page for success and for 403 / 404 / 500.',
  },
};
