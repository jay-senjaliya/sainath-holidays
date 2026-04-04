import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Loader2, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicHotels() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['public', 'hotels'],
    queryFn: async () => (await api.get('/hotels')).data
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

  const hotels = response?.data?.content || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Luxury Partner Hotels</h1>
        <p className="mt-4 text-lg text-slate-500">Hand-picked premium stays ensuring unparalleled comfort across top destinations.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {hotels.map((h: any) => (
          <div key={h.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow">
            <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
              <img src={h.imageUrl} alt={h.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center text-amber-500 mb-2">
                  {[...Array(h.starRating || 0)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <h3 className="text-2xl font-bold mb-1 leading-tight">{h.name}</h3>
                <p className="text-slate-500 text-sm flex items-center mb-4">
                  <MapPin className="h-3 w-3 mr-1" /> {h.location}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {Array.isArray(h.amenities) && h.amenities.slice(0,4).map((a: any, i: number) => (
                    <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {typeof a === 'string' ? a : a.amenity}
                    </span>
                  ))}
                  {Array.isArray(h.amenities) && h.amenities.length > 4 && <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600">+{h.amenities.length - 4} more</span>}
                </div>
              </div>
              
              <div className="flex items-end justify-between mt-4">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Starting from</span>
                  <span className="text-2xl font-bold text-primary leading-none">₹{h.pricePerNight}</span>
                </div>
                <Button>Select</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
