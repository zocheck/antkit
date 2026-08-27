import { Prose } from './prose';
import { useT } from '../lib/i18n';
import type { ApiTable } from '../lib/types';

/**
 * A plain table rather than `<Table>` from the kit: these rows are static
 * prose that has to wrap, and the data grid is built for fixed-height cells.
 */
export const PropsTable = ({ table }: { table: ApiTable }) => {
  const t = useT();

  return (
    <div className="grid gap-2">
      <div>
        <h3 className="font-mono text-sm font-medium">{table.title}</h3>
        {!!table.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {table.description}
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[42rem] border-collapse text-sm">
          <thead>
            <tr className="bg-muted/60 text-left">
              <th className="px-4 py-2.5 font-medium">{t.page.prop}</th>
              <th className="px-4 py-2.5 font-medium">{t.page.type}</th>
              <th className="px-4 py-2.5 font-medium">{t.page.default}</th>
              <th className="px-4 py-2.5 font-medium">{t.page.description}</th>
            </tr>
          </thead>
          <tbody>
            {table.props.map((row) => (
              <tr key={row.name} className="border-t border-border align-top">
                <td className="px-4 py-2.5 font-mono text-[13px] whitespace-nowrap">
                  {row.name}
                </td>
                <td className="tok-type px-4 py-2.5 font-mono text-[13px] break-words">
                  {row.type}
                </td>
                <td className="px-4 py-2.5 font-mono text-[13px] whitespace-nowrap text-muted-foreground">
                  {row.default ?? '—'}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  <Prose text={row.description} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
