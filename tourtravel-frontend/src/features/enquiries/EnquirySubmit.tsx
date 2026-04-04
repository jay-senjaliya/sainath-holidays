import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Loader2, Send, MessageSquare, Package, Hotel, Car, Ticket } from 'lucide-react';

export function EnquirySubmit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const packageId = searchParams.get('packageId');

  const [message, setMessage] = useState('');
  const [serviceType, setServiceType] = useState<'PACKAGE' | 'HOTEL' | 'VEHICLE' | 'TICKET'>('PACKAGE');

  // Fetch package details if packageId is present
  const { data: pkg } = useQuery({
    queryKey: ['packages', packageId],
    queryFn: async () => {
      if (!packageId) return null;
      const res = await api.get(`/packages/${packageId}`);
      return res.data.data;
    },
    enabled: !!packageId
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/enquiries/submit' + (packageId ? `?packageId=${packageId}` : ''));
    }
    if (packageId) {
      setServiceType('PACKAGE');
    }
  }, [isAuthenticated, navigate, packageId]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post('/enquiries', payload);
    },
    onSuccess: () => {
      alert('Enquiry submitted successfully! Our team will contact you soon.');
      navigate('/');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    mutation.mutate({
      packageId: packageId ? Number(packageId) : null,
      serviceType,
      message
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
        <div className="bg-primary p-8 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Plan Your Journey
          </h1>
          <p className="mt-2 text-primary-foreground/80">Tell us what you're looking for, and our experts will craft the perfect experience for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Service Type Selection */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">I am interested in:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setServiceType('PACKAGE')}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${serviceType === 'PACKAGE' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <Package className="h-6 w-6" />
                <span className="text-xs font-bold">Package</span>
              </button>
              <button
                type="button"
                onClick={() => setServiceType('HOTEL')}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${serviceType === 'HOTEL' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <Hotel className="h-6 w-6" />
                <span className="text-xs font-bold">Stays</span>
              </button>
              <button
                type="button"
                onClick={() => setServiceType('VEHICLE')}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${serviceType === 'VEHICLE' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <Car className="h-6 w-6" />
                <span className="text-xs font-bold">Rentals</span>
              </button>
              <button
                type="button"
                onClick={() => setServiceType('TICKET')}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${serviceType === 'TICKET' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <Ticket className="h-6 w-6" />
                <span className="text-xs font-bold">Tickets</span>
              </button>
            </div>
          </div>

          {/* Selected Package Info */}
          {packageId && pkg && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                <img src={pkg.images?.[0]?.imageUrl || 'https://via.placeholder.com/150'} alt={pkg.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Enquiring about:</p>
                <h3 className="font-bold text-slate-900">{pkg.title}</h3>
                <p className="text-xs text-slate-500">{pkg.location} • {pkg.durationDays} Days</p>
              </div>
            </div>
          )}

          {/* Message Area */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Your Message / Requirements</label>
            <textarea
              required
              rows={5}
              placeholder="Example: We are planning a trip for 4 adults and 2 kids. We need pick up from airport and specialized vegetarian meals..."
              className="w-full rounded-2xl border-slate-200 focus:border-primary focus:ring-primary h-40 p-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-6 text-lg font-bold rounded-2xl shadow-lg shadow-primary/30"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Enquiry
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
