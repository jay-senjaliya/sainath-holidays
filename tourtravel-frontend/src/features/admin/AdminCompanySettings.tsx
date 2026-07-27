import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCompanySettings, updateCompanySettings } from '@/services/companySettingsService';
import type { CompanySettingsRequest } from '@/types/companySettings';

const inputClass =
  'w-full bg-background border border-border p-2 rounded text-foreground outline-none focus:ring-1 focus:ring-primary';
const labelClass = 'text-sm font-medium text-muted-foreground';
const errorClass = 'text-xs text-destructive mt-1';

// Powers the branding/header on the Quotation PDF (docs: Phase 3 "Company
// Branding") and the discount threshold that triggers Phase 4's approval gate.
export function AdminCompanySettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings', 'company'],
    queryFn: getCompanySettings,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanySettingsRequest>({
    defaultValues: {
      companyName: '',
      logoUrl: '',
      address: '',
      phone: '',
      email: '',
      gstNumber: '',
      website: '',
      defaultTermsAndConditions: '',
      approvalDiscountThreshold: undefined,
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        companyName: settings.companyName,
        logoUrl: settings.logoUrl ?? '',
        address: settings.address ?? '',
        phone: settings.phone ?? '',
        email: settings.email ?? '',
        gstNumber: settings.gstNumber ?? '',
        website: settings.website ?? '',
        defaultTermsAndConditions: settings.defaultTermsAndConditions ?? '',
        approvalDiscountThreshold: settings.approvalDiscountThreshold,
      });
    }
  }, [settings, reset]);

  const saveMutation = useMutation({
    mutationFn: (payload: CompanySettingsRequest) => updateCompanySettings(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'settings', 'company'] }),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
      <p className="text-sm text-muted-foreground -mt-4">
        Branding shown on every Quotation PDF, plus the discount threshold that requires approval before a quote can be sent.
      </p>

      <form
        onSubmit={handleSubmit((payload) => saveMutation.mutate(payload))}
        className="border border-border rounded-[2rem] bg-card p-6 shadow-xl space-y-4 max-w-3xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Company Name *</label>
            <input className={inputClass} {...register('companyName', { required: 'Company name is required' })} />
            {errors.companyName && <p className={errorClass}>{errors.companyName.message}</p>}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Logo URL</label>
            <input className={inputClass} placeholder="https://..." {...register('logoUrl')} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea className={`${inputClass} min-h-[70px]`} {...register('address')} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Phone</label>
            <input className={inputClass} {...register('phone')} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Email</label>
            <input type="email" className={inputClass} {...register('email')} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>GST Number</label>
            <input className={inputClass} {...register('gstNumber')} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Website</label>
            <input className={inputClass} {...register('website')} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Default Terms &amp; Conditions</label>
            <textarea
              className={`${inputClass} min-h-[120px]`}
              placeholder="Shown on every quotation PDF unless a quote sets its own override..."
              {...register('defaultTermsAndConditions')}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Approval Discount Threshold (₹)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              placeholder="Leave blank to never require approval"
              {...register('approvalDiscountThreshold', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
            />
            <p className="text-[10px] text-muted-foreground">
              Quotations with a discount at or above this amount require approval before they can be emailed or shared. Any admin
              can approve today — there's no Sales Manager/Executive distinction yet.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
