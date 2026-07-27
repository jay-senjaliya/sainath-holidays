import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Clock, FileText, Loader2, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminCustomerForm } from '@/features/admin/AdminCustomerForm';
import { AdminLeadForm } from '@/features/admin/AdminLeadForm';
import { STATUS_BADGE } from '@/features/admin/AdminLeads';
import { AdminQuotationForm } from '@/features/admin/AdminQuotationForm';
import { QUOTATION_STATUS_BADGE } from '@/features/admin/AdminQuotations';
import {
  deactivateCustomer,
  getCustomer,
  getCustomerTimeline,
  updateCustomer,
} from '@/services/customerService';
import { createLead, listLeads } from '@/services/leadService';
import { createQuotation, listQuotations } from '@/services/quotationService';
import type { CustomerRequest } from '@/types/customer';
import type { LeadRequest } from '@/types/lead';
import type { QuotationRequest } from '@/types/quotation';

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="bg-secondary/30 p-4 rounded-xl">
      <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest">{label}</div>
      <div className="font-bold text-foreground">{value || '—'}</div>
    </div>
  );
}

export function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isAddingQuotation, setIsAddingQuotation] = useState(false);

  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ['admin', 'customer', customerId],
    queryFn: () => getCustomer(customerId),
    enabled: Number.isFinite(customerId),
  });

  const { data: timeline, isLoading: isTimelineLoading } = useQuery({
    queryKey: ['admin', 'customer', customerId, 'timeline'],
    queryFn: () => getCustomerTimeline(customerId),
    enabled: Number.isFinite(customerId),
  });

  const { data: leadsPage, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['admin', 'leads', 'list', { customerId, active: true }],
    queryFn: () => listLeads({ customerId, active: true, size: 50, sortBy: 'createdAt', direction: 'desc' }),
    enabled: Number.isFinite(customerId),
  });

  const { data: quotationsPage, isLoading: isQuotationsLoading } = useQuery({
    queryKey: ['admin', 'quotations', { customerId, active: true }],
    queryFn: () => listQuotations({ customerId, active: true, size: 50, sortBy: 'createdAt', direction: 'desc' }),
    enabled: Number.isFinite(customerId),
  });

  const createLeadMutation = useMutation({
    mutationFn: (payload: LeadRequest) => createLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer', customerId, 'timeline'] });
      setIsAddingLead(false);
    },
  });

  const createQuotationMutation = useMutation({
    mutationFn: (payload: QuotationRequest) => createQuotation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quotations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer', customerId, 'timeline'] });
      setIsAddingQuotation(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CustomerRequest) => updateCustomer(customerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer', customerId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer', customerId, 'timeline'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      setIsEditing(false);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: () => deactivateCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer', customerId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="p-12 text-center text-destructive font-bold border-2 border-destructive/20 rounded-3xl bg-destructive/5">
        Customer not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/customers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight flex-1">{customer.name}</h1>
        {!isEditing && !isAddingLead && !isAddingQuotation && (
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setIsAddingLead(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Lead
            </Button>
            <Button variant="outline" onClick={() => setIsAddingQuotation(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Quotation
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button
              variant="outline"
              disabled={!customer.active || deactivateMutation.isPending}
              onClick={() => {
                if (confirm(`Deactivate ${customer.name}?`)) deactivateMutation.mutate();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Deactivate
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <AdminCustomerForm
          customer={customer}
          isSubmitting={updateMutation.isPending}
          onSubmit={(payload) => updateMutation.mutate(payload)}
          onCancel={() => setIsEditing(false)}
        />
      ) : isAddingLead ? (
        <AdminLeadForm
          lockedCustomerId={customer.id}
          lockedCustomerLabel={`${customer.name} · ${customer.phone}`}
          isSubmitting={createLeadMutation.isPending}
          onSubmit={(payload) => createLeadMutation.mutate(payload)}
          onCancel={() => setIsAddingLead(false)}
        />
      ) : isAddingQuotation ? (
        <AdminQuotationForm
          lockedCustomerId={customer.id}
          lockedCustomerLabel={`${customer.name} · ${customer.phone}`}
          isSubmitting={createQuotationMutation.isPending}
          onSubmit={(payload) => createQuotationMutation.mutate(payload)}
          onCancel={() => setIsAddingQuotation(false)}
        />
      ) : (
        <>
          <div className="border border-border rounded-[2rem] bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Profile</h2>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  customer.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {customer.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <InfoRow label="Phone" value={customer.phone} />
              <InfoRow label="Alternate Phone" value={customer.alternatePhone} />
              <InfoRow label="Email" value={customer.email} />
              <InfoRow label="City" value={customer.city} />
              <InfoRow label="State" value={customer.state} />
              <InfoRow label="Country" value={customer.country} />
              <InfoRow label="Source" value={customer.source.replace('_', ' ')} />
              <InfoRow label="Added By" value={customer.createdByName} />
              <InfoRow
                label="Added On"
                value={new Date(customer.createdAt).toLocaleDateString(undefined, {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              />
            </div>
          </div>

          {/* Leads */}
          <div className="border border-border rounded-[2rem] bg-card p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Leads
            </h2>

            {isLeadsLoading ? (
              <div className="flex h-24 items-center justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : leadsPage && leadsPage.content.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {leadsPage.content.map((lead) => (
                  <div key={lead.id} className="bg-secondary/30 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${STATUS_BADGE[lead.status]}`}>
                        {lead.status}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {lead.source.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">{lead.requirement}</p>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {lead.assignedToName ? `Assigned to ${lead.assignedToName}` : 'Unassigned'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No leads yet for this customer — click "New Lead" above to create one.
              </div>
            )}
          </div>

          {/* Quotations */}
          <div className="border border-border rounded-[2rem] bg-card p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Quotations
            </h2>

            {isQuotationsLoading ? (
              <div className="flex h-24 items-center justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : quotationsPage && quotationsPage.content.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quotationsPage.content.map((quotation) => (
                  <Link
                    key={quotation.id}
                    to={`/admin/quotations/${quotation.id}`}
                    className="block bg-secondary/30 hover:bg-secondary/60 transition-colors rounded-xl p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{quotation.quotationNumber}</span>
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${QUOTATION_STATUS_BADGE[quotation.status]}`}>
                        {quotation.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{quotation.packageTitle || 'Custom itinerary'}</span>
                      <span className="font-bold text-foreground">₹{quotation.finalAmount.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No quotations yet for this customer — click "New Quotation" above to create one.
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="border border-border rounded-[2rem] bg-card p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Timeline
            </h2>

            {isTimelineLoading ? (
              <div className="flex h-24 items-center justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : timeline && timeline.content.length > 0 ? (
              <div className="space-y-4">
                {timeline.content.map((event) => (
                  <div key={event.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{event.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.performedByName && <span>{event.performedByName} · </span>}
                        {new Date(event.createdAt).toLocaleString(undefined, {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No activity yet — this will populate as you add notes, tasks, and follow-ups in later CRM phases.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
