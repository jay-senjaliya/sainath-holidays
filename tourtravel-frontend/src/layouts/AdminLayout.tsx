import { useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom"
import { Palmtree, LayoutDashboard, Package, Car, Building2, MessageSquare, LogOut, Calendar as CalendarIcon, Menu, X } from "lucide-react"

interface SidebarProps {
  location: any;
  onClose: () => void;
}

const SidebarContent = ({ location, onClose }: SidebarProps) => {
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Packages', path: '/admin/packages', icon: Package },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarIcon },
    { label: 'Vehicles', path: '/admin/vehicles', icon: Car },
    { label: 'Hotels', path: '/admin/hotels', icon: Building2 },
    { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  ];

  return (
    <>
      <div className="h-24 flex items-center px-8 border-b border-white/5 justify-between">
        <div className="flex items-center gap-3">
          <Palmtree className="h-8 w-8 text-primary" />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter uppercase italic">Sainath</span>
            <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase">Holidays</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="p-6 flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={onClose}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all
                ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-slate-400 hover:text-white'}
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
         <button className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400 hover:bg-white/5 transition-all">
            <LogOut className="h-5 w-5" />
            Sign Out
         </button>
      </div>
    </>
  );
};

export function AdminLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-full md:w-72 bg-[#0E2E50] text-white h-full hidden md:flex flex-col shadow-2xl flex-shrink-0">
        <SidebarContent location={location} onClose={() => {}} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#0E2E50]/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-72 bg-[#0E2E50] text-white z-[70] md:hidden transform transition-transform duration-300 flex flex-col shadow-2xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent location={location} onClose={() => setIsMobileMenuOpen(false)} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center px-6 md:px-10 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 border text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Palmtree className="h-6 w-6 text-primary" />
              <span className="font-black tracking-tighter uppercase text-sm md:text-base hidden sm:block">Sainath Holidays</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="text-right hidden sm:block">
               <div className="text-xs font-black text-[#0E2E50] uppercase tracking-widest">Admin User</div>
               <div className="text-[10px] text-slate-400 font-bold uppercase">System Operator</div>
             </div>
             <div className="h-10 w-10 rounded-xl bg-slate-100 border flex items-center justify-center font-black text-primary">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

