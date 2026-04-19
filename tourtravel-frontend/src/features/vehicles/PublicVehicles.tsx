import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicVehicles() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['public', 'vehicles'],
    queryFn: async () => (await api.get('/vehicles')).data
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

  const vehicles = response?.data?.content || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Premium Fleet Rentals</h1>
        <p className="mt-4 text-lg text-slate-500">Choose from our exclusive collection of luxury and utility vehicles for your next journey.</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((v: any) => (
          <div key={v.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden relative">
              <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {v.vehicleType}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{v.name}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{v.description}</p>
              
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">₹{v.pricePerDay}</span>
                  <span className="text-xs text-slate-500">per day</span>
                </div>
                <Button>
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
