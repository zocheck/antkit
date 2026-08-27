import {
  BellRingIcon,
  CompassIcon,
  PanelsTopLeftIcon,
  RocketIcon,
  SparklesIcon,
  Table2Icon,
  TextCursorInputIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { GroupId } from './types';

/**
 * One icon per section, so a group is recognisable before it is read. Shared
 * by the sidebar and the landing page's gallery — they name the same six
 * things and would look unrelated with two sets of icons.
 */
export const GROUP_ICONS: Record<GroupId | 'guides', LucideIcon> = {
  guides: RocketIcon,
  general: SparklesIcon,
  layout: PanelsTopLeftIcon,
  navigation: CompassIcon,
  dataEntry: TextCursorInputIcon,
  dataDisplay: Table2Icon,
  feedback: BellRingIcon,
};
