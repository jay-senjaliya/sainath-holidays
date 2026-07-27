import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerPicker } from '@/components/shared/CustomerPicker';
import { listAssignableStaff } from '@/services/userService';
import { CUSTOMER_SOURCES } from '@/types/customer';
import type { LeadListItem, LeadRequest } from '@/types/lead';

interface AdminLeadFormProps {
  lead?: LeadListItem | null;
  lockedCustomerId?: number; // set when creating a lead from a Customer's own detail page
  lockedCustomerLabel?: string;
  isSubmitting: boolean;
  onSubmit: (data: LeadRequest) => void;
  onCancel: () => void;
}

const inputClass =
  'w-full bg-background border border-border p-2 rounded text-foreground outline-none focus:ring-1 focus:ring-primary';
const labelClass = 'text-sm font-medium text-muted-foreground';
const errorClass = 'text-xs text-destructive mt-1';

// Shared between "Add Lead" (from the Leads list, or from a Customer's detail
// page with the customer locked) and "Edit" — same rationale as AdminCustomerForm.
export function AdminLeadForm({
  lead,
  lockedCustomerId,
  lockedCustomerLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: AdminLeadFormProps) {
  const [customerLabel, setCustomerLabel] = useState(lockedCustomerLabel ?? '');

  const { data: staff } = useQuery({
    queryKey: ['admin', 'staff', 'assignable'],
    queryFn: listAssignableStaff,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LeadRequest>({
    defaultValues: {
      customerId: lockedCustomerId ?? 0,
      source: 'WALK_IN',
      requirement: '',
      assignedToId: undefined,
      active: true,
    },
  });

  useEffect(() => {
    if (lead) {
      setCustomerLabel(`${lead.customerName} · ${lead.customerPhone}`);
      reset({
        customerId: lead.customerId,
        source: lead.source,
        requirement: lead.requirement,
        assignedToId: lead.assignedToId,
        active: lead.active,
      });
    } else if (lockedCustomerId) {
      setValue('customerId', lockedCustomerId);
    }
  }, [lead, lockedCustomerId, reset, setValue]);

  return (
    <div className="p-6 bg-card border border-border rounded-lg shadow-sm font-medium text-foreground">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{lead ? 'Edit Lead' : 'New Lead'}</h2>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Customer *</label>
            <Controller
              name="customerId"
              control={control}
              rules={{ required: true, validate: (v) => v > 0 || 'Please select a customer' }}
              render={({ field }) => (
                <CustomerPicker
                  value={field.value || undefined}
                  initialLabel={customerLabel}
                  locked={!!lead || !!lockedCustomerId}
                  onChange={(customerId, label) => {
                    field.onChange(customerId);
                    setCustomerLabel(label);
                  }}
                />
              )}
            />
            {errors.customerId && <p className={errorClass}>Please select a customer</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Source *</label>
            <select className={inputClass} {...register('source', { required: true })}>
              {CUSTOMER_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Assign To</label>
            <select
              className={inputClass}
              {...register('assignedToId', { setValueAs: (v) => (v ? Number(v) : undefined) })}
            >
              <option value="">Unassigned</option>
              {staff?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Requirement *</label>
            <textarea
              className={`${inputClass} min-h-[100px]`}
              placeholder="What is the customer looking for? Destination, dates, budget, group size..."
              {...register('requirement', {
                required: 'Requirement is required',
                maxLength: { value: 2000, message: 'Must be at most 2000 characters' },
              })}
            />
            {errors.requirement && <p className={errorClass}>{errors.requirement.message}</p>}
          </div>

          {lead && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="lead-active" className="h-4 w-4" {...register('active')} />
              <label htmlFor="lead-active" className={labelClass}>
                Active
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
