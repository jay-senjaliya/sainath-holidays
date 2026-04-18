import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Users, Package, Car, Building2, TrendingUp, DollarSign, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminDashboard() {
  const { data: packages, isLoading: pkgsLoading } = useQuery({
    queryKey: ['admin-inventory-packages'],
    queryFn: async () => (await api.get('/packages')).data
  });
  
  const { data: enquiries, isLoading: enqLoading } = useQuery({
    queryKey: ['admin-inventory-enquiries'],
    queryFn: async () => (await api.get('/admin/enquiries')).data
  });

  const { data: vehicles, isLoading: vehLoading } = useQuery({
    queryKey: ['admin-inventory-vehicles'],
    queryFn: async () => (await api.get('/vehicles?availableOnly=false')).data
  });

  const { data: hotels, isLoading: hotelLoading } = useQuery({
    queryKey: ['admin-inventory-hotels'],
    queryFn: async () => (await api.get('/hotels')).data
  });

  const isLoading = pkgsLoading || enqLoading || vehLoading || hotelLoading;

  const stats = [
    { title: 'Total Revenue', value: '₹4,52,310', icon: DollarSign, trend: '+12% from last month' },
    { title: 'Active Packages', value: packages?.data?.totalElements || '0', icon: Package, trend: 'Live on site' },
    { title: 'User Enquiries', value: enquiries?.data?.totalElements || '0', icon: Users, trend: 'Pending leads' },
    { title: 'Fleet Size', value: vehicles?.data?.totalElements || '0', icon: Car, trend: 'Verified vehicles' },
    { title: 'Hotel Partners', value: hotels?.data?.totalElements || '0', icon: Building2, trend: 'Luxury stays' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground italic uppercase">COMMAND CENTER</h1>
          <p className="text-muted-foreground font-medium mt-1 uppercase tracking-widest text-[10px] md:text-xs">
            Real-time performance metrics & system health.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-card border border-border rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 shadow-xl shadow-slate-200/50 hover:scale-105 transition-all"
            >
              <div className="flex items-center justify-between space-y-0 pb-4">
                <div className="p-2 bg-secondary rounded-xl"><Icon className="h-4 w-4 text-primary" /></div>
                <div className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.title}</div>
              </div>
              <div className="text-2xl md:text-3xl font-black text-foreground">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : stat.value}
              </div>
              <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground mt-4 flex items-center gap-1 uppercase tracking-tighter">
                <TrendingUp className="h-3 w-3 text-green-500" />
                {stat.trend}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 mt-8">
        
        {/* Visual Chart Area */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] lg:col-span-4 p-10 shadow-2xl relative overflow-hidden hidden md:block">
          <div className="relative z-10">
            <h3 className="text-xl font-black italic mb-2 tracking-tighter text-white">REVENUE ANALYTICS</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">Projected vs Actual Earnings</p>
            
            <div className="h-[250px] w-full flex items-end justify-between gap-4 px-2 pb-4 pt-12 border-b border-white/5">
              {[40, 70, 45, 90, 65, 80, 110, 85, 95, 75, 120, 100].map((h, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: `${(h/120) * 100}%` }}
                  transition={{ duration: 1.5, delay: idx * 0.05, ease: "circOut" }}
                  className="w-full bg-primary/40 rounded-t-lg relative group hover:bg-primary transition-all cursor-pointer box-content border-x-4 border-transparent bg-clip-padding"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card text-foreground text-[10px] font-black py-1.5 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-border">
                    ₹{h}k
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between px-2 mt-6 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
          </div>
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        </div>

        {/* Recent Enquiries Activity */}
        <div className="bg-card border border-border rounded-[2.5rem] lg:col-span-3 p-10 shadow-xl shadow-slate-200/50 flex flex-col h-full">
          <h3 className="text-xl font-black italic mb-2 tracking-tighter text-foreground">RECENT ACTIVITY</h3>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-10">Latest {enquiries?.data?.content?.length || 0} user inquiries</p>
          
          <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
            ) : enquiries?.data?.content?.slice(0, 6).map((enq: any) => (
              <div key={enq.id} className="flex items-center group cursor-pointer">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0 text-primary font-black border border-border group-hover:bg-primary group-hover:text-white transition-colors uppercase">
                  {(enq.user?.email || '?').charAt(0)}
                </div>
                <div className="ml-5 space-y-1 overflow-hidden flex-1">
                  <p className="text-sm font-black text-foreground truncate leading-none capitalize">{enq.user?.name || enq.user?.email.split('@')[0]}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Interest: {enq.serviceType}</p>
                </div>
                <div className={`ml-4 font-black text-[9px] px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${enq.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                  {enq.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW CRM WIDGETS */}
      <div className="grid gap-8 md:grid-cols-2 mt-8">
          {/* Upcoming Departures */}
          <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-black italic tracking-tighter text-foreground">UPCOMING TRIPS</h3>
                   <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Starting in next 14 days</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Calendar className="h-6 w-6" />
                </div>
            </div>
            
            <div className="space-y-6">
                <UpcomingBookingsList type="upcoming" />
            </div>
          </div>

          {/* Payment Reminders */}
          <div className="bg-destructive/5 border border-destructive/10 rounded-[2.5rem] p-10 shadow-xl dark:shadow-none">
            <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-black italic tracking-tighter text-destructive">PAYMENT ALERTS</h3>
                   <p className="text-xs text-destructive/60 font-bold uppercase tracking-widest mt-1">Pending balances for confirmed bookings</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
                    <DollarSign className="h-6 w-6" />
                </div>
            </div>
            
            <div className="space-y-6">
                 <UpcomingBookingsList type="pending-payments" />
            </div>
          </div>
      </div>
    </div>
  );
}

function UpcomingBookingsList({ type }: { type: 'upcoming' | 'pending-payments' }) {
    const { data: bookings, isLoading } = useQuery({
        queryKey: ['admin-dashboard', type],
        queryFn: async () => (await api.get(`/admin/bookings/${type === 'upcoming' ? 'upcoming' : 'pending-payments'}`)).data
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>;

    if (!bookings?.data || bookings.data.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">No {type === 'upcoming' ? 'upcoming trips' : 'pending payments'}</p>
            </div>
        );
    }

    return bookings.data.slice(0, 5).map((booking: any) => (
        <div key={booking.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl hover:border-primary/20 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                    <Package className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-xs font-black text-foreground uppercase tracking-tight italic">{booking.customerName}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5">
                        {type === 'upcoming' ? `Starts: ${booking.startDate}` : `Balance: ₹${booking.balanceAmount}`}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${type === 'upcoming' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-destructive/10 text-destructive'}`}>
                    {type === 'upcoming' ? 'STARTING' : 'PENDING'}
                </span>
            </div>
        </div>
    ));
}

