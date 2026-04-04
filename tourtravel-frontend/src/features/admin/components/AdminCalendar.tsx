import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Booking } from '@/types/booking';
import { 
  ChevronLeft, 
  ChevronRight, 
  X,
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';

interface Props {
  onClose: () => void;
}

export function AdminCalendar({ onClose }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings-calendar'],
    queryFn: async () => {
      const res = await api.get('/admin/bookings');
      return res.data.data as Booking[];
    }
  });

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#0E2E50] rounded-t-[40px]">
        <div className="flex flex-col">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
                {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Operations Schedule</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/5 rounded-2xl p-1 gap-1">
            <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="h-10 w-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="h-10 w-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
        {days.map((day) => (
          <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        
        // Find bookings for this day
        const dayBookings = bookings?.filter(b => 
            isSameDay(new Date(b.startDate), cloneDay) || 
            (new Date(b.startDate) < cloneDay && new Date(b.endDate) >= cloneDay)
        ) || [];

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] md:min-h-[140px] p-2 md:p-4 border-r border-b border-slate-100 transition-colors relative
              ${!isSameMonth(day, monthStart) ? 'bg-slate-50/50' : 'bg-white'}
              ${isSameDay(day, new Date()) ? 'bg-primary/5' : ''}
            `}
          >
            <span className={`text-sm font-black italic tracking-tighter ${!isSameMonth(day, monthStart) ? 'text-slate-300' : 'text-slate-400'} ${isSameDay(day, new Date()) ? 'text-primary' : ''}`}>
              {formattedDate}
            </span>
            
            <div className="mt-2 space-y-1">
              {dayBookings.slice(0, 3).map((b, idx) => (
                <div 
                    key={b.id + '-' + idx} 
                    className="text-[9px] font-black uppercase tracking-tight py-1 px-2 rounded-lg bg-primary/10 text-primary truncate border border-primary/10"
                    title={`${b.customerName} - ${b.packageTitle || 'Trip'}`}
                >
                  {b.customerName.split(' ')[0]}
                </div>
              ))}
              {dayBookings.length > 3 && (
                <div className="text-[8px] font-bold text-slate-400 text-center uppercase tracking-widest mt-1">
                  + {dayBookings.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-white">{rows}</div>;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-8 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl md:rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 min-h-screen md:min-h-0">
        {renderHeader()}
        <div className="bg-white overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px]">
                {renderDays()}
                {renderCells()}
            </div>
        </div>
      </div>
    </div>
  );
}
