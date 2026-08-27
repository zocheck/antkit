import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../utils';
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react';

import { Checkbox } from '../checkbox';

export type TreeNode = {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  /** Marks a node as a folder even before its children are loaded. */
  isLeaf?: boolean;
};

export type TreeProps = {
  data: TreeNode[];

  /** Uncontrolled starting state. Ignored when `expandedKeys` is passed. */
  defaultExpandedKeys?: string[];
  expandedKeys?: string[];
  onExpand?: (keys: string[]) => void;

  selectedKeys?: string[];
  onSelect?: (keys: string[], node: TreeNode) => void;
  /** Allows more than one selected node. Ignored when `checkable`. */
  multiple?: boolean;
  /**
   * What clicking a node's label does. Selectable labels select; the rest fall
   * through to the checkbox when `checkable`.
   *
   * Defaults to `!checkable`, so a checkable tree ticks on a label click — the
   * checkbox alone is a 16px target and everyone aims at the text. Pass `true`
   * alongside `checkable` if you genuinely need both a highlight and a tick.
   */
  selectable?: boolean;

  /** Adds a checkbox per node, with parents reflecting their children. */
  checkable?: boolean;
  checkedKeys?: string[];
  onCheck?: (keys: string[], node: TreeNode) => void;

  /** Draws the elbow connectors that tie a child back to its parent. */
  showLines?: boolean;
  /** Falls back to folder/file icons for nodes that don't bring their own. */
  showIcons?: boolean;
  /** Pixels a level is pushed in by. The connectors follow it. */
  indent?: number;

  className?: string;
};

const collectKeys = (nodes: TreeNode[], into: string[] = []) => {
  nodes.forEach((node) => {
    into.push(node.key);
    if (node.children?.length) collectKeys(node.children, into);
  });
  return into;
};

/** Every ancestor of `key`, nearest last. Used to re-check parents. */
const pathTo = (
  nodes: TreeNode[],
  key: string,
  trail: TreeNode[] = [],
): TreeNode[] | null => {
  for (const node of nodes) {
    if (node.key === key) return trail;
    if (node.children?.length) {
      const found = pathTo(node.children, key, [...trail, node]);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Hierarchical list with expand/collapse, selection and optional checkboxes.
 *
 * ```tsx
 * <Tree
 *   checkable
 *   data={[
 *     { key: 'academy', label: 'Học vụ', children: [
 *       { key: 'course', label: 'Khoá học' },
 *       { key: 'exam', label: 'Đề thi' },
 *     ]},
 *   ]}
 *   checkedKeys={checked}
 *   onCheck={setChecked}
 * />
 * ```
 *
 * Expansion, selection and checking each work controlled or uncontrolled — pass
 * the `*Keys` prop to drive it yourself, leave it off to let the tree remember.
 *
 * Checking a parent checks its whole subtree, and a parent shows the
 * indeterminate state while only some of its descendants are checked.
 *
 * With `checkable` on, clicking a node's label ticks it — see `selectable` for
 * the rule and how to get a highlight and a tick at the same time.
 *
 * `showLines` and `showIcons` turn it into a file-explorer view:
 *
 * ```tsx
 * <Tree showLines showIcons data={files} defaultExpandedKeys={['src']} />
 * ```
 */
export const Tree = ({
  data,
  defaultExpandedKeys,
  expandedKeys,
  onExpand,
  selectedKeys,
  onSelect,
  multiple = false,
  checkable = false,
  checkedKeys,
  onCheck,
  selectable = !checkable,
  showLines = false,
  showIcons = false,
  indent = 16,
  className,
}: TreeProps) => {
  const [ownExpanded, setOwnExpanded] = useState<string[]>(
    defaultExpandedKeys ?? [],
  );
  const [ownSelected, setOwnSelected] = useState<string[]>([]);
  const [ownChecked, setOwnChecked] = useState<string[]>([]);

  const expanded = expandedKeys ?? ownExpanded;
  const selected = selectedKeys ?? ownSelected;
  const checked = checkedKeys ?? ownChecked;

  const checkedSet = useMemo(() => new Set(checked), [checked]);

  const setExpanded = (next: string[]) => {
    if (!expandedKeys) setOwnExpanded(next);
    onExpand?.(next);
  };

  const toggleExpand = (key: string) => {
    setExpanded(
      expanded.includes(key)
        ? expanded.filter((entry) => entry !== key)
        : [...expanded, key],
    );
  };

  const select = (node: TreeNode) => {
    if (node.disabled) return;

    const next = multiple
      ? selected.includes(node.key)
        ? selected.filter((entry) => entry !== node.key)
        : [...selected, node.key]
      : [node.key];

    if (!selectedKeys) setOwnSelected(next);
    onSelect?.(next, node);
  };

  const check = (node: TreeNode) => {
    if (node.disabled) return;

    const subtree = collectKeys([node]);
    const isChecked = checkedSet.has(node.key);
    const next = new Set(checked);

    // A parent owns its whole subtree, so ticking it ticks everything under it.
    subtree.forEach((key) => (isChecked ? next.delete(key) : next.add(key)));

    // Then walk back up: an ancestor is checked only once every child is.
    const ancestors = pathTo(data, node.key) ?? [];
    [...ancestors].reverse().forEach((ancestor) => {
      const children = ancestor.children ?? [];
      const allOn = children.every((child) => next.has(child.key));
      if (allOn) next.add(ancestor.key);
      else next.delete(ancestor.key);
    });

    const result = [...next];
    if (!checkedKeys) setOwnChecked(result);
    onCheck?.(result, node);
  };

  return (
    <div data-slot="tree" role="tree" className={cn('text-sm', className)}>
      {data.map((node, index) => (
        <TreeItem
          key={node.key}
          node={node}
          depth={0}
          isLast={index === data.length - 1}
          ancestorsLast={EMPTY_PATH}
          expanded={expanded}
          selected={selected}
          checkedSet={checkedSet}
          checkable={checkable}
          selectable={selectable}
          showLines={showLines}
          showIcons={showIcons}
          indent={indent}
          onToggleExpand={toggleExpand}
          onSelect={select}
          onCheck={check}
        />
      ))}
    </div>
  );
};

const EMPTY_PATH: boolean[] = [];

/**
 * Half a level, which is where the chevron of a node at that level sits: the
 * row starts at `depth * indent + ROW_PADDING` and the chevron is 16px wide.
 */
const GUIDE_OFFSET = 12;
const ROW_PADDING = 4;

const defaultIcon = (isFolder: boolean, isOpen: boolean) => {
  if (!isFolder) return <FileIcon />;
  return isOpen ? <FolderOpenIcon /> : <FolderIcon />;
};

type TreeItemProps = {
  node: TreeNode;
  depth: number;
  /** Last among its siblings — its connector stops at the elbow. */
  isLast: boolean;
  /** `isLast` of every ancestor, root first. Decides which guides continue. */
  ancestorsLast: boolean[];
  expanded: string[];
  selected: string[];
  checkedSet: Set<string>;
  checkable: boolean;
  selectable: boolean;
  showLines: boolean;
  showIcons: boolean;
  indent: number;
  onToggleExpand: (key: string) => void;
  onSelect: (node: TreeNode) => void;
  onCheck: (node: TreeNode) => void;
};

const TreeItem = ({
  node,
  depth,
  isLast,
  ancestorsLast,
  expanded,
  selected,
  checkedSet,
  checkable,
  selectable,
  showLines,
  showIcons,
  indent,
  onToggleExpand,
  onSelect,
  onCheck,
}: TreeItemProps) => {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;
  const isOpen = expanded.includes(node.key);
  const isSelected = selected.includes(node.key);
  // A node with `isLeaf: false` is a folder that hasn't loaded its children yet.
  const isFolder = hasChildren || node.isLeaf === false;

  const icon = node.icon ?? (showIcons ? defaultIcon(isFolder, isOpen) : null);

  const descendants = hasChildren ? collectKeys(children) : [];
  const checkedCount = descendants.filter((key) => checkedSet.has(key)).length;
  const state: boolean | 'indeterminate' = checkedSet.has(node.key)
    ? true
    : checkedCount > 0
      ? 'indeterminate'
      : false;

  return (
    <div
      role="treeitem"
      aria-expanded={hasChildren ? isOpen : undefined}
      aria-selected={selectable ? isSelected : undefined}
      // `mixed` is what ARIA calls the partly-checked parent that the checkbox
      // draws as a dash.
      aria-checked={
        checkable ? (state === 'indeterminate' ? 'mixed' : state) : undefined
      }
      aria-disabled={node.disabled || undefined}
    >
      <div
        className={cn(
          'relative flex h-8 items-center gap-1.5 rounded-md pr-2 transition-colors',
          !node.disabled && 'hover:bg-accent hover:text-accent-foreground',
          // A fully checked row reads as chosen the same way a selected one
          // does. Without it a `checkable` tree — which never sets
          // `selectedKeys` — has nothing but a 16px box to scan by. A
          // half-checked parent stays plain: it was not picked, its children
          // were.
          (isSelected || (checkable && state === true)) &&
            'bg-accent text-accent-foreground',
          node.disabled && 'cursor-not-allowed opacity-50',
        )}
        // Indent with padding rather than nested margins so the hover
        // highlight still spans the full row.
        style={{ paddingLeft: depth * indent + ROW_PADDING }}
      >
        {showLines && depth > 0 && (
          <TreeGuides
            depth={depth}
            isLast={isLast}
            ancestorsLast={ancestorsLast}
            indent={indent}
          />
        )}

        <button
          type="button"
          tabIndex={hasChildren ? 0 : -1}
          aria-hidden={!hasChildren}
          onClick={() => hasChildren && onToggleExpand(node.key)}
          className={cn(
            'flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground',
            hasChildren ? 'cursor-pointer hover:text-foreground' : 'invisible',
          )}
        >
          <ChevronRightIcon
            className={cn(
              'size-3.5 transition-transform',
              isOpen && 'rotate-90',
            )}
          />
        </button>

        {checkable && (
          <Checkbox
            checked={state}
            disabled={node.disabled}
            onCheckedChange={() => onCheck(node)}
            className="shrink-0"
          />
        )}

        <button
          type="button"
          disabled={node.disabled}
          // A selectable label selects; otherwise it falls through to the
          // checkbox, so a checkable tree is driven by the text rather than by
          // a 16px box. Same rule rc-tree uses.
          onClick={() =>
            selectable ? onSelect(node) : checkable ? onCheck(node) : undefined
          }
          className={cn(
            'flex min-w-0 flex-1 items-center gap-1.5 text-left disabled:cursor-not-allowed',
            selectable || checkable ? 'cursor-pointer' : 'cursor-default',
          )}
        >
          {!!icon && (
            <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-4">
              {icon}
            </span>
          )}
          <span className="truncate">{node.label}</span>
        </button>
      </div>

      {hasChildren && isOpen && (
        <div role="group">
          {children.map((child, index) => (
            <TreeItem
              key={child.key}
              node={child}
              depth={depth + 1}
              isLast={index === children.length - 1}
              ancestorsLast={[...ancestorsLast, isLast]}
              expanded={expanded}
              selected={selected}
              checkedSet={checkedSet}
              checkable={checkable}
              selectable={selectable}
              showLines={showLines}
              showIcons={showIcons}
              indent={indent}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onCheck={onCheck}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type TreeGuidesProps = {
  depth: number;
  isLast: boolean;
  ancestorsLast: boolean[];
  indent: number;
};

/**
 * The connector lines left of a row. Each level owns one column: the column of
 * an ancestor only keeps its vertical line while that ancestor still has
 * siblings below, otherwise the branch has ended and the line would dangle.
 */
const TreeGuides = ({
  depth,
  isLast,
  ancestorsLast,
  indent,
}: TreeGuidesProps) => {
  const elbow = (depth - 1) * indent + GUIDE_OFFSET;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0">
      {/* Columns of the grandparents and above, skipping ended branches. */}
      {ancestorsLast
        .slice(1)
        .map((ended, level) =>
          ended ? null : (
            <span
              key={level}
              className="absolute inset-y-0 border-l border-border"
              style={{ left: level * indent + GUIDE_OFFSET }}
            />
          ),
        )}

      {/* The parent's column, down to this row's elbow… */}
      <span
        className="absolute top-0 h-1/2 border-l border-border"
        style={{ left: elbow }}
      />
      {/* …and past it while siblings follow. */}
      {!isLast && (
        <span
          className="absolute top-1/2 bottom-0 border-l border-border"
          style={{ left: elbow }}
        />
      )}

      <span
        className="absolute top-1/2 border-t border-border"
        style={{ left: elbow, width: indent - ROW_PADDING }}
      />
    </div>
  );
};
