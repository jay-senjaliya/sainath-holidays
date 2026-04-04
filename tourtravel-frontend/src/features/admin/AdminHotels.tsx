import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminHotels() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<any>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin', 'hotels'],
    queryFn: async () => (await api.get('/hotels')).data
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/admin/hotels/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'hotels'] })
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (currentHotel) return await api.put(`/admin/hotels/${currentHotel.id}`, payload);
      return await api.post('/admin/hotels', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'hotels'] });
      setIsEditing(false);
      setCurrentHotel(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      location: formData.get('location'),
      description: formData.get('description'),
      pricePerNight: Number(formData.get('pricePerNight')),
      starRating: Number(formData.get('starRating')),
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
      imageUrl: formData.get('imageUrl'),
      amenities: (formData.get('amenities') as string).split(',').map(s => s.trim())
    };
    saveMutation.mutate(data);
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  const hotels = response?.data?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Hotels</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}><Plus className="h-4 w-4 mr-2"/> Add Hotel</Button>
        )}
      </div>

      {isEditing ? (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">{currentHotel ? 'Edit Hotel' : 'New Hotel'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Hotel Name</label>
                <input required name="name" defaultValue={currentHotel?.name} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location String</label>
                <input required name="location" defaultValue={currentHotel?.location} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Star Rating (1-5)</label>
                <input required type="number" min="1" max="5" name="starRating" defaultValue={currentHotel?.starRating} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price / Night</label>
                <input required type="number" name="pricePerNight" defaultValue={currentHotel?.pricePerNight} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <input required type="number" step="0.0001" name="latitude" defaultValue={currentHotel?.latitude} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <input required type="number" step="0.0001" name="longitude" defaultValue={currentHotel?.longitude} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Image URL</label>
                <input required name="imageUrl" defaultValue={currentHotel?.imageUrl} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Amenities (comma-separated)</label>
                <input required name="amenities" defaultValue={currentHotel?.amenities?.map((a: any) => typeof a === 'string' ? a : a.amenity).join(', ')} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea required name="description" defaultValue={currentHotel?.description} className="w-full border p-2 rounded" />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" type="button" onClick={() => {setIsEditing(false); setCurrentHotel(null)}}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Save
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Price/Night</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((h: any) => (
                <tr key={h.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <img src={h.imageUrl} alt={h.name} className="w-12 h-8 object-cover rounded" />
                  </td>
                  <td className="px-6 py-3 font-medium">{h.name}</td>
                  <td className="px-6 py-3">{h.location}</td>
                  <td className="px-6 py-3">{h.starRating} ★</td>
                  <td className="px-6 py-3">₹{h.pricePerNight}</td>
                  <td className="px-6 py-3 text-right space-x-2 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => { setCurrentHotel(h); setIsEditing(true); }}>
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(h.id); }}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
              {hotels.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No hotels found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
