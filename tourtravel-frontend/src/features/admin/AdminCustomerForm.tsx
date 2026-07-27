import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CUSTOMER_SOURCES } from '@/types/customer';
import type { CustomerDetail, CustomerRequest } from '@/types/customer';

interface AdminCustomerFormProps {
  customer?: CustomerDetail | null;
  isSubmitting: boolean;
  onSubmit: (data: CustomerRequest) => void;
  onCancel: () => void;
}

const inputClass =
  'w-full bg-background border border-border p-2 rounded text-foreground outline-none focus:ring-1 focus:ring-primary';
const labelClass = 'text-sm font-medium text-muted-foreground';
const errorClass = 'text-xs text-destructive mt-1';
const PHONE_PATTERN = /^[+]?[0-9]{7,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared between "Add Customer" (from the list) and "Edit" (from the details page) —
// the field set is large enough that duplicating it per-context, the way AdminHotels
// inlines its single-use form, isn't worth it here.
export function AdminCustomerForm({ customer, isSubmitting, onSubmit, onCancel }: AdminCustomerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerRequest>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      city: '',
      state: '',
      country: '',
      source: 'WALK_IN',
      active: true,
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email ?? '',
        phone: customer.phone,
        alternatePhone: customer.alternatePhone ?? '',
        city: customer.city ?? '',
        state: customer.state ?? '',
        country: customer.country ?? '',
        source: customer.source,
        active: customer.active,
      });
    }
  }, [customer, reset]);

  const submit = (data: CustomerRequest) => {
    onSubmit({
      ...data,
      email: data.email || undefined,
      alternatePhone: data.alternatePhone || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      country: data.country || undefined,
    });
  };

  return (
    <div className="p-6 bg-card border border-border rounded-lg shadow-sm font-medium text-foreground">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{customer ? 'Edit Customer' : 'New Customer'}</h2>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Full Name *</label>
            <input
              className={inputClass}
              {...register('name', {
                required: 'Name is required',
                maxLength: { value: 100, message: 'Must be at most 100 characters' },
              })}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Phone *</label>
            <input
              className={inputClass}
              {...register('phone', {
                required: 'Phone is required',
                pattern: { value: PHONE_PATTERN, message: '7-15 digits, optionally starting with +' },
              })}
            />
            {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Alternate Phone</label>
            <input
              className={inputClass}
              {...register('alternatePhone', {
                pattern: { value: PHONE_PATTERN, message: '7-15 digits, optionally starting with +' },
              })}
            />
            {errors.alternatePhone && <p className={errorClass}>{errors.alternatePhone.message}</p>}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              {...register('email', {
                pattern: { value: EMAIL_PATTERN, message: 'Must be a valid email address' },
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>City</label>
            <input className={inputClass} {...register('city')} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>State</label>
            <input className={inputClass} {...register('state')} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Country</label>
            <input className={inputClass} {...register('country')} />
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

          {customer && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="active" className="h-4 w-4" {...register('active')} />
              <label htmlFor="active" className={labelClass}>
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
