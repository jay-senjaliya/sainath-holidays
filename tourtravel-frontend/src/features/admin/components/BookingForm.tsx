import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Booking, BookingRequest } from '@/types/booking';
import { X, Save, User as UserIcon, Package, Car, Building2, IndianRupee, Calendar, Clock } from 'lucide-react';

interface Props {
  booking?: Booking;
  onClose: () => void;
}

export function BookingForm({ booking, onClose }: Props) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<BookingRequest>({
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
  const { data: users } = useQuery({ queryKey: ['admin-users-list'], queryFn: () => api.get('/admin/users/all').then(r => r.data.data) });
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-[#0E2E50] p-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
              {booking ? 'Edit Booking' : 'Manual Booking Entry'}
            </h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Fill in the details to confirm reservation</p>
          </div>
          <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 outline-none">
          {/* Customer Info Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <UserIcon className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Customer Information</h3>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
              <input 
                {...register('customerName', { required: true })}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Ex: John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                <input 
                  {...register('customerPhone', { required: true })}
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="+91..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                <input 
                  {...register('customerEmail')}
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Service Section */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Service Details</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Select Package (Optional)</label>
              <select {...register('packageId')} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 appearance-none">
                <option value="">None</option>
                {packages?.data?.content?.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vehicle (Optional)</label>
                <select {...register('vehicleId')} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option value="">None</option>
                  {vehicles?.data?.content?.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Hotel (Optional)</label>
                <select {...register('hotelId')} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option value="">None</option>
                  {/* Assuming hotels list is similar */}
                  <option value="1">Luxury Hotel 1</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Start Date</label>
                <input type="date" {...register('startDate', { required: true })} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">End Date</label>
                <input type="date" {...register('endDate', { required: true })} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>

          {/* Pricing & Payments Section */}
          <div className="space-y-6 md:col-span-2 bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 grid md:grid-cols-3 gap-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
                <IndianRupee className="h-3 w-3" /> Total Amount
              </label>
              <input 
                type="number" 
                {...register('totalAmount', { required: true, valueAsNumber: true })}
                className="w-full px-6 py-4 bg-white rounded-2xl border-none font-black text-lg text-slate-800 focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Advance Paid
              </label>
              <input 
                type="number" 
                {...register('advancePaid', { valueAsNumber: true })}
                className="w-full px-6 py-4 bg-white rounded-2xl border-none font-black text-lg text-emerald-600 focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
            </div>
             <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Booking Status</label>
              <select {...register('bookingStatus')} className="w-full px-6 py-4 bg-white rounded-2xl border-none font-black text-slate-800 focus:ring-2 focus:ring-primary/20 shadow-sm">
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 pt-4 flex gap-4">
             <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all"
             >
               Cancel
             </button>
             <button 
              type="submit"
              disabled={mutation.isPending}
              className="flex-[2] flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-white bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
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
