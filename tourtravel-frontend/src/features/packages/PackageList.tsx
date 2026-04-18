import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { PackageCard } from '@/features/packages/PackageCard';
import { Search, Filter, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PackageList() {
  const [page, setPage] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['packages', 'list', page, filterCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '9',
        sortBy: 'createdAt',
        direction: 'desc'
      });
      if (filterCategory) {
        params.append('category', filterCategory);
      }
      const res = await api.get(`/packages?${params.toString()}`);
      return res.data.data;
    },
    // Keep previous data while fetching new pages
    staleTime: 60000,
  });

  const categories = ['DOMESTIC', 'INTERNATIONAL', 'ADVENTURE', 'HONEYMOON', 'WILDLIFE', 'CULTURAL'];

  return (
    <div className="bg-background min-h-screen pb-24 text-foreground transition-colors duration-300">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Tour Packages</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Browse through our extensive collection of curated travel experiences.
          </p>
        </div>
      </div>

      <div className="container mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden w-full flex items-center justify-center gap-2 bg-card border border-border p-3 rounded-lg font-medium shadow-sm transition-colors"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-5 w-5" /> Filters
        </button>

        {/* Sidebar Filters */}
        <AnimatePresence>
          {(isFilterOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
            <motion.aside 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full md:w-64 flex-shrink-0 bg-card border border-border rounded-2xl p-6 h-fit md:sticky top-24 overflow-hidden shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" /> Filters
                </h2>
                {isFilterOpen && (
                  <button className="md:hidden tracking-wider" onClick={() => setIsFilterOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">Category</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => { setFilterCategory(''); setPage(0); }}
                    className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${filterCategory === '' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => { setFilterCategory(cat); setPage(0); }}
                      className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${filterCategory === cat ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                    >
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Package Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {data?.content?.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center h-[400px] shadow-sm">
                  <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No packages found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
                  <button 
                    onClick={() => setFilterCategory('')}
                    className="mt-6 text-primary hover:underline font-medium"
                  >
                     Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.content?.map((pkg: any, index: number) => (
                    <PackageCard key={pkg.id} pkg={pkg} index={index} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data?.totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button 
                    disabled={data.first}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border border-border bg-card text-foreground rounded-md disabled:opacity-50 hover:bg-secondary font-medium text-sm transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center px-4 font-medium text-sm text-slate-600">
                    Page {data.number + 1} of {data.totalPages}
                  </div>
                  <button 
                    disabled={data.last}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 border bg-white rounded-md disabled:opacity-50 hover:bg-slate-50 font-medium text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
