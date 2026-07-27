import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ArrowLeft, Check, Download, Loader2, Mail, MessageCircle, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminQuotationForm } from '@/features/admin/AdminQuotationForm';
import { QUOTATION_STATUS_BADGE } from '@/features/admin/AdminQuotations';
import {
  deactivateQuotation,
  downloadQuotationPdf,
  getQuotation,
  getQuotationWhatsAppLink,
  sendQuotationEmail,
  updateQuotation,
  updateQuotationApproval,
  updateQuotationStatus,
} from '@/services/quotationService';
import { QUOTATION_STATUSES } from '@/types/quotation';
import type { QuotationRequest, QuotationStatus } from '@/types/quotation';

const inputClass =
  'bg-background border border-border p-2 rounded text-foreground outline-none focus:ring-1 focus:ring-primary text-sm';

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="bg-secondary/30 p-4 rounded-xl">
      <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-widest">{label}</div>
      <div className="font-bold text-foreground">{value ?? '—'}</div>
    </div>
  );
}

export function AdminQuotationView() {
  const { id } = useParams<{ id: string }>();
  const quotationId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: quotation, isLoading, isError } = useQuery({
    queryKey: ['admin', 'quotation', quotationId],
    queryFn: () => getQuotation(quotationId),
    enabled: Number.isFinite(quotationId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'quotation', quotationId] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'quotations'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'customer'] });
  };

  const updateMutation = useMutation({
    mutationFn: (payload: QuotationRequest) => updateQuotation(quotationId, payload),
    onSuccess: () => {
      invalidate();
      setIsEditing(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: QuotationStatus) => updateQuotationStatus(quotationId, status),
    onSuccess: invalidate,
  });

  const deactivateMutation = useMutation({
    mutationFn: () => deactivateQuotation(quotationId),
    onSuccess: invalidate,
  });

  const downloadMutation = useMutation({
    mutationFn: () => downloadQuotationPdf(quotationId, quotation!.quotationNumber),
    onError: () => setActionError('Failed to download the PDF.'),
  });

  const emailMutation = useMutation({
    mutationFn: () => sendQuotationEmail(quotationId),
    onSuccess: () => {
      setActionError(null);
      invalidate();
    },
    onError: (err: any) => setActionError(err?.response?.data?.message ?? 'Failed to send email.'),
  });

  const whatsAppMutation = useMutation({
    mutationFn: () => getQuotationWhatsAppLink(quotationId),
    onSuccess: (result) => {
      setActionError(null);
      window.open(result.waLink, '_blank');
    },
    onError: (err: any) => setActionError(err?.response?.data?.message ?? 'Failed to generate WhatsApp link.'),
  });

  const approvalMutation = useMutation({
    mutationFn: (approvalStatus: 'APPROVED' | 'REJECTED') => updateQuotationApproval(quotationId, approvalStatus),
    onSuccess: invalidate,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (isError || !quotation) {
    return (
      <div className="p-12 text-center text-destructive font-bold border-2 border-destructive/20 rounded-3xl bg-destructive/5">
        Quotation not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/quotations')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight flex-1">{quotation.quotationNumber}</h1>
        {!isEditing && (
          <div className="flex items-center gap-2 flex-wrap">
            <select
              className={inputClass}
              value={quotation.status}
              disabled={statusMutation.isPending}
              onChange={(e) => statusMutation.mutate(e.target.value as QuotationStatus)}
            >
              {QUOTATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Button variant="outline" disabled={downloadMutation.isPending} onClick={() => downloadMutation.mutate()}>
              {downloadMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              PDF
            </Button>
            <Button variant="outline" disabled={emailMutation.isPending} onClick={() => emailMutation.mutate()}>
              {emailMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
              Email
            </Button>
            <Button variant="outline" disabled={whatsAppMutation.isPending} onClick={() => whatsAppMutation.mutate()}>
              {whatsAppMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MessageCircle className="h-4 w-4 mr-2" />}
              WhatsApp
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button
              variant="outline"
              disabled={!quotation.active || deactivateMutation.isPending}
              onClick={() => {
                if (confirm(`Deactivate ${quotation.quotationNumber}?`)) deactivateMutation.mutate();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Deactivate
            </Button>
          </div>
        )}
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
          {actionError}
          <button onClick={() => setActionError(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {quotation.approvalStatus === 'PENDING' && !isEditing && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            This quotation's discount exceeds the approval threshold. It can't be emailed or shared via WhatsApp until approved.
          </div>
          <div className="flex gap-2">
            <Button size="sm" disabled={approvalMutation.isPending} onClick={() => approvalMutation.mutate('APPROVED')}>
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={approvalMutation.isPending}
              onClick={() => approvalMutation.mutate('REJECTED')}
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
          </div>
        </div>
      )}

      {quotation.approvalStatus === 'REJECTED' && !isEditing && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          This quotation's discount approval was rejected by {quotation.approvedByName ?? 'an admin'}. Edit the discount and save
          to request approval again.
        </div>
      )}

      {isEditing ? (
        <AdminQuotationForm
          quotation={quotation}
          isSubmitting={updateMutation.isPending}
          onSubmit={(payload) => updateMutation.mutate(payload)}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="border border-border rounded-[2rem] bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <Link to={`/admin/customers/${quotation.customerId}`} className="group">
              <div className="font-black text-lg text-foreground group-hover:text-primary transition-colors">{quotation.customerName}</div>
              <div className="text-xs text-muted-foreground">{quotation.customerPhone} {quotation.customerEmail && `· ${quotation.customerEmail}`}</div>
            </Link>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${QUOTATION_STATUS_BADGE[quotation.status]}`}>
              {quotation.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <InfoRow label="Package" value={quotation.packageTitle || 'Custom itinerary'} />
            <InfoRow
              label="Travel Date"
              value={new Date(quotation.travelDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
            />
            <InfoRow
              label="Valid Until"
              value={new Date(quotation.validUntil).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
            />
            <InfoRow label="Adults" value={quotation.numberOfAdults} />
            <InfoRow label="Children" value={quotation.numberOfChildren} />
            <InfoRow label="Added By" value={quotation.createdByName} />
            <InfoRow
              label={`Total Amount ${quotation.computedPricing ? '(computed)' : '(manual)'}`}
              value={`₹${quotation.totalAmount.toLocaleString()}`}
            />
            <InfoRow label="Discount" value={`₹${quotation.discount.toLocaleString()}`} />
            <InfoRow label="Final Amount" value={`₹${quotation.finalAmount.toLocaleString()}`} />
            {quotation.approvalStatus !== 'NOT_REQUIRED' && (
              <InfoRow
                label="Approval"
                value={
                  quotation.approvalStatus === 'APPROVED'
                    ? `Approved by ${quotation.approvedByName ?? '—'}`
                    : quotation.approvalStatus
                }
              />
            )}
          </div>

          {quotation.items.length > 0 && (
            <div className="bg-secondary/30 rounded-xl p-4 overflow-x-auto">
              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">Line Items</div>
              <table className="w-full text-sm text-left">
                <thead className="text-muted-foreground text-xs">
                  <tr>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Item</th>
                    <th className="py-2 pr-4 text-right">Qty</th>
                    <th className="py-2 pr-4 text-right">Unit Price</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {quotation.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 pr-4">
                        <span className="px-2 py-0.5 rounded bg-secondary text-[9px] font-bold uppercase tracking-wider">{item.itemType}</span>
                      </td>
                      <td className="py-2 pr-4 font-medium text-foreground">{item.itemName}</td>
                      <td className="py-2 pr-4 text-right">{item.quantity}</td>
                      <td className="py-2 pr-4 text-right">₹{item.unitPrice.toLocaleString()}</td>
                      <td className="py-2 text-right font-bold text-foreground">₹{item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {quotation.notes && (
            <div className="bg-secondary/30 p-4 rounded-xl">
              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">Notes</div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{quotation.notes}</p>
            </div>
          )}

          {quotation.termsAndConditions && (
            <div className="bg-secondary/30 p-4 rounded-xl">
              <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">Terms &amp; Conditions Override</div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{quotation.termsAndConditions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
