import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { cn, isEmpty } from '../../utils';
import { ChevronDownIcon, XIcon } from 'lucide-react';

import { useConfig } from '../../lib/config';
import { Empty } from '../empty';
import { Input } from '../input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Tree } from '../tree';
import type { TreeNode } from '../tree';

export type TreeSelectProps = {
  treeData: TreeNode[];
  /** A key in single mode, an array of keys when `multiple` or `treeCheckable`. */
  value?: string | string[];
  onChange?: (value: string | string[] | undefined) => void;
  onBlur?: () => void;

  /** Checkboxes on every node; a parent check takes its whole subtree. */
  treeCheckable?: boolean;
  /** Several nodes selectable without checkboxes. Ignored when `treeCheckable`. */
  multiple?: boolean;
  /** Filter box above the tree. */
  showSearch?: boolean;
  treeDefaultExpandAll?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundContent?: ReactNode;
  disabled?: boolean;
  /** Collapses the overflow into "+N" once this many chips are shown. */
  maxTagCount?: number;

  id?: string;
  name?: string;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

const walk = (nodes: TreeNode[], visit: (node: TreeNode) => void) => {
  nodes.forEach((node) => {
    visit(node);
    if (node.children?.length) walk(node.children, visit);
  });
};

/**
 * Keeps a branch whose own label matches, or that still has a matching
 * descendant — dropping a parent would orphan the children the user came for.
 */
const filterTree = (nodes: TreeNode[], query: string): TreeNode[] => {
  const needle = query.trim().toLowerCase();

  if (!needle) return nodes;

  const keep = (node: TreeNode): TreeNode | null => {
    const children = node.children
      ?.map((child) => keep(child))
      .filter((child): child is TreeNode => child !== null);

    const self =
      typeof node.label === 'string' &&
      node.label.toLowerCase().includes(needle);

    if (!self && !children?.length) return null;

    // A branch kept only for its descendants shows just those descendants.
    return { ...node, children: self ? node.children : children };
  };

  return nodes
    .map((node) => keep(node))
    .filter((node): node is TreeNode => node !== null);
};

/**
 * A tree select: `Tree` in a dropdown, for picking from a
 * hierarchy — a category, a department, a permission node.
 *
 * ```tsx
 * <TreeSelect
 *   treeCheckable
 *   showSearch
 *   allowClear
 *   treeData={permissions}
 *   value={granted}
 *   onChange={setGranted}
 *   placeholder="Choose permissions"
 * />
 * ```
 *
 * It takes `value`/`onChange`/`onBlur` and the aria props, so it drops straight
 * into a `Form.Item`.
 *
 * When the options are a flat list, use `Select`; when the hierarchy is a fixed
 * number of levels the user drills through in order, `Cascader` reads better.
 */
export const TreeSelect = ({
  treeData,
  value,
  onChange,
  onBlur,
  treeCheckable = false,
  multiple = false,
  showSearch = false,
  treeDefaultExpandAll = false,
  allowClear = false,
  placeholder,
  searchPlaceholder,
  notFoundContent,
  disabled = false,
  maxTagCount,
  id,
  name,
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: TreeSelectProps) => {
  const { locale, renderEmpty } = useConfig();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const many = treeCheckable || multiple;

  // `Form.Item` seeds an empty field with '', which is not a valid multi value.
  const selected = useMemo<string[]>(() => {
    if (Array.isArray(value)) return value;
    if (isEmpty(value)) return [];
    return [value];
  }, [value]);

  const labels = useMemo(() => {
    const map = new Map<string, ReactNode>();
    walk(treeData, (node) => map.set(node.key, node.label));
    return map;
  }, [treeData]);

  const allKeys = useMemo(() => {
    const keys: string[] = [];
    walk(treeData, (node) => {
      if (node.children?.length) keys.push(node.key);
    });
    return keys;
  }, [treeData]);

  const visible = useMemo(
    () => (showSearch ? filterTree(treeData, search) : treeData),
    [treeData, search, showSearch],
  );

  const emit = (next: string[]) => onChange?.(many ? next : next[0]);

  const visibleTags = maxTagCount ? selected.slice(0, maxTagCount) : selected;
  const overflow = selected.length - visibleTags.length;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSearch('');
          onBlur?.();
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          name={name}
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          disabled={disabled}
          className={cn(
            'flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors',
            'focus-visible:outline-hidden focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1 py-1 text-left">
            {selected.length === 0 && (
              <span className="text-muted-foreground">
                {placeholder ?? locale.common?.selectPlaceholder ?? 'Select…'}
              </span>
            )}

            {many
              ? visibleTags.map((key) => (
                  <span
                    key={key}
                    className="flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground"
                  >
                    {labels.get(key) ?? key}
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={locale.common?.remove ?? 'Remove'}
                      onClick={(event) => {
                        // The trigger would otherwise open the popover.
                        event.stopPropagation();
                        emit(selected.filter((entry) => entry !== key));
                      }}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      <XIcon className="size-3" />
                    </span>
                  </span>
                ))
              : selected.length > 0 && (
                  <span className="truncate">
                    {labels.get(selected[0]) ?? selected[0]}
                  </span>
                )}

            {overflow > 0 && (
              <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                +{overflow}
              </span>
            )}
          </span>

          {allowClear && selected.length > 0 && (
            <span
              role="button"
              tabIndex={-1}
              aria-label={locale.common?.clear ?? 'Clear'}
              onClick={(event) => {
                event.stopPropagation();
                emit([]);
              }}
              className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </span>
          )}

          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-1">
        {showSearch && (
          <div className="p-1">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                searchPlaceholder ?? locale.common?.search ?? 'Search…'
              }
              className="h-8"
            />
          </div>
        )}

        <div className="max-h-64 overflow-y-auto p-1">
          {visible.length === 0 ? (
            notFoundContent ? (
              <p className="px-2 py-3 text-center text-sm text-muted-foreground">
                {notFoundContent}
              </p>
            ) : (
              (renderEmpty?.('tree-select') ?? <Empty size="sm" />)
            )
          ) : (
            <Tree
              data={visible}
              checkable={treeCheckable}
              checkedKeys={treeCheckable ? selected : undefined}
              onCheck={treeCheckable ? (keys) => emit(keys) : undefined}
              selectedKeys={treeCheckable ? undefined : selected}
              multiple={multiple}
              onSelect={
                treeCheckable
                  ? undefined
                  : (keys) => {
                      emit(keys);
                      if (!many) setOpen(false);
                    }
              }
              // Searching is pointless if the matches stay collapsed.
              defaultExpandedKeys={
                treeDefaultExpandAll || (showSearch && !!search.trim())
                  ? allKeys
                  : undefined
              }
              // Remounting on search rebuilds the uncontrolled expansion state,
              // so freshly filtered branches come back open.
              key={showSearch && search.trim() ? 'filtered' : 'all'}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
