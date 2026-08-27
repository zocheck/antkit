import type { ReactNode } from 'react';

/**
 * The strings the kit renders without being handed one, grouped by the
 * component that asks for each — a translator needs the context.
 *
 * Every key is optional and every one falls back to English at the place it is
 * read, so a locale is only ever the difference from English:
 *
 * ```tsx
 * <ConfigProvider locale={{ common: { ok: 'Đồng ý' } }}>
 * ```
 *
 * That is also what keeps it weightless. There is no English pack to ship —
 * `Button`'s default lives in `button.tsx` and leaves with it if you never
 * import the component.
 */
export type Locale = {
  /** The name of this locale, for a language switcher. */
  name?: string;
  /** BCP 47 tag. Components that format dates and numbers use it. */
  lang?: string;

  common?: {
    ok?: string;
    cancel?: string;
    close?: string;
    clear?: string;
    remove?: string;
    search?: string;
    noData?: string;
    selectPlaceholder?: string;
    /** On a button while its action is in flight. */
    processing?: string;
    /** The accessible name of a `Button`'s spinner. */
    loading?: string;
    /** Announced for a dialog the caller left untitled. */
    dialog?: string;
    dialogDescription?: string;
    expand?: string;
    collapse?: string;
    copy?: string;
    copied?: string;
  };

  pagination?: {
    rowsPerPage?: string;
    perPage?: string;
    previousPage?: string;
    nextPage?: string;
    jumpToPage?: string;
    go?: string;
  };

  table?: {
    selectAll?: string;
    selectRow?: string;
    expandRow?: string;
    collapseRow?: string;
    resizeColumn?: string;
  };

  carousel?: {
    label?: string;
    slide?: string;
    previousSlide?: string;
    nextSlide?: string;
    goToSlide?: string;
  };

  transfer?: {
    source?: string;
    target?: string;
    toSource?: string;
    toTarget?: string;
  };

  datePicker?: {
    openCalendar?: string;
    clearDate?: string;
    clearRange?: string;
    /** What an empty segment shows: `dd`, `mm`, `yyyy`. */
    placeholders?: { day?: string; month?: string; year?: string };
    /** The accessible name of each segment. */
    segments?: { day?: string; month?: string; year?: string };
    calendar?: {
      previousMonth?: string;
      nextMonth?: string;
      monthSelect?: string;
      yearSelect?: string;
    };
  };

  timePicker?: {
    openPanel?: string;
    clearTime?: string;
    clearRange?: string;
    now?: string;
    startTime?: string;
    endTime?: string;
    placeholders?: {
      hour?: string;
      minute?: string;
      second?: string;
      dayPeriod?: string;
    };
    segments?: {
      hour?: string;
      minute?: string;
      second?: string;
      dayPeriod?: string;
    };
    dayPeriod?: { am?: string; pm?: string };
  };

  image?: {
    open?: string;
    close?: string;
    zoomIn?: string;
    zoomOut?: string;
    rotateLeft?: string;
    rotateRight?: string;
    zoom?: string;
    unzoom?: string;
  };

  dropzone?: {
    title?: string;
    description?: string;
    remove?: string;
    files?: (count: number) => string;
    /** Reads the constraints back to the user; `null` hides the line. */
    hint?: (options: {
      accept?: string;
      minSize?: number;
      maxSize?: number;
      maxFiles?: number;
    }) => ReactNode;
    rejectedType?: (name: string) => string;
    rejectedTooLarge?: (name: string, max: string) => string;
    rejectedTooSmall?: (name: string, min: string) => string;
    rejectedTooMany?: (name: string, limit: number) => string;
  };

  inputNumber?: { increase?: string; decrease?: string };

  layout?: { collapseMenu?: string };

  modal?: { grabToClose?: string };

  /** Only reached by `RichTextEditor`, which is outside the root barrel. */
  editor?: {
    undo?: string;
    redo?: string;
    bold?: string;
    italic?: string;
    underline?: string;
    strike?: string;
    inlineCode?: string;
    subscript?: string;
    superscript?: string;
    bulletList?: string;
    orderedList?: string;
    taskList?: string;
    blockquote?: string;
    codeBlock?: string;
    horizontalRule?: string;
    clearFormatting?: string;
    bodyText?: string;
    heading?: (level: number) => string;
    alignment?: string;
    alignLeft?: string;
    alignCenter?: string;
    alignRight?: string;
    alignJustify?: string;
    insertLink?: string;
    removeLink?: string;
    save?: string;
    textColour?: string;
    clearTextColour?: string;
    highlight?: string;
    clearHighlight?: string;
    insertImage?: string;
    chooseImage?: string;
    uploading?: string;
    insert?: string;
    table?: string;
    insertTable?: string;
    columnBefore?: string;
    columnAfter?: string;
    deleteColumn?: string;
    rowAbove?: string;
    rowBelow?: string;
    deleteRow?: string;
    mergeCells?: string;
    toggleHeaderRow?: string;
    deleteTable?: string;
    unreadableFile?: string;
    imageTooLarge?: (name: string, maxMb: number) => string;
  };

  /** What a failing `Form` rule says when it carries no `message` of its own. */
  validation?: {
    required?: string;
    email?: string;
    url?: string;
    number?: string;
    integer?: string;
    min?: string;
    max?: string;
    len?: string;
    pattern?: string;
    invalid?: string;
  };
};
