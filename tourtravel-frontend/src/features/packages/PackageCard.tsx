import { Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface PackageCardProps {
  pkg: {
    id: number;
    title: string;
    price: number;
    durationDays: number;
    location: string;
    primaryImageUrl: string;
    category: string;
  };
  index?: number;
}

export function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pkg.primaryImageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'}
          alt={pkg.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold bg-background/90 dark:bg-card/90 backdrop-blur rounded-full text-foreground shadow-sm uppercase tracking-wider">
            {pkg.category}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link 
            to={`/packages/${pkg.id}`}
            className="w-full block text-center bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{pkg.location}</span>
        </div>
        
        <h3 className="font-bold text-lg leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
          {pkg.title}
        </h3>
        
        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          <div className="font-semibold text-xl">
            ₹{pkg.price?.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground bg-secondary px-3 py-1.5 rounded-full transition-colors">
            <Clock className="h-4 w-4" />
            {pkg.durationDays} Days
          </div>
        </div>
      </div>
    </motion.div>
  );
}
