import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Plane, Train, Bus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicTickets() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['public', 'tickets'],
    queryFn: async () => (await api.get('/tickets')).data
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

  const tickets = response?.data?.content || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Seamless Journey Booking</h1>
        <p className="mt-4 text-lg text-slate-500">Explore our curated flight, train, and bus transit routes for your next escape.</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((t: any) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm border p-6 hover:border-primary transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {t.type === 'FLIGHT' ? <Plane className="h-6 w-6" /> : t.type === 'TRAIN' ? <Train className="h-6 w-6" /> : <Bus className="h-6 w-6" />}
              </div>
              <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600 tracking-wider">
                {t.type}
              </span>
            </div>
            
            <div className="space-y-4 relative">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Origin</span>
                <span className="text-lg font-bold">{t.origin}</span>
              </div>
              
              <div className="pl-2 border-l-2 border-dashed border-slate-300 ml-2 h-6 absolute left-0 top-10"></div>
              
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Destination</span>
                <span className="text-lg font-bold">{t.destination}</span>
              </div>
            </div>

            <p className="mt-6 border-t pt-4 text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
              {t.description || "Standard transit route configuration. Check availability."}
            </p>
            
            <Button className="w-full mt-6" variant="outline">Enquire Now</Button>
          </div>
        ))}
      </div>
      
      {tickets.length === 0 && (
        <div className="text-center py-20 text-slate-500 border-2 border-dashed rounded-2xl">
          <p className="text-xl">No routes configured yet.</p>
        </div>
      )}
    </div>
  );
}
