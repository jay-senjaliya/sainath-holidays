import { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2, Lock } from 'lucide-react';
import { listCustomers } from '@/services/customerService';
import type { CustomerListItem } from '@/types/customer';

interface CustomerPickerProps {
  value?: number;
  initialLabel?: string; // e.g. "Jane Doe · +91 98765 43210" — avoids a lookup when we already know it
  onChange: (customerId: number, label: string) => void;
  locked?: boolean; // true when opened from a Customer's own detail page — customer isn't changeable
}

// Reuses customerService.listCustomers (the same search this module built for
// AdminCustomers.tsx) instead of a plain <select> — with a real customer base
// a giant unsearchable dropdown stops being usable almost immediately.
export function CustomerPicker({ value, initialLabel, onChange, locked = false }: CustomerPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CustomerListItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(initialLabel ?? '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const page = await listCustomers({ search: query, size: 8, active: true });
        setResults(page.content);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const select = (customer: CustomerListItem) => {
    const label = `${customer.name} · ${customer.phone}`;
    setSelectedLabel(label);
    setIsOpen(false);
    setQuery('');
    onChange(customer.id, label);
  };

  if (locked) {
    return (
      <div className="flex items-center gap-2 bg-secondary/50 border border-border p-2 rounded text-foreground text-sm">
        <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="font-medium">{selectedLabel || `Customer #${value}`}</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      {value && selectedLabel && !isOpen ? (
        <div className="flex items-center justify-between bg-background border border-border p-2 rounded text-foreground text-sm">
          <span className="font-medium">{selectedLabel}</span>
          <button type="button" onClick={() => setIsOpen(true)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-background border border-border p-2 pl-9 rounded text-foreground outline-none focus:ring-1 focus:ring-primary text-sm"
            placeholder="Search customers by name, email, or phone..."
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-xl max-h-56 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-xs text-muted-foreground text-center">
              {query.length < 2 ? 'Type at least 2 characters to search' : 'No customers found'}
            </div>
          ) : (
            results.map((c) => (
              <button
                type="button"
                key={c.id}
                className="w-full text-left px-4 py-2 hover:bg-secondary text-sm border-b border-border last:border-0"
                onClick={() => select(c)}
              >
                <div className="font-medium text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground">
                  {c.phone} {c.email && `· ${c.email}`}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
