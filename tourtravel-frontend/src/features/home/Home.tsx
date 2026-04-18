import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { PackageMap } from '@/components/shared/PackageMap';
import { PackageCard } from '@/features/packages/PackageCard';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Link } from 'react-router-dom';

export function Home() {
  // Fetch featured packages
  const { data: featured } = useQuery({
    queryKey: ['packages', 'featured'],
    queryFn: async () => {
      const res = await api.get('/packages?size=6&sortBy=createdAt&direction=desc');
      return res.data.data.content;
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sainath Holidays Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
        <div className="container grid lg:grid-cols-2 gap-12 items-center relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 max-w-xl"
          >
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black text-foreground leading-[1.1] tracking-tighter">
                Find A <span className="text-primary italic">Perfect</span> Travel Option
              </h1>
              <h2 className="text-4xl md:text-5xl font-black text-foreground/90 leading-tight">
                To Spend With Your <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">Friends & Family</span>
              </h2>
            </div>
            
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              Experience the world with Sainath Holidays. We coordinate every detail, from premium accommodation to seamless transport, so you can focus on making memories.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest">
                Get Started
              </button>
              <div className="flex items-center gap-4 bg-secondary/50 dark:bg-white/5 px-6 py-4 rounded-xl border border-border group cursor-pointer hover:bg-secondary/80 dark:hover:bg-white/10 transition-colors">
                 <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Search className="h-5 w-5 text-primary" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Quick Discovery</span>
                   <span className="text-sm font-black text-foreground">Search Destinations</span>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Image Grid / Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[600px] lg:h-[750px] hidden lg:block"
          >
            <div className="absolute inset-0 grid grid-cols-2 gap-4">
               <div className="space-y-4 pt-12">
                  <div className="h-2/3 rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800" className="w-full h-full object-cover" alt="Tropical" />
                  </div>
                  <div className="h-1/3 rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800" className="w-full h-full object-cover" alt="Hotel" />
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="h-1/3 rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800" className="w-full h-full object-cover" alt="Nature" />
                  </div>
                  <div className="h-2/3 rounded-[3rem] overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800" className="w-full h-full object-cover" alt="Venice" />
                  </div>
               </div>
            </div>
            
            {/* Absolute Decorative Elements */}
            <div className="absolute -bottom-10 -left-10 bg-background dark:bg-card p-6 rounded-[2rem] shadow-2xl border border-border flex items-center gap-4 animate-bounce">
               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">10k+</div>
               <div>
                 <div className="text-xs font-black text-foreground">Happy Travelers</div>
                 <div className="text-[10px] text-muted-foreground font-bold">In last 12 months</div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/30 dark:bg-white/5 -skew-x-12 translate-x-1/2 z-0"></div>
      </section>


      {/* Featured Packages */}
      <section className="py-24 bg-secondary/20 dark:bg-background/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Destinations</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hand-picked tours curated just for you. Explore our most popular itineraries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured?.map((pkg: any, index: number) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-24 bg-background relative">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Explore the Map</h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Visualize your journey. Click on the map markers to preview the packages and see what awaits you.
              </p>
            </div>
          </div>
          <PackageMap />
        </div>
      </section>

      {/* Dynamic Unique CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2042" 
            alt="Adventure" 
            className="w-full h-full object-cover scale-110 blur-sm brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0E2E50] via-transparent to-primary/20" />
        </div>

        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] p-12 md:p-24 text-center space-y-10 shadow-2xl"
          >
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-primary font-black uppercase tracking-[0.4em] text-xs"
              >
                Start Your Journey
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-tight">
                Ready to plan your <span className="text-primary">dream</span> getaway?
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">
                Join over 50,000+ travelers who have discovered the world with Sainath Holidays. Get a personalized itinerary in minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest w-full">
                  Get a Free Quote
                </button>
              </Link>
              <Link to="/contact" className="text-white font-black uppercase tracking-widest text-sm hover:text-primary transition-colors flex items-center gap-2 group">
                Speak to an Expert
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-12 border-t border-white/10 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
               <div className="text-white font-black text-xl italic uppercase tracking-tighter">Verified</div>
               <div className="text-white font-black text-xl italic uppercase tracking-tighter">Secure Pay</div>
               <div className="text-white font-black text-xl italic uppercase tracking-tighter">24/7 Support</div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      </section>
    </div>
  );
}
