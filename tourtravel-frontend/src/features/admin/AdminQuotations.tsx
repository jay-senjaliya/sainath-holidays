import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { AdminQuotationForm } from '@/features/admin/AdminQuotationForm';
import { createQuotation, listQuotations } from '@/services/quotationService';
import { QUOTATION_STATUSES } from '@/types/quotation';
import type { QuotationListItem, QuotationListParams, QuotationRequest, QuotationStatus } from '@/types/quotation';

const inputClass =
  'bg-background border border-border p-2 rounded text-foreground outline-none focus:ring-1 focus:ring-primary text-sm';

export const QUOTATION_STATUS_BADGE: Record<QuotationStatus, string> = {
  DRAFT: 'bg-secondary text-muted-foreground',
  SENT: 'bg-blue-500/10 text-blue-500',
  ACCEPTED: 'bg-emerald-500/10 text-emerald-500',
  REJECTED: 'bg-rose-500/10 text-rose-500',
  EXPIRED: 'bg-amber-500/10 text-amber-500',
};

export function AdminQuotations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<QuotationStatus | ''>('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params: QuotationListParams = {
    search: search || undefined,
    status: status || undefined,
    active: true,
    page,
    size: 20,
    sortBy,
    direction,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'quotations', params],
    queryFn: () => listQuotations(params),
  });

  const createMutation = useMutation({
    mutationFn: (payload: QuotationRequest) => createQuotation(payload),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quotations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer'] });
      setIsCreating(false);
      navigate(`/admin/quotations/${created.id}`);
    },
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setDirection('asc');
    }
    setPage(0);
  };

  const columns: DataTableColumn<QuotationListItem>[] = [
    { header: 'Quote #', accessor: (q) => <span className="font-bold text-foreground">{q.quotationNumber}</span> },
    {
      header: 'Customer',
      accessor: (q) => (
        <div>
          <div className="font-medium text-foreground">{q.customerName}</div>
          <div className="text-xs text-muted-foreground">{q.customerPhone}</div>
        </div>
      ),
    },
    { header: 'Package', accessor: (q) => q.packageTitle || <span className="text-muted-foreground">Custom</span> },
    {
      header: 'Items',
      align: 'right',
      accessor: (q) => (q.itemCount > 0 ? q.itemCount : <span className="text-muted-foreground">—</span>),
    },
    {
      header: 'Travel Date',
      sortKey: 'travelDate',
      accessor: (q) => new Date(q.travelDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      header: 'Final Amount',
      sortKey: 'finalAmount',
      align: 'right',
      accessor: (q) => `₹${q.finalAmount.toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: (q) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${QUOTATION_STATUS_BADGE[q.status]}`}>
          {q.status}
        </span>
      ),
    },
    {
      header: 'Added',
      sortKey: 'createdAt',
      accessor: (q) => new Date(q.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
    },
  ];

  const isFormOpen = isCreating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
        {!isFormOpen && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Quotation
          </Button>
        )}
      </div>

      {isCreating ? (
        <AdminQuotationForm
          isSubmitting={createMutation.isPending}
          onSubmit={(payload) => createMutation.mutate(payload)}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className={`${inputClass} w-full pl-9`}
                placeholder="Search by quote number, customer name, or phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <select
              className={inputClass}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as QuotationStatus | '');
                setPage(0);
              }}
            >
              <option value="">All Statuses</option>
              {QUOTATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <DataTable
            columns={columns}
            rows={data?.content ?? []}
            keyField={(q) => q.id}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="No quotations found."
            onRowClick={(q) => navigate(`/admin/quotations/${q.id}`)}
            sortBy={sortBy}
            direction={direction}
            onSortChange={toggleSort}
            renderMobileCard={(q) => (
              <div className="p-6 space-y-3 cursor-pointer" onClick={() => navigate(`/admin/quotations/${q.id}`)}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-black text-foreground leading-none">{q.quotationNumber}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1">{q.customerName}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${QUOTATION_STATUS_BADGE[q.status]}`}>
                    {q.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{q.packageTitle || 'Custom'}</span>
                  <span className="font-bold text-foreground">₹{q.finalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
          />

          {data && <Pagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
