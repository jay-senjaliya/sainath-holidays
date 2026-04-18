import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Clock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminPackages() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<any>(null);

  // Form State for Collections
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    if (currentPackage) {
      // If editing, fetch full details to get itineraries and images
      const fetchDetails = async () => {
        try {
          const res = await api.get(`/packages/${currentPackage.id}`);
          const data = res.data.data;
          setItineraries(data.itineraries || []);
          setImages(data.images || []);
        } catch (err) {
          console.error("Failed to fetch package details", err);
        }
      };
      fetchDetails();
    } else {
      setItineraries([{ dayNumber: 1, title: '', description: '' }]);
      setImages([{ imageUrl: '', primary: true }]);
    }
  }, [currentPackage]);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['admin-inventory-packages'],
    queryFn: async () => {
      const res = await api.get('/packages?size=100');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await api.delete(`/admin/packages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-inventory-packages'] })
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (currentPackage) return await api.put(`/admin/packages/${currentPackage.id}`, payload);
      return await api.post('/admin/packages', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inventory-packages'] });
      setIsEditing(false);
      setCurrentPackage(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to save package");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      durationDays: Number(formData.get('durationDays')),
      location: formData.get('location'),
      category: formData.get('category'),
      latitude: Number(formData.get('latitude') || 0),
      longitude: Number(formData.get('longitude') || 0),
      active: true,
      itineraries: itineraries.map(it => ({
        dayNumber: Number(it.dayNumber),
        title: it.title,
        description: it.description
      })),
      images: images.filter(img => img.imageUrl).map(img => ({
        imageUrl: img.imageUrl,
        primary: !!img.primary
      }))
    };

    if (data.itineraries.length === 0) return alert("At least one itinerary day is required");
    if (data.images.length === 0) return alert("At least one image is required");

    saveMutation.mutate(data);
  };

  const addItinerary = () => {
    const nextDay = itineraries.length > 0 ? Math.max(...itineraries.map(i => i.dayNumber)) + 1 : 1;
    setItineraries([...itineraries, { dayNumber: nextDay, title: '', description: '' }]);
  };

  const removeItinerary = (idx: number) => {
    setItineraries(itineraries.filter((_, i) => i !== idx));
  };

  const updateItinerary = (idx: number, field: string, value: any) => {
    const next = [...itineraries];
    next[idx] = { ...next[idx], [field]: value };
    setItineraries(next);
  };

  const addImage = () => {
    setImages([...images, { imageUrl: '', primary: false }]);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const updateImage = (idx: number, field: string, value: any) => {
    const next = [...images];
    if (field === 'primary' && value === true) {
      next.forEach(img => img.primary = false);
    }
    next[idx] = { ...next[idx], [field]: value };
    setImages(next);
  };

  if (isLoading) return <div className="flex h-96 items-center justify-center flex-col gap-4 text-slate-400 font-medium italic"><Loader2 className="animate-spin h-10 w-10 text-primary" /> Loading packages...</div>;
  if (isError) return <div className="p-12 text-center text-red-500 font-bold border-2 border-red-100 rounded-3xl bg-red-50">Failed to load packages. Please check if the backend is running.</div>;

  const packages = response?.data?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Package Inventory</h1>
        {!isEditing && (
          <Button onClick={() => { setIsEditing(true); setCurrentPackage(null); }} className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"><Plus className="h-4 w-4 mr-2"/> Add New Package</Button>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 bg-card border border-border rounded-3xl shadow-sm space-y-8">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Pencil className="h-5 w-5 text-primary" /></div>
                {currentPackage ? 'Update Package Details' : 'Create New Package'}
              </h2>
              
              <form id="packageForm" onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Package Title</label>
                    <input required name="title" defaultValue={currentPackage?.title} className="w-full bg-background border border-border p-4 rounded-2xl focus:ring-primary focus:border-primary transition-all text-lg text-foreground outline-none" placeholder="e.g. 5 Days Kerala Backwater Tour" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Category</label>
                    <select name="category" defaultValue={currentPackage?.category || 'DOMESTIC'} className="w-full bg-background border border-border p-4 rounded-2xl focus:ring-primary focus:border-primary text-foreground outline-none">
                      <option value="DOMESTIC">DOMESTIC</option>
                      <option value="INTERNATIONAL">INTERNATIONAL</option>
                      <option value="HONEYMOON">HONEYMOON</option>
                      <option value="ADVENTURE">ADVENTURE</option>
                      <option value="PILGRIMAGE">PILGRIMAGE</option>
                      <option value="BEACH">BEACH</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Location</label>
                    <input required name="location" defaultValue={currentPackage?.location} className="w-full bg-background border border-border p-4 rounded-2xl focus:ring-primary focus:border-primary text-foreground outline-none" placeholder="e.g. Munnar, Kerala" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Duration (Days)</label>
                    <input required type="number" name="durationDays" defaultValue={currentPackage?.durationDays} className="w-full bg-background border border-border p-4 rounded-2xl focus:ring-primary focus:border-primary text-center font-bold text-foreground outline-none" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Price (₹)</label>
                    <input required type="number" name="price" defaultValue={currentPackage?.price} className="w-full bg-background border border-border p-4 rounded-2xl focus:ring-primary focus:border-primary text-center font-bold text-foreground outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Latitude</label>
                    <input required type="number" step="any" name="latitude" defaultValue={currentPackage?.latitude || 0} className="w-full bg-background border border-border p-4 rounded-2xl focus:ring-primary focus:border-primary text-foreground outline-none" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Longitude</label>
                    <input required type="number" step="any" name="longitude" defaultValue={currentPackage?.longitude || 0} className="w-full bg-background border border-border p-4 rounded-2xl focus:ring-primary focus:border-primary text-foreground outline-none" />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Description</label>
                    <textarea required name="description" defaultValue={currentPackage?.description} className="w-full bg-background border border-border p-4 rounded-2xl h-48 focus:ring-primary focus:border-primary transition-all resize-none text-foreground outline-none" placeholder="Describe the magical experience..." />
                  </div>
                </div>
              </form>
            </div>

            {/* Itineraries Section */}
            <div className="p-8 bg-card border border-border rounded-3xl shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><Clock className="h-5 w-5 text-primary" /></div>
                  Day-by-Day Itinerary
                </h2>
                <Button size="sm" variant="outline" onClick={addItinerary} className="rounded-xl border-dashed border-2 hover:border-primary hover:bg-primary/5"><Plus className="h-4 w-4 mr-2"/> Add Day</Button>
              </div>
              
              <div className="space-y-6">
                {itineraries.map((it, idx) => (
                  <div key={idx} className="p-6 border border-border bg-secondary/50 rounded-3xl space-y-4 relative group hover:bg-background/80 hover:border-border transition-all shadow-sm">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Day</label>
                        <input type="number" value={it.dayNumber} onChange={(e) => updateItinerary(idx, 'dayNumber', e.target.value)} className="w-full border-border bg-background p-3 rounded-xl text-center font-black text-primary text-xl" />
                      </div>
                      <div className="col-span-4">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Day Title</label>
                        <input value={it.title} onChange={(e) => updateItinerary(idx, 'title', e.target.value)} className="w-full border-border bg-background p-3 rounded-xl font-bold text-foreground" placeholder="e.g. Arrival in Munnar and Site Seeing" />
                      </div>
                      <div className="col-span-1 flex items-end justify-center">
                        <Button variant="ghost" size="icon" onClick={() => removeItinerary(idx)} className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-full h-12 w-12"><Trash2 className="h-5 w-5"/></Button>
                      </div>
                      <div className="col-span-6">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Activities</label>
                        <textarea value={it.description} onChange={(e) => updateItinerary(idx, 'description', e.target.value)} className="w-full border-border bg-background p-4 rounded-2xl h-24 resize-none text-foreground" placeholder="What will they do today?" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-card border border-border rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><ImageIcon className="h-5 w-5 text-primary" /></div>
                  Gallery
                </h2>
                <Button size="sm" variant="outline" onClick={addImage} className="rounded-xl border-dashed border-2"><Plus className="h-4 w-4" /></Button>
              </div>

              <div className="space-y-4">
                {images.map((img, idx) => (
                  <div key={idx} className="space-y-3 p-4 border border-border rounded-2xl relative group bg-secondary/30">
                    {img.imageUrl && (
                      <div className="h-32 w-full rounded-xl overflow-hidden mb-2 shadow-inner">
                        <img src={img.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-muted-foreground uppercase">Image URL</label>
                       <input 
                        value={img.imageUrl} 
                        onChange={(e) => updateImage(idx, 'imageUrl', e.target.value)} 
                        className="w-full text-xs border border-border p-3 rounded-xl bg-background text-foreground" 
                        placeholder="https://images.unsplash.com/..." 
                      />
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <button 
                        type="button"
                        onClick={() => updateImage(idx, 'primary', !img.primary)}
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors ${img.primary ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${img.primary ? 'border-primary bg-primary text-white' : 'border-slate-200'}`}>
                          {img.primary ? <Check className="h-3 w-3"/> : null}
                        </div>
                        Main Thumbnail
                      </button>
                      <Button variant="ghost" size="icon" onClick={() => removeImage(idx)} className="h-8 w-8 text-destructive/40 hover:text-destructive"><X className="h-4 w-4"/></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky top-6 p-8 bg-slate-900 rounded-[2rem] shadow-2xl space-y-6">
              <h3 className="text-white font-bold text-lg">Final Submission</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Review all fields carefully. Your changes will be reflected immediately on the public listing and map view.</p>
              <div className="flex flex-col gap-4">
                <Button form="packageForm" type="submit" className="w-full py-7 text-lg font-black rounded-2xl bg-primary hover:bg-primary/90 transition-transform active:scale-95 shadow-xl shadow-primary/20" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="mr-3 h-5 w-5 animate-spin"/>}
                  {currentPackage ? 'Push Updates' : 'Publish Package'}
                </Button>
                <Button variant="outline" className="w-full bg-transparent text-white border-white/10 hover:bg-white/5 py-4 rounded-2xl" onClick={() => {setIsEditing(false); setCurrentPackage(null)}}>Discard Changes</Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-[2rem] bg-card overflow-hidden shadow-xl">
          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-border">
            {packages.map((p: any) => (
              <div key={p.id} className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-secondary overflow-hidden flex-shrink-0 shadow-inner">
                    {p.primaryImageUrl && <img src={p.primaryImageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-black text-foreground text-lg truncate uppercase italic tracking-tighter">{p.title}</div>
                    <div className="text-xs text-muted-foreground font-medium">{p.durationDays} Days / {p.durationDays - 1} Nights</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/30 p-3 rounded-xl">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Price</div>
                    <div className="font-black text-foreground">₹{p.price?.toLocaleString()}</div>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded-xl">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Category</div>
                    <div className="font-black text-primary text-[10px] uppercase truncate">{p.category}</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" className="flex-1 h-12 rounded-xl bg-secondary text-foreground font-bold text-[10px] uppercase tracking-widest border border-border" onClick={() => { setCurrentPackage(p); setIsEditing(true); }}>
                    Edit
                  </Button>
                  <Button variant="ghost" className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive border border-destructive/10" onClick={() => { if(confirm('Are you sure?')) deleteMutation.mutate(p.id); }}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground font-bold uppercase tracking-[0.15em] text-[10px] border-b border-border">
                <tr>
                  <th className="px-8 py-5">Package</th>
                  <th className="px-8 py-5">Location</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {packages.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-secondary overflow-hidden flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                          {p.primaryImageUrl && <img src={p.primaryImageUrl} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-black text-foreground text-base">{p.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{p.durationDays} Days / {p.durationDays - 1} Nights</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground font-medium">{p.location}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1.5 rounded-xl bg-secondary text-foreground/70 font-bold text-[9px] tracking-wider uppercase border border-border">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-foreground text-base">
                      {p.price ? `₹${p.price.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => { setCurrentPackage(p); setIsEditing(true); }} className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary">
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { if(confirm('Are you sure? This will remove the package from public view.')) deleteMutation.mutate(p.id); }} className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {packages.length === 0 && (
            <div className="text-center py-32 bg-secondary/20 flex flex-col items-center gap-4">
              <div className="p-4 bg-card rounded-[2rem] shadow-sm"><ImageIcon className="h-12 w-12 text-muted-foreground/30" /></div>
              <div className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No packages in inventory yet</div>
              <Button onClick={() => setIsEditing(true)} variant="link" className="text-primary font-bold">Begin by adding your first tour!</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


