import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Booking, BookingRequest } from '@/types/booking';
import { X, Save, User as UserIcon, Package, IndianRupee, Clock } from 'lucide-react';

interface Props {
  booking?: Booking;
  onClose: () => void;
}

export function BookingForm({ booking, onClose }: Props) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<BookingRequest>({
    defaultValues: booking ? {
      ...booking,
      startDate: booking.startDate,
      endDate: booking.endDate,
    } : {
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'PENDING',
      advancePaid: 0,
    }
  });

  // Fetch options for dropdowns
  useQuery({ queryKey: ['admin-users-list'], queryFn: () => api.get('/admin/users/all').then(r => r.data.data), enabled: false });
  const { data: packages } = useQuery({ queryKey: ['admin-packages-list'], queryFn: () => api.get('/admin/packages/all').then(r => r.data.data) });
  const { data: vehicles } = useQuery({ queryKey: ['admin-vehicles-list'], queryFn: () => api.get('/admin/vehicles/all').then(r => r.data.data) });

  const mutation = useMutation({
    mutationFn: (data: BookingRequest) => {
      return booking 
        ? api.put(`/admin/bookings/${booking.id}`, data)
        : api.post('/admin/bookings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-card w-full max-w-4xl max-h-[95vh] sm:rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 border border-border flex flex-col">
        <div className="bg-[#0E2E50] p-6 md:p-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
              {booking ? 'Edit Booking' : 'Manual Booking Entry'}
            </h2>
            <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2 leading-none">Fill in the details to confirm reservation</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-6 md:p-10 flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 outline-none">
          {/* Customer Info Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <UserIcon className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Customer Information</h3>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Full Name</label>
              <input 
                {...register('customerName', { required: true })}
                className="w-full px-5 py-4 bg-secondary/50 rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="Ex: John Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Phone Number</label>
                <input 
                  {...register('customerPhone', { required: true })}
                  className="w-full px-5 py-4 bg-secondary/50 rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="+91..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Email Address</label>
                <input 
                  {...register('customerEmail')}
                  className="w-full px-5 py-4 bg-secondary/50 rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Service Section */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 border-b border-border pb-2">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Service Details</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Select Package (Optional)</label>
              <select {...register('packageId')} className="w-full px-5 py-4 bg-secondary/50 rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-primary/20 appearance-none outline-none">
                <option value="" className="bg-card">None</option>
                {packages?.data?.content?.map((p: any) => <option key={p.id} value={p.id} className="bg-card">{p.title}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Vehicle (Optional)</label>
                <select {...register('vehicleId')} className="w-full px-5 py-4 bg-secondary/50 rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-primary/20 appearance-none outline-none">
                  <option value="" className="bg-card">None</option>
                  {vehicles?.data?.content?.map((v: any) => <option key={v.id} value={v.id} className="bg-card">{v.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Hotel (Optional)</label>
                <select {...register('hotelId')} className="w-full px-5 py-4 bg-secondary/50 rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-primary/20 appearance-none outline-none">
                  <option value="" className="bg-card">None</option>
                  {/* Assuming hotels list is similar */}
                  <option value="1" className="bg-card">Luxury Hotel 1</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Start Date</label>
                <input type="date" {...register('startDate', { required: true })} className="w-full px-5 py-4 bg-secondary/50 rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
               <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">End Date</label>
                <input type="date" {...register('endDate', { required: true })} className="w-full px-5 py-4 bg-secondary/50 rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>

          {/* Pricing & Payments Section */}
          <div className="space-y-6 md:col-span-2 bg-secondary/30 p-8 rounded-[32px] border border-border grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-1">
                <IndianRupee className="h-3 w-3" /> Total Amount
              </label>
              <input 
                type="number" 
                {...register('totalAmount', { required: true, valueAsNumber: true })}
                className="w-full px-6 py-4 bg-card rounded-2xl border-none font-black text-lg text-foreground focus:ring-2 focus:ring-primary/20 shadow-sm outline-none"
              />
            </div>
             <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Advance Paid
              </label>
              <input 
                type="number" 
                {...register('advancePaid', { valueAsNumber: true })}
                className="w-full px-6 py-4 bg-card rounded-2xl border-none font-black text-lg text-emerald-500 focus:ring-2 focus:ring-primary/20 shadow-sm outline-none"
              />
            </div>
              <div className="space-y-1.5">
               <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Booking Status</label>
               <select {...register('bookingStatus')} className="w-full px-6 py-4 bg-card rounded-2xl border-none font-black text-foreground focus:ring-2 focus:ring-primary/20 shadow-sm outline-none">
                 <option value="CONFIRMED" className="bg-card">CONFIRMED</option>
                 <option value="CANCELLED" className="bg-card">CANCELLED</option>
                 <option value="COMPLETED" className="bg-card">COMPLETED</option>
               </select>
             </div>
          </div>

          <div className="md:col-span-2 pt-4 flex flex-col sm:flex-row gap-4 shrink-0 mt-auto">
             <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-4 md:py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-muted-foreground bg-secondary hover:bg-secondary/80 transition-all"
             >
               Cancel
             </button>
             <button 
              type="submit"
              disabled={mutation.isPending}
              className="flex-[2] flex items-center justify-center gap-3 px-8 py-4 md:py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-white bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
             >
               <Save className="h-5 w-5" />
               {mutation.isPending ? 'Saving...' : 'Save Booking Record'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
