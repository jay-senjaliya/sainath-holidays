import { Outlet, Link, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { Palmtree, Plane, Menu, X, Facebook, Instagram, Twitter, Mail, Phone, MapPin, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/shared/ThemeProvider"
import { Moon, Sun } from "lucide-react"

export function MainLayout() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Packages", path: "/packages" },
    { label: "Hotel", path: "/hotels" },
    { label: "Vehicle", path: "/vehicles" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur-md shadow-sm transition-colors">
        <div className="container flex h-20 items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative">
              <Palmtree className="h-8 w-8 text-primary" />
              <Plane className="h-4 w-4 text-primary absolute -top-1 -right-1 rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-foreground tracking-tighter uppercase font-serif">Sainath</span>
              <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase ml-0.5">Holidays</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-8 text-[13px] font-bold uppercase tracking-wider text-foreground/80">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`hover:text-primary transition-colors relative group ${location.pathname === link.path ? 'text-primary' : ''}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </nav>

          <div className="flex gap-4 items-center">
            {/* Desktop Auth */}
            <div className="hidden sm:flex gap-4 items-center">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin/dashboard" className="text-xs font-black text-primary uppercase tracking-widest border-2 border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/5">
                      Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="text-xs font-bold text-slate-500 hover:text-red-500 uppercase tracking-widest">
                    Log Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest">
                  Login
                </Link>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5 text-[#0E2E50]" /> : <Sun className="h-5 w-5 text-yellow-400" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-b overflow-hidden"
            >
              <div className="container py-8 px-6 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className="text-lg font-black text-foreground uppercase tracking-widest flex items-center justify-between group"
                  >
                    {link.label}
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
                <div className="pt-6 border-t flex flex-col gap-4">
                  {isAuthenticated ? (
                    <>
                      {user?.role === 'ADMIN' && (
                        <Link to="/admin/dashboard" className="bg-slate-50 text-center py-4 rounded-2xl font-black text-primary uppercase tracking-widest">
                          Admin Portal
                        </Link>
                      )}
                      <button onClick={logout} className="bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link to="/login" className="bg-primary text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Advanced Unique Footer */}
      <footer className="bg-[#0E2E50] text-white pt-24 relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>

        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10 px-8">
          {/* Brand Info */}
          <div className="space-y-8">
             <Link to="/" className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-white/10 rounded-xl shadow-xl">
                  <Palmtree className="h-8 w-8 text-primary" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-black tracking-tighter uppercase italic">Sainath</span>
                  <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase">Holidays</span>
                </div>
             </Link>
             <p className="text-slate-400 text-sm leading-relaxed font-medium">
               Crafting unforgettable journeys with a focus on luxury, comfort, and authentic experiences. Your dream holiday starts here with India's most trusted travel partner.
             </p>
             <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all group">
                   <Facebook className="h-4 w-4 text-slate-400 group-hover:text-white" />
                </a>
                <a href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all group">
                   <Instagram className="h-4 w-4 text-slate-400 group-hover:text-white" />
                </a>
                <a href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all group">
                   <Twitter className="h-4 w-4 text-slate-400 group-hover:text-white" />
                </a>
             </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', path: '/' },
                { label: 'Tour Packages', path: '/packages' },
                { label: 'Our Hotels', path: '/hotels' },
                { label: 'Vehicle Hire', path: '/vehicles' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-slate-400 hover:text-primary text-sm font-bold transition-colors flex items-center gap-2 group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 h-fit">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Call Center</div>
                    <div className="text-sm font-bold text-slate-200">+91 98765 43210</div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 h-fit">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Support Email</div>
                    <div className="text-sm font-bold text-slate-200">hello@sainathholidays.com</div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 h-fit">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Headquarters</div>
                    <div className="text-sm font-bold text-slate-200 leading-relaxed">Mumbai, Maharashtra, India</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 relative inline-block">
              Newsletter
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">Subscribe for exclusive deals and travel inspiration.</p>
            <div className="space-y-3">
               <input 
                 type="email" 
                 placeholder="Your Email" 
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-primary/50 transition-colors"
               />
               <button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                 Sign Up Now
               </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="container mt-24 border-t border-white/5 py-10 relative z-10 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} Sainath Holidays. Developed with passion in India.
            </div>
            <div className="flex gap-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


