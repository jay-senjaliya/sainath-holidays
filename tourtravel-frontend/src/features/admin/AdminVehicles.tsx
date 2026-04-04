import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminVehicles() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin', 'vehicles'],
    queryFn: async () => (await api.get('/vehicles?availableOnly=false')).data
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/admin/vehicles/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] })
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (currentVehicle) return await api.put(`/admin/vehicles/${currentVehicle.id}`, payload);
      return await api.post('/admin/vehicles', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vehicles'] });
      setIsEditing(false);
      setCurrentVehicle(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      vehicleType: formData.get('vehicleType'),
      name: formData.get('name'),
      description: formData.get('description'),
      pricePerDay: Number(formData.get('pricePerDay')),
      seatingCapacity: Number(formData.get('seatingCapacity')),
      available: formData.get('available') === 'on',
      imageUrl: formData.get('imageUrl')
    };
    saveMutation.mutate(data);
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  const vehicles = response?.data?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Vehicles</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}><Plus className="h-4 w-4 mr-2"/> Add Vehicle</Button>
        )}
      </div>

      {isEditing ? (
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">{currentVehicle ? 'Edit Vehicle' : 'New Vehicle'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input required name="name" defaultValue={currentVehicle?.name} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type (SUV, SEDAN, LUXYURY...)</label>
                <input required name="vehicleType" defaultValue={currentVehicle?.vehicleType} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price/Day</label>
                <input required type="number" name="pricePerDay" defaultValue={currentVehicle?.pricePerDay} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <input required type="number" name="seatingCapacity" defaultValue={currentVehicle?.seatingCapacity} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea required name="description" defaultValue={currentVehicle?.description} className="w-full border p-2 rounded" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Image URL</label>
                <input required name="imageUrl" defaultValue={currentVehicle?.imageUrl} className="w-full border p-2 rounded" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="available" defaultChecked={currentVehicle ? currentVehicle.available : true} id="avail" />
                <label htmlFor="avail" className="text-sm font-medium">Available</label>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" type="button" onClick={() => {setIsEditing(false); setCurrentVehicle(null)}}>Cancel</Button>
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
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Price/Day</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v: any) => (
                <tr key={v.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <img src={v.imageUrl} alt={v.name} className="w-12 h-8 object-cover rounded" />
                  </td>
                  <td className="px-6 py-3 font-medium">{v.name}</td>
                  <td className="px-6 py-3">{v.vehicleType}</td>
                  <td className="px-6 py-3">₹{v.pricePerDay}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs px-2 py-1 rounded-full ${v.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {v.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right space-x-2 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => { setCurrentVehicle(v); setIsEditing(true); }}>
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(v.id); }}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No vehicles found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
