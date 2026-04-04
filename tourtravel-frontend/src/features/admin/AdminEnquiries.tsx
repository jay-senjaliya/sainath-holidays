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

  if (isLoading) return <div className="flex h-96 items-center justify-center flex-col gap-4 text-slate-400 font-medium italic"><Loader2 className="animate-spin h-10 w-10 text-primary" /> Loading enquiries...</div>;
  if (isError) return <div className="p-12 text-center text-red-500 font-bold border-2 border-red-100 rounded-3xl bg-red-50">Failed to load enquiries. Please check if the backend is running.</div>;

  const enquiries = response?.data?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Public Enquiries</h1>
        <div className="text-xs font-bold text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          Incoming Leads: {enquiries.length}
        </div>
      </div>

      <div className="border rounded-[2rem] bg-white overflow-hidden shadow-xl border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-[0.15em] text-[10px] border-b">
              <tr>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Customer Profile</th>
                <th className="px-8 py-5">Package / Service</th>
                <th className="px-8 py-5 w-1/3">Detailed Inquiry</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {enquiries.map((e: any) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6">
                     <div className="font-bold text-slate-900">{new Date(e.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</div>
                     <div className="text-[10px] text-slate-400 font-medium">{new Date(e.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800">{e.user?.name || 'Guest User'}</div>
                    <div className="text-xs text-slate-500 font-medium lowercase">{e.user?.email}</div>
                    <div className="text-xs text-slate-400">{e.user?.phone}</div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-[9px] tracking-wider uppercase">
                       {e.serviceType}
                     </span>
                     {e.packageTitle && <div className="mt-2 font-bold text-primary text-xs truncate max-w-[150px]">{e.packageTitle}</div>}
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-slate-600 leading-relaxed text-xs line-clamp-3 italic">"{e.message}"</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase
                      ${e.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : ''}
                      ${e.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' : ''}
                      ${e.status === 'RESOLVED' ? 'bg-green-100 text-green-600 font-black' : ''}
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
                          <Button size="sm" className="w-full text-[10px] font-black uppercase rounded-xl h-9 bg-slate-900 hover:bg-green-600 shadow-lg shadow-slate-200" 
                            onClick={() => resolveMutation.mutate({ id: e.id, notes: 'Resolved by Admin.' })}>
                            <Check className="mr-1 h-3.5 w-3.5" /> Close Ticket
                          </Button>
                        </>
                      ) : (
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-end gap-1">
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
            <div className="text-center py-32 bg-slate-50/30">
              <div className="text-slate-300 font-black uppercase tracking-widest text-sm">Inbox is empty</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

