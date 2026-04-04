import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MapPin, Clock, Info, CheckCircle2, Navigation, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  
  const { data: pkg, isLoading } = useQuery({
    queryKey: ['packages', id],
    queryFn: async () => {
      const res = await api.get(`/packages/${id}`);
      return res.data.data;
    },
  });

  const [activeImage, setActiveImage] = useState(0);
  const [activeDay, setActiveDay] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-4">
        <div className="container max-w-6xl animate-pulse">
          <div className="h-8 bg-slate-200 w-1/3 rounded-lg mb-6"></div>
          <div className="h-[60vh] bg-slate-200 w-full rounded-2xl mb-8"></div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return <div className="p-20 text-center font-bold text-2xl text-red-500">Package not found</div>;
  }

  const primaryImage = pkg.images?.find((img: any) => img.primary) || pkg.images?.[0];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* Main Image Banner */}
      <div className="relative h-[60vh] min-h-[500px] w-full bg-slate-900">
        <img 
          src={pkg.images?.[activeImage]?.imageUrl || primaryImage?.imageUrl || 'https://via.placeholder.com/1200'}
          alt={pkg.title}
          className="w-full h-full object-cover opacity-80 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 inset-x-0 container text-white pb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              {pkg.category}
            </span>
            <span className="flex items-center text-sm font-medium text-slate-300">
              <MapPin className="h-4 w-4 mr-1" />
              {pkg.location}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl leading-tight">
            {pkg.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
              <Clock className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Duration</p>
                <p className="font-bold text-lg">{pkg.durationDays} Days</p>
              </div>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
              <Info className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Price starts from</p>
                <p className="font-bold text-lg">₹{pkg.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-8">
        {/* Thumbnail gallery */}
        {pkg.images && pkg.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8 snap-x">
            {pkg.images.map((img: any, idx: number) => (
              <button 
                key={img.id}
                onClick={() => setActiveImage(idx)}
                className={`snap-start relative h-24 w-40 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img.imageUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1">
            <section className="bg-white p-8 border rounded-2xl shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Navigation className="h-6 w-6 text-primary" />
                Overview
              </h2>
              <div className="prose max-w-none text-slate-600 leading-relaxed font-medium">
                {pkg.description?.split(/\r?\n/).map((para: string, i: number) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            {pkg.itineraries && pkg.itineraries.length > 0 && (
              <section className="bg-white p-8 border rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" /> 
                  Itinerary
                </h2>
                <div className="space-y-4">
                  {pkg.itineraries.map((day: any) => (
                    <motion.div 
                      key={day.id} 
                      className="border rounded-xl overflow-hidden"
                      initial={false}
                    >
                      <button
                        onClick={() => setActiveDay(activeDay === day.dayNumber ? 0 : day.dayNumber)}
                        className={`w-full text-left px-6 py-4 flex items-center justify-between transition-colors ${activeDay === day.dayNumber ? 'bg-primary/5' : 'bg-white hover:bg-slate-50'}`}
                      >
                        <span className="font-bold text-lg">Day {day.dayNumber}: <span className="text-slate-600 font-medium ml-2">{day.title}</span></span>
                        <div className={`transform transition-transform ${activeDay === day.dayNumber ? 'rotate-180' : ''}`}>▼</div>
                      </button>
                      
                      <AnimatePresence>
                        {activeDay === day.dayNumber && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-2 text-slate-600 border-t">
                              <p className="leading-relaxed whitespace-pre-wrap">{day.description}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar Booking/Enquiry */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-24 bg-slate-900 text-white rounded-3xl shadow-xl p-8 border border-white/10">
              <div className="mb-8">
                <span className="text-slate-400 font-medium uppercase tracking-wider text-xs">Price from</span>
                <div className="text-5xl font-bold mt-1">₹{pkg.price.toLocaleString()}</div>
                <div className="text-sm text-slate-400 mt-2">per person • inclusive of all taxes</div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate(`/enquiries/submit?packageId=${id}`)}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="h-5 w-5" /> Send Enquiry
                </button>
                
                <Link 
                  to={`/enquiries/submit?packageId=${id}`}
                  className="w-full block text-center py-3 text-slate-400 font-medium hover:text-white transition-colors"
                >
                  Ask a question
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Best price guarantee</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">No hidden booking fees</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Secure payments</span>
                </div>
              </div>

              {/* In a real app, this would open the Enquiry Modal */}
              <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 mb-4 flex items-center justify-center gap-2">
                <MessageSquare className="h-5 w-5" /> Send Enquiry
              </button>
              
              <Link to="/enquiries/submit" className="w-full block text-center py-2 text-primary font-medium hover:underline">
                Ask a question
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
