import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Loader2, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerPicker } from '@/components/shared/CustomerPicker';
import { listPackagesForDropdown } from '@/services/packageService';
import { listHotelsForDropdown } from '@/services/hotelService';
import { listVehiclesForDropdown } from '@/services/vehicleService';
import { QUOTATION_ITEM_TYPES } from '@/types/quotation';
import type { QuotationDetail, QuotationItemType, QuotationRequest } from '@/types/quotation';
import type { PackageOption } from '@/types/package';
import type { HotelOption } from '@/types/hotel';
import type { VehicleOption } from '@/types/vehicle';

interface AdminQuotationFormProps {
  quotation?: QuotationDetail | null;
  lockedCustomerId?: number; // set when creating a quotation from a Customer's own detail page
  lockedCustomerLabel?: string;
  isSubmitting: boolean;
  onSubmit: (data: QuotationRequest) => void;
  onCancel: () => void;
}

const inputClass =
  'w-full bg-background border border-border p-2 rounded text-foreground outline-none focus:ring-1 focus:ring-primary disabled:opacity-60';
const labelClass = 'text-sm font-medium text-muted-foreground';
const errorClass = 'text-xs text-destructive mt-1';
const microLabelClass = 'text-[10px] font-bold text-muted-foreground uppercase tracking-wide';

function toDateInputValue(value?: string) {
  if (!value) return '';
  return value.slice(0, 10);
}

interface QuotationItemRowProps {
  index: number;
  register: UseFormRegister<QuotationRequest>;
  watch: UseFormWatch<QuotationRequest>;
  setValue: UseFormSetValue<QuotationRequest>;
  remove: (index: number) => void;
  packages?: PackageOption[];
  hotels?: HotelOption[];
  vehicles?: VehicleOption[];
}

// One line in the Phase 2 item builder. Package/Hotel/Vehicle reuse the existing
// catalogs (picking one auto-fills a suggested unit price, still overridable);
// Activity is free-text, since no Activity catalog exists in this codebase.
function QuotationItemRow({ index, register, watch, setValue, remove, packages, hotels, vehicles }: QuotationItemRowProps) {
  const itemType = watch(`items.${index}.itemType`);
  const referenceId = watch(`items.${index}.referenceId`);
  const quantity = watch(`items.${index}.quantity`);
  const unitPrice = watch(`items.${index}.unitPrice`);
  const subtotal = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  const changeType = (newType: QuotationItemType) => {
    setValue(`items.${index}.itemType`, newType);
    setValue(`items.${index}.referenceId`, undefined);
    setValue(`items.${index}.itemName`, '');
    setValue(`items.${index}.unitPrice`, 0);
  };

  const selectCatalogItem = (id: string, options: { id: number; name: string; price: number }[]) => {
    const selected = options.find((o) => o.id === Number(id));
    setValue(`items.${index}.referenceId`, id ? Number(id) : undefined);
    if (selected) {
      setValue(`items.${index}.itemName`, selected.name);
      setValue(`items.${index}.unitPrice`, selected.price);
    }
  };

  return (
    <div className="bg-secondary/30 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-12 gap-3 items-end">
      <div className="space-y-1 sm:col-span-2">
        <label className={microLabelClass}>Type</label>
        <select className={inputClass} value={itemType} onChange={(e) => changeType(e.target.value as QuotationItemType)}>
          {QUOTATION_ITEM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1 sm:col-span-4">
        <label className={microLabelClass}>Item</label>
        {itemType === 'PACKAGE' && (
          <select
            className={inputClass}
            value={referenceId ?? ''}
            onChange={(e) => selectCatalogItem(e.target.value, (packages ?? []).map((p) => ({ id: p.id, name: p.title, price: p.price })))}
          >
            <option value="">Select package...</option>
            {packages?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.durationDays}D)
              </option>
            ))}
          </select>
        )}
        {itemType === 'HOTEL' && (
          <select
            className={inputClass}
            value={referenceId ?? ''}
            onChange={(e) =>
              selectCatalogItem(e.target.value, (hotels ?? []).map((h) => ({ id: h.id, name: h.name, price: h.pricePerNight })))
            }
          >
            <option value="">Select hotel...</option>
            {hotels?.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.location})
              </option>
            ))}
          </select>
        )}
        {itemType === 'VEHICLE' && (
          <select
            className={inputClass}
            value={referenceId ?? ''}
            onChange={(e) =>
              selectCatalogItem(
                e.target.value,
                (vehicles ?? []).map((v) => ({ id: v.id, name: `${v.vehicleType} (${v.seatingCapacity} seats)`, price: v.pricePerDay }))
              )
            }
          >
            <option value="">Select vehicle...</option>
            {vehicles?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.vehicleType} ({v.seatingCapacity} seats)
              </option>
            ))}
          </select>
        )}
        {itemType === 'ACTIVITY' && (
          <input className={inputClass} placeholder="Activity name" {...register(`items.${index}.itemName`)} />
        )}
      </div>

      <div className="space-y-1 sm:col-span-2">
        <label className={microLabelClass}>Qty</label>
        <input
          type="number"
          min={1}
          className={inputClass}
          {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })}
        />
      </div>

      <div className="space-y-1 sm:col-span-2">
        <label className={microLabelClass}>Unit Price (₹)</label>
        <input
          type="number"
          min={0}
          step="0.01"
          className={inputClass}
          {...register(`items.${index}.unitPrice`, { valueAsNumber: true, min: 0 })}
        />
      </div>

      <div className="sm:col-span-2 flex items-center justify-between gap-2">
        <div>
          <div className={microLabelClass}>Subtotal</div>
          <div className="font-bold text-foreground">₹{subtotal.toLocaleString()}</div>
        </div>
        <button type="button" onClick={() => remove(index)} className="text-destructive hover:opacity-70 flex-shrink-0">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Shared between "Add Quotation" (from the list, or from a Customer's detail
// page with the customer locked) and "Edit" — same rationale as AdminLeadForm.
export function AdminQuotationForm({
  quotation,
  lockedCustomerId,
  lockedCustomerLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: AdminQuotationFormProps) {
  const [customerLabel, setCustomerLabel] = useState(lockedCustomerLabel ?? '');

  const { data: packages } = useQuery({ queryKey: ['admin', 'packages', 'dropdown'], queryFn: listPackagesForDropdown });
  const { data: hotels } = useQuery({ queryKey: ['admin', 'hotels', 'dropdown'], queryFn: listHotelsForDropdown });
  const { data: vehicles } = useQuery({ queryKey: ['admin', 'vehicles', 'dropdown'], queryFn: listVehiclesForDropdown });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuotationRequest>({
    defaultValues: {
      customerId: lockedCustomerId ?? 0,
      packageId: undefined,
      travelDate: '',
      numberOfAdults: 1,
      numberOfChildren: 0,
      totalAmount: 0,
      discount: 0,
      finalAmount: 0,
      notes: '',
      validUntil: '',
      termsAndConditions: '',
      active: true,
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const hasItems = fields.length > 0;

  const watchedItems = watch('items');
  const discount = watch('discount');
  const totalAmount = watch('totalAmount');

  const itemsTotal = useMemo(
    () => (watchedItems || []).reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0),
    [watchedItems]
  );

  // Pricing engine preview: once items exist, Total/Final are computed and
  // read-only — the server enforces this authoritatively on submit regardless.
  useEffect(() => {
    if (hasItems) {
      setValue('totalAmount', itemsTotal);
      setValue('finalAmount', Math.max(itemsTotal - (Number(discount) || 0), 0));
    }
  }, [hasItems, itemsTotal, discount, setValue]);

  // Legacy convenience auto-fill (Phase 1 behavior) — only applies with zero items.
  useEffect(() => {
    if (!hasItems) {
      const total = Number(totalAmount) || 0;
      const disc = Number(discount) || 0;
      setValue('finalAmount', Math.max(total - disc, 0));
    }
  }, [hasItems, totalAmount, discount, setValue]);

  useEffect(() => {
    if (quotation) {
      setCustomerLabel(`${quotation.customerName} · ${quotation.customerPhone}`);
      reset({
        customerId: quotation.customerId,
        packageId: quotation.packageId,
        travelDate: toDateInputValue(quotation.travelDate),
        numberOfAdults: quotation.numberOfAdults,
        numberOfChildren: quotation.numberOfChildren,
        totalAmount: quotation.totalAmount,
        discount: quotation.discount,
        finalAmount: quotation.finalAmount,
        notes: quotation.notes ?? '',
        validUntil: toDateInputValue(quotation.validUntil),
        termsAndConditions: quotation.termsAndConditions ?? '',
        active: quotation.active,
        items: quotation.items.map((item) => ({
          itemType: item.itemType,
          referenceId: item.referenceId,
          itemName: item.itemName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
    } else if (lockedCustomerId) {
      setValue('customerId', lockedCustomerId);
    }
  }, [quotation, lockedCustomerId, reset, setValue]);

  return (
    <div className="p-6 bg-card border border-border rounded-lg shadow-sm font-medium text-foreground">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{quotation ? 'Edit Quotation' : 'New Quotation'}</h2>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-4xl">
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
                  locked={!!quotation || !!lockedCustomerId}
                  onChange={(customerId, label) => {
                    field.onChange(customerId);
                    setCustomerLabel(label);
                  }}
                />
              )}
            />
            {errors.customerId && <p className={errorClass}>Please select a customer</p>}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Base Package (optional)</label>
            <select className={inputClass} {...register('packageId', { setValueAs: (v) => (v ? Number(v) : undefined) })}>
              <option value="">No base package — custom itinerary</option>
              {packages?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.durationDays}D)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Travel Date *</label>
            <input type="date" className={inputClass} {...register('travelDate', { required: 'Travel date is required' })} />
            {errors.travelDate && <p className={errorClass}>{errors.travelDate.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Valid Until *</label>
            <input type="date" className={inputClass} {...register('validUntil', { required: 'Valid until date is required' })} />
            {errors.validUntil && <p className={errorClass}>{errors.validUntil.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Adults *</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              {...register('numberOfAdults', { required: true, min: { value: 1, message: 'At least 1 adult required' }, valueAsNumber: true })}
            />
            {errors.numberOfAdults && <p className={errorClass}>{errors.numberOfAdults.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Children</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register('numberOfChildren', { min: { value: 0, message: 'Cannot be negative' }, valueAsNumber: true })}
            />
            {errors.numberOfChildren && <p className={errorClass}>{errors.numberOfChildren.message}</p>}
          </div>
        </div>

        {/* Line Items — Phase 2 builder */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Line Items (Package / Hotel / Vehicle / Activity)</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ itemType: 'ACTIVITY', itemName: '', quantity: 1, unitPrice: 0 })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
            </Button>
          </div>

          {fields.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No line items yet — Total/Final Amount below are entered manually. Add an item to switch to computed pricing.
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <QuotationItemRow
                  key={field.id}
                  index={index}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  remove={remove}
                  packages={packages}
                  hotels={hotels}
                  vehicles={vehicles}
                />
              ))}
              <div className="text-right text-sm font-bold text-foreground pr-1">Items Total: ₹{itemsTotal.toLocaleString()}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <label className={labelClass}>Total Amount (₹) {!hasItems && '*'}</label>
            <input
              type="number"
              min={0}
              step="0.01"
              disabled={hasItems}
              className={inputClass}
              {...register('totalAmount', {
                required: !hasItems && 'Total amount is required',
                min: { value: 0, message: 'Cannot be negative' },
                valueAsNumber: true,
              })}
            />
            {hasItems && <p className="text-[10px] text-muted-foreground">Computed from line items.</p>}
            {errors.totalAmount && <p className={errorClass}>{errors.totalAmount.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Discount (₹)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              {...register('discount', { min: { value: 0, message: 'Cannot be negative' }, valueAsNumber: true })}
            />
            {errors.discount && <p className={errorClass}>{errors.discount.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Final Amount (₹) {!hasItems && '*'}</label>
            <input
              type="number"
              min={0}
              step="0.01"
              disabled={hasItems}
              className={inputClass}
              {...register('finalAmount', {
                required: !hasItems && 'Final amount is required',
                min: { value: 0, message: 'Cannot be negative' },
                valueAsNumber: true,
              })}
            />
            {!hasItems && <p className="text-[10px] text-muted-foreground">Auto-filled from Total − Discount; you can override it.</p>}
            {errors.finalAmount && <p className={errorClass}>{errors.finalAmount.message}</p>}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Notes</label>
            <textarea
              className={`${inputClass} min-h-[80px]`}
              placeholder="Internal notes about this quotation..."
              {...register('notes', { maxLength: { value: 2000, message: 'Must be at most 2000 characters' } })}
            />
            {errors.notes && <p className={errorClass}>{errors.notes.message}</p>}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={labelClass}>Terms &amp; Conditions Override</label>
            <textarea
              className={`${inputClass} min-h-[80px]`}
              placeholder="Leave blank to use the company's default Terms & Conditions on the PDF..."
              {...register('termsAndConditions', { maxLength: { value: 4000, message: 'Must be at most 4000 characters' } })}
            />
            {errors.termsAndConditions && <p className={errorClass}>{errors.termsAndConditions.message}</p>}
          </div>

          {quotation && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="quotation-active" className="h-4 w-4" {...register('active')} />
              <label htmlFor="quotation-active" className={labelClass}>
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
