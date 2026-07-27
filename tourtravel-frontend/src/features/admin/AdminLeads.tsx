import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, LayoutGrid, List as ListIcon, Loader2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import { AdminLeadForm } from '@/features/admin/AdminLeadForm';
import {
  assignLead,
  createLead,
  deactivateLead,
  getLeadPipeline,
  listLeads,
  updateLead,
  updateLeadStatus,
} from '@/services/leadService';
import { listAssignableStaff } from '@/services/userService';
import { LEAD_STATUSES } from '@/types/lead';
import type { LeadListItem, LeadListParams, LeadRequest, LeadStatus } from '@/types/lead';
import { CUSTOMER_SOURCES } from '@/types/customer';
import type { CustomerSource } from '@/types/customer';

const inputClass =
  'bg-background border border-border p-2 rounded text-foreground outline-none focus:ring-1 focus:ring-primary text-sm';

export const STATUS_BADGE: Record<LeadStatus, string> = {
  NEW: 'bg-blue-500/10 text-blue-500',
  CONTACTED: 'bg-amber-500/10 text-amber-500',
  QUALIFIED: 'bg-purple-500/10 text-purple-500',
  QUOTED: 'bg-cyan-500/10 text-cyan-500',
  WON: 'bg-emerald-500/10 text-emerald-500',
  LOST: 'bg-rose-500/10 text-rose-500',
};

function StatusSelect({
  leadId,
  currentStatus,
  onChanged,
}: {
  leadId: number;
  currentStatus: LeadStatus;
  onChanged: () => void;
}) {
  const mutation = useMutation({
    mutationFn: (status: LeadStatus) => updateLeadStatus(leadId, status),
    onSuccess: onChanged,
  });
  return (
    <select
      className={`${inputClass} text-xs py-1`}
      value={currentStatus}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => mutation.mutate(e.target.value as LeadStatus)}
      disabled={mutation.isPending}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export function AdminLeads() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'list' | 'pipeline'>('pipeline');
  const [isCreating, setIsCreating] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadListItem | null>(null);

  // ---- List view state ----
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<LeadStatus | ''>('');
  const [source, setSource] = useState<CustomerSource | ''>('');
  const [assignedToId, setAssignedToId] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data: staff } = useQuery({ queryKey: ['admin', 'staff', 'assignable'], queryFn: listAssignableStaff });

  const listParams: LeadListParams = {
    search: search || undefined,
    status: status || undefined,
    source: source || undefined,
    assignedToId: assignedToId || undefined,
    active: true,
    page,
    size: 20,
    sortBy,
    direction,
  };

  const listQuery = useQuery({
    queryKey: ['admin', 'leads', 'list', listParams],
    queryFn: () => listLeads(listParams),
    enabled: view === 'list',
  });

  const pipelineQuery = useQuery({
    queryKey: ['admin', 'leads', 'pipeline'],
    queryFn: getLeadPipeline,
    enabled: view === 'pipeline',
  });

  const invalidateLeads = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'leads'] });
    // Lead changes are logged onto the owning customer's timeline
    queryClient.invalidateQueries({ queryKey: ['admin', 'customer'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: LeadRequest) => createLead(payload),
    onSuccess: () => {
      invalidateLeads();
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: LeadRequest) => updateLead(editingLead!.id, payload),
    onSuccess: () => {
      invalidateLeads();
      setEditingLead(null);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateLead(id),
    onSuccess: invalidateLeads,
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, staffId }: { id: number; staffId: number | null }) => assignLead(id, staffId),
    onSuccess: invalidateLeads,
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

  const isFormOpen = isCreating || !!editingLead;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-border overflow-hidden">
            <button
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${view === 'pipeline' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}
              onClick={() => setView('pipeline')}
            >
              <LayoutGrid className="h-4 w-4" /> Pipeline
            </button>
            <button
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}
              onClick={() => setView('list')}
            >
              <ListIcon className="h-4 w-4" /> List
            </button>
          </div>
          {!isFormOpen && (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Lead
            </Button>
          )}
        </div>
      </div>

      {isCreating && (
        <AdminLeadForm
          isSubmitting={createMutation.isPending}
          onSubmit={(payload) => createMutation.mutate(payload)}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingLead && (
        <AdminLeadForm
          lead={editingLead}
          isSubmitting={updateMutation.isPending}
          onSubmit={(payload) => updateMutation.mutate(payload)}
          onCancel={() => setEditingLead(null)}
        />
      )}

      {!isFormOpen && view === 'pipeline' && (
        <div>
          {pipelineQuery.isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {LEAD_STATUSES.map((s) => {
                const leads = pipelineQuery.data?.[s] ?? [];
                return (
                  <div key={s} className="bg-card border border-border rounded-2xl p-3 min-h-[200px]">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${STATUS_BADGE[s]}`}>
                        {s}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">{leads.length}</span>
                    </div>
                    <div className="space-y-2">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-secondary/40 hover:bg-secondary/70 rounded-xl p-3 cursor-pointer transition-colors space-y-2"
                          onClick={() => setEditingLead(lead)}
                        >
                          <div className="font-bold text-sm text-foreground truncate">{lead.customerName}</div>
                          <div className="text-xs text-muted-foreground truncate">{lead.customerPhone}</div>
                          <div className="text-xs text-foreground/80 line-clamp-2">{lead.requirement}</div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                              {lead.assignedToName || 'Unassigned'}
                            </span>
                          </div>
                          <StatusSelect leadId={lead.id} currentStatus={lead.status} onChanged={invalidateLeads} />
                        </div>
                      ))}
                      {leads.length === 0 && (
                        <div className="text-center text-xs text-muted-foreground py-8">No leads</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!isFormOpen && view === 'list' && (
        <>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className={`${inputClass} w-full pl-9`}
                placeholder="Search by customer name, phone, or requirement..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <select
              className={inputClass}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as LeadStatus | '');
                setPage(0);
              }}
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
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
            <select
              className={inputClass}
              value={assignedToId}
              onChange={(e) => {
                setAssignedToId(e.target.value ? Number(e.target.value) : '');
                setPage(0);
              }}
            >
              <option value="">All Staff</option>
              {staff?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {listQuery.isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : listQuery.isError ? (
            <div className="p-12 text-center text-destructive font-bold border-2 border-destructive/20 rounded-3xl bg-destructive/5">
              Failed to load leads. Please check if the backend is running.
            </div>
          ) : (
            <div className="border border-border rounded-[2.5rem] bg-card overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3 w-1/4">Requirement</th>
                      <th className="px-6 py-3">Source</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Assigned</th>
                      <th className="px-6 py-3">
                        <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort('createdAt')}>
                          Added <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(listQuery.data?.content ?? []).map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => setEditingLead(lead)}
                      >
                        <td className="px-6 py-3">
                          <div className="font-medium text-foreground">{lead.customerName}</div>
                          <div className="text-xs text-muted-foreground">{lead.customerPhone}</div>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          <div className="line-clamp-2 max-w-xs">{lead.requirement}</div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 rounded bg-secondary text-[10px] font-bold uppercase tracking-wider">
                            {lead.source.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                          <StatusSelect leadId={lead.id} currentStatus={lead.status} onChanged={invalidateLeads} />
                        </td>
                        <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            className={`${inputClass} text-xs py-1`}
                            value={lead.assignedToId ?? ''}
                            onChange={(e) =>
                              assignMutation.mutate({
                                id: lead.id,
                                staffId: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                          >
                            <option value="">Unassigned</option>
                            {staff?.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Deactivate this lead?')) deactivateMutation.mutate(lead.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {(listQuery.data?.content ?? []).length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                          No leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {listQuery.data && (
            <Pagination page={listQuery.data.number} totalPages={listQuery.data.totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
