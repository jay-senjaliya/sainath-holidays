import { ReactNode } from 'react';
import { ArrowUpDown, Loader2 } from 'lucide-react';

export interface DataTableColumn<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  sortKey?: string;
  className?: string;
  align?: 'left' | 'right';
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  keyField: (row: T) => string | number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  onSortChange?: (field: string) => void;
  /** Mobile layouts differ enough per screen that this stays a render prop
   *  rather than being auto-derived from `columns`. */
  renderMobileCard: (row: T) => ReactNode;
}

// Shared list-table shell (desktop table + loading/error/empty states), factored
// out once a third admin list (Quotations) needed the same structure Customers
// and Leads had each hand-built independently. Those two screens are left as-is —
// this is available for them to adopt later, not a retrofit.
export function DataTable<T>({
  columns,
  rows,
  keyField,
  isLoading,
  isError,
  errorMessage = 'Failed to load data. Please check if the backend is running.',
  emptyMessage = 'No records found.',
  onRowClick,
  sortBy,
  direction,
  onSortChange,
  renderMobileCard,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center text-destructive font-bold border-2 border-destructive/20 rounded-3xl bg-destructive/5">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="border border-border rounded-[2.5rem] bg-card overflow-hidden shadow-xl">
      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-border">
        {rows.map((row) => (
          <div key={keyField(row)}>{renderMobileCard(row)}</div>
        ))}
        {rows.length === 0 && <div className="text-center py-16 text-muted-foreground">{emptyMessage}</div>}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary text-muted-foreground font-medium border-b border-border">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className={`px-6 py-3 ${col.align === 'right' ? 'text-right' : ''} ${col.className ?? ''}`}>
                  {col.sortKey && onSortChange ? (
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => onSortChange(col.sortKey!)}
                    >
                      {col.header} <ArrowUpDown className="h-3 w-3" />
                      {sortBy === col.sortKey && <span className="text-[9px]">({direction})</span>}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={keyField(row)}
                className={`border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.header} className={`px-6 py-3 ${col.align === 'right' ? 'text-right' : ''} ${col.className ?? ''}`}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
