import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Contact() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Header */}
      <section className="bg-white py-24 border-b border-slate-100 relative overflow-hidden">
        <div className="container relative z-10 text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-[#0E2E50] tracking-tighter italic"
          >
            LET'S <span className="text-primary italic">CONNECT</span>
          </motion.h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">
            Your next adventure is a click away.
          </p>
        </div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      </section>

      <section className="py-24 bg-[#F8FAFC]">
        <div className="container grid lg:grid-cols-5 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0E2E50] text-white p-12 rounded-[3rem] shadow-2xl space-y-12 relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <h2 className="text-3xl font-black italic tracking-tighter">Contact Information</h2>
                <p className="text-slate-400 text-sm">Have questions? We're here to help you plan the perfect trip.</p>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex gap-6 items-start group">
                   <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Phone className="h-5 w-5 text-primary group-hover:text-white" />
                   </div>
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Call Us</div>
                      <div className="text-lg font-bold">+91 98765 43210</div>
                   </div>
                </div>

                <div className="flex gap-6 items-start group">
                   <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Mail className="h-5 w-5 text-primary group-hover:text-white" />
                   </div>
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Email Us</div>
                      <div className="text-lg font-bold">hello@sainathholidays.com</div>
                   </div>
                </div>

                <div className="flex gap-6 items-start group">
                   <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <MapPin className="h-5 w-5 text-primary group-hover:text-white" />
                   </div>
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Visit Us</div>
                      <div className="text-lg font-bold leading-tight">123 Travel Plaza, <br />Mumbai, Maharashtra 400001</div>
                   </div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
            </div>

            <div className="flex gap-4">
               {['FB', 'IG', 'TW', 'LI'].map((s) => (
                 <div key={s} className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer shadow-sm">{s}</div>
               ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-50">
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700" />
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                  <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700 appearance-none">
                    <option>General Inquiry</option>
                    <option>Booking Problem</option>
                    <option>Partnership</option>
                    <option>Feedback</option>
                  </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                <textarea rows={6} placeholder="Tell us how we can help..." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-700 resize-none"></textarea>
              </div>

              <Button className="w-full py-8 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 transition-all hover:-translate-y-1">
                <Send className="mr-2 h-5 w-5" /> Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
