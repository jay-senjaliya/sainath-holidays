import { motion } from 'framer-motion';
import { Award, Users, ShieldCheck, Heart } from 'lucide-react';

export function AboutUs() {
  const stats = [
    { label: 'Years Experience', value: '15+', icon: Award },
    { label: 'Happy Clients', value: '50k+', icon: Users },
    { label: 'Destinations', value: '200+', icon: ShieldCheck },
    { label: 'Team Members', value: '50+', icon: Heart },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-[#0E2E50] text-white py-24 relative overflow-hidden">
        <div className="container relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6"
          >
            OUR <span className="text-primary tracking-normal">STORY</span>
          </motion.h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium uppercase tracking-[0.2em]">
            Crafting memories since 2009.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="container grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-black text-[#0E2E50] tracking-tighter italic">Who We Are</h2>
            <div className="w-20 h-1.5 bg-primary rounded-full"></div>
            <p className="text-slate-600 leading-relaxed text-lg">
              Sainath Holidays is more than just a travel agency; we are your dedicated partners in exploration. Based on the philosophy of "Atithi Devo Bhava" (The Guest is God), we've spent over a decade perfecting the art of travel.
            </p>
            <p className="text-slate-600 leading-relaxed">
              From the snow-capped peaks of the Himalayas to the sun-drenched beaches of the Maldives, we provide end-to-end travel solutions that combine luxury with local authenticity. Our team of 50+ travel enthusiasts works tirelessly to ensure your journey is seamless, safe, and soulful.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center space-y-3"
                >
                  <div className="inline-flex p-3 bg-white rounded-xl shadow-sm"><Icon className="h-6 w-6 text-primary" /></div>
                  <div className="text-3xl font-black text-[#0E2E50]">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container text-center space-y-16">
          <h2 className="text-4xl font-black italic tracking-tighter">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4 p-8 border border-white/5 rounded-[2.5rem] bg-white/5 hover:bg-white/10 transition-colors">
              <div className="text-3xl font-black text-primary italic">01.</div>
              <h3 className="text-xl font-bold uppercase tracking-widest">Integrity</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Transparent pricing and honest advice. We believe in building trust through every mile we travel together.</p>
            </div>
            <div className="space-y-4 p-8 border border-white/5 rounded-[2.5rem] bg-white/10 transition-colors">
              <div className="text-3xl font-black text-primary italic">02.</div>
              <h3 className="text-xl font-bold uppercase tracking-widest">Passion</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We don't just sell tours; we share our love for discovery. Every itinerary is crafted as if it were our own.</p>
            </div>
            <div className="space-y-4 p-8 border border-white/5 rounded-[2.5rem] bg-white/5 hover:bg-white/10 transition-colors">
              <div className="text-3xl font-black text-primary italic">03.</div>
              <h3 className="text-xl font-bold uppercase tracking-widest">Innovation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Constantly seeking new destinations and unique experiences to stay ahead of the curve in travel trends.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
