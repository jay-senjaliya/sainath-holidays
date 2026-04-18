import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminEnquiries() {
  const queryClient = useQueryClient();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['admin-inventory-enquiries'],
    queryFn: async () => {
      const res = await api.get('/admin/enquiries');
      return res.data;
    }
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number, notes: string }) => 
      await api.patch(`/admin/enquiries/${id}/status`, { status: 'RESOLVED', adminNotes: notes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-inventory-enquiries'] })
  });
  
  const inProgressMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number, notes: string }) => 
      await api.patch(`/admin/enquiries/${id}/status`, { status: 'IN_PROGRESS', adminNotes: notes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-inventory-enquiries'] })
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center flex-col gap-4 text-muted-foreground font-medium italic"><Loader2 className="animate-spin h-10 w-10 text-primary" /> Loading enquiries...</div>;
  if (isError) return <div className="p-12 text-center text-destructive font-bold border-2 border-destructive/20 rounded-3xl bg-destructive/5">Failed to load enquiries. Please check if the backend is running.</div>;

  const enquiries = response?.data?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Public Enquiries</h1>
        <div className="text-xs font-bold text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          Incoming Leads: {enquiries.length}
        </div>
      </div>

      <div className="border border-border rounded-[2rem] bg-card overflow-hidden shadow-xl">
        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-border">
          {enquiries.map((e: any) => (
            <div key={e.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-black text-foreground uppercase tracking-tighter italic text-lg leading-none">{e.user?.name || 'Guest User'}</span>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">{new Date(e.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase
                  ${e.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : ''}
                  ${e.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500' : ''}
                  ${e.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                `}>
                  {e.status}
                </span>
              </div>

              <div className="bg-secondary/30 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-muted-foreground uppercase tracking-widest">Service</span>
                  <span className="font-black text-primary uppercase text-[10px] truncate max-w-[150px]">{e.packageTitle || e.serviceType}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Inquiry</span>
                  <p className="text-xs text-foreground leading-relaxed italic line-clamp-3">"{e.message}"</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {e.status !== 'RESOLVED' ? (
                  <>
                    {e.status === 'PENDING' && (
                      <Button size="sm" variant="outline" className="w-full text-[10px] font-black uppercase rounded-xl h-12 border-2" 
                        onClick={() => inProgressMutation.mutate({ id: e.id, notes: 'Followed up.' })}>
                        Acknowledge
                      </Button>
                    )}
                    <Button size="sm" className="w-full text-[10px] font-black uppercase rounded-xl h-12 bg-primary text-primary-foreground" 
                      onClick={() => resolveMutation.mutate({ id: e.id, notes: 'Resolved.' })}>
                      <Check className="mr-2 h-4 w-4" /> Close Ticket
                    </Button>
                  </>
                ) : (
                  <div className="h-12 flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <Check className="h-4 w-4" /> Resolved Successfully
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground font-bold uppercase tracking-[0.15em] text-[10px] border-b border-border">
              <tr>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Customer Profile</th>
                <th className="px-8 py-5">Package / Service</th>
                <th className="px-8 py-5 w-1/3">Detailed Inquiry</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enquiries.map((e: any) => (
                <tr key={e.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-8 py-6">
                     <div className="font-bold text-foreground">{new Date(e.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</div>
                     <div className="text-[10px] text-muted-foreground font-medium">{new Date(e.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                   <td className="px-8 py-6">
                    <div className="font-black text-foreground">{e.user?.name || 'Guest User'}</div>
                    <div className="text-xs text-muted-foreground font-medium lowercase">{e.user?.email}</div>
                    <div className="text-xs text-muted-foreground/60">{e.user?.phone}</div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground font-bold text-[9px] tracking-wider uppercase">
                       {e.serviceType}
                     </span>
                     {e.packageTitle && <div className="mt-2 font-bold text-primary text-xs truncate max-w-[150px]">{e.packageTitle}</div>}
                  </td>
                   <td className="px-8 py-6">
                    <div className="text-muted-foreground leading-relaxed text-xs line-clamp-3 italic">"{e.message}"</div>
                  </td>
                   <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase
                      ${e.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : ''}
                      ${e.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500' : ''}
                      ${e.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500 font-black' : ''}
                    `}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col gap-2">
                      {e.status !== 'RESOLVED' ? (
                        <>
                          {e.status === 'PENDING' && (
                            <Button size="sm" variant="outline" className="w-full text-[10px] font-black uppercase rounded-xl h-9 border-2 hover:bg-blue-50 hover:text-blue-600" 
                              onClick={() => inProgressMutation.mutate({ id: e.id, notes: 'Followed up with customer.' })}>
                              Acknowledge
                            </Button>
                          )}
                          <Button size="sm" className="w-full text-[10px] font-black uppercase rounded-xl h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" 
                            onClick={() => resolveMutation.mutate({ id: e.id, notes: 'Resolved by Admin.' })}>
                            <Check className="mr-1 h-3.5 w-3.5" /> Close Ticket
                          </Button>
                        </>
                      ) : (
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-end gap-1">
                          <Check className="h-4 w-4" /> All Clear
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {enquiries.length === 0 && (
            <div className="text-center py-32 bg-secondary/20">
              <div className="text-muted-foreground font-black uppercase tracking-widest text-sm">Inbox is empty</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

