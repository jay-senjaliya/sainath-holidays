import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, ArrowUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import { AdminCustomerForm } from '@/features/admin/AdminCustomerForm';
import {
  createCustomer,
  deactivateCustomer,
  listCustomers,
} from '@/services/customerService';
import { CUSTOMER_SOURCES } from '@/types/customer';
import type { CustomerListParams, CustomerRequest, CustomerSource } from '@/types/customer';

const inputClass =
  'bg-background border border-border p-2 rounded text-foreground outline-none focus:ring-1 focus:ring-primary text-sm';

export function AdminCustomers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<CustomerSource | ''>('');
  const [city, setCity] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  // Debounce free-text search so every keystroke doesn't trigger a request
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params: CustomerListParams = {
    search: search || undefined,
    source: source || undefined,
    city: city || undefined,
    // Default to active-only, matching how the rest of the admin panel treats
    // soft-deleted records; "Show inactive" lifts the filter entirely rather
    // than flipping it, so archived customers are still findable.
    active: showInactive ? undefined : true,
    page,
    size: 20,
    sortBy,
    direction,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: () => listCustomers(params),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CustomerRequest) => createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      setIsCreating(false);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateCustomer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] }),
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

  const customers = data?.content ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Customer
          </Button>
        )}
      </div>

      {isCreating ? (
        <AdminCustomerForm
          isSubmitting={createMutation.isPending}
          onSubmit={(payload) => createMutation.mutate(payload)}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <>
          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className={`${inputClass} w-full pl-9`}
                placeholder="Search by name, email, or phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <select
              className={inputClass}
              value={source}
              onChange={(e) => {
                setSource(e.target.value as CustomerSource | '');
                setPage(0);
              }}
            >
              <option value="">All Sources</option>
              {CUSTOMER_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
            <input
              className={inputClass}
              placeholder="Filter by city..."
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(0);
              }}
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground px-2 whitespace-nowrap">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={showInactive}
                onChange={(e) => {
                  setShowInactive(e.target.checked);
                  setPage(0);
                }}
              />
              Show inactive
            </label>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-destructive font-bold border-2 border-destructive/20 rounded-3xl bg-destructive/5">
              Failed to load customers. Please check if the backend is running.
            </div>
          ) : (
            <div className="border border-border rounded-[2.5rem] bg-card overflow-hidden shadow-xl">
              {/* Mobile Card List */}
              <div className="md:hidden divide-y divide-border">
                {customers.map((c) => (
                  <div
                    key={c.id}
                    className="p-6 space-y-3 cursor-pointer"
                    onClick={() => navigate(`/admin/customers/${c.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-black text-foreground text-lg leading-none">{c.name}</div>
                        <div className="text-xs text-muted-foreground font-medium mt-1">{c.phone}</div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                          c.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{c.city || '—'}</span>
                      <span className="uppercase tracking-wider">{c.source.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
                {customers.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">No customers found.</div>
                )}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="px-6 py-3">
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('name')}>
                          Name <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('city')}>
                          City <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3">Source</th>
                      <th className="px-6 py-3">
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('createdAt')}>
                          Added <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/customers/${c.id}`)}
                      >
                        <td className="px-6 py-3 font-medium">{c.name}</td>
                        <td className="px-6 py-3">{c.phone}</td>
                        <td className="px-6 py-3 text-muted-foreground">{c.email || '—'}</td>
                        <td className="px-6 py-3">{c.city || '—'}</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 rounded bg-secondary text-[10px] font-bold uppercase tracking-wider">
                            {c.source.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {new Date(c.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              c.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            {c.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!c.active}
                            onClick={() => {
                              if (confirm(`Deactivate ${c.name}?`)) deactivateMutation.mutate(c.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-muted-foreground">
                          No customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data && <Pagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
