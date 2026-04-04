import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Booking } from '@/types/booking';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  XCircle,
  IndianRupee,
  Phone,
  Mail,
  CalendarDays
} from 'lucide-react';
import { format } from 'date-fns';
import { BookingForm } from './components/BookingForm';
import { AdminCalendar } from './components/AdminCalendar';

export function AdminBookings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const res = await api.get('/admin/bookings');
      return res.data.data as Booking[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'COMPLETED': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'FULL': return 'text-emerald-600';
      case 'PARTIAL': return 'text-amber-600';
      case 'PENDING': return 'text-rose-600';
      default: return 'text-slate-600';
    }
  };

  if (isLoading) return <div className="p-8">Loading bookings...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 italic tracking-tighter uppercase">Bookings</h1>
          <p className="text-slate-500 font-medium">Manage confirmed trips, payments, and offline reservations.</p>
        </div>
        <button 
          onClick={() => { setSelectedBooking(undefined); setIsFormOpen(true); }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Manual Booking
        </button>
      </div>

      {isFormOpen && (
        <BookingForm 
          booking={selectedBooking} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{bookings?.length || 0}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Bookings</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {bookings?.filter(b => b.paymentStatus !== 'FULL').length || 0}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Payments</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
                {bookings?.filter(b => new Date(b.startDate) > new Date()).length || 0}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming Trips</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by name, phone, or package..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors text-primary"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </button>
        </div>
      </div>

      {isCalendarOpen && (
        <AdminCalendar onClose={() => setIsCalendarOpen(false)} />
      )}

      {/* Bookings Table or UI Content */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dates</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Payment</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 uppercase tracking-tighter italic">{booking.customerName}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-slate-300" />
                        <span className="text-xs font-bold text-slate-400">{booking.customerPhone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col max-w-[200px]">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest truncate">
                        {booking.packageTitle || booking.vehicleName || booking.hotelName || 'Custom Service'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                        {booking.packageTitle ? 'Package' : booking.vehicleName ? 'Vehicle' : 'Hotel'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">
                        {format(new Date(booking.startDate), 'MMM dd, yyyy')}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        to {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-slate-800 font-black tracking-tighter italic">
                         <IndianRupee className="h-3 w-3" />
                         {booking.totalAmount}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${getPaymentColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => { setSelectedBooking(booking); setIsFormOpen(true); }}
                            className="h-10 px-4 rounded-xl hover:bg-slate-100 flex items-center justify-center text-primary font-bold text-[10px] uppercase tracking-widest transition-colors border border-transparent hover:border-primary/10"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={async () => {
                                if (confirm('Are you sure you want to delete this booking record?')) {
                                    await api.delete(`/admin/bookings/${booking.id}`);
                                    queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
                                }
                            }}
                            className="h-10 w-10 rounded-xl hover:bg-rose-50 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors"
                        >
                            <XCircle className="h-5 w-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
