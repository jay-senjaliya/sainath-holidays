import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number; // 0-based current page
  totalPages: number;
  onPageChange: (page: number) => void;
}

// First reusable pagination control in the admin panel — every future paginated
// module (Leads, Quotations, ...) should use this instead of hand-rolling controls
// like the public PackageList page currently does.
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
      </Button>
      <div className="px-4 text-sm font-medium text-muted-foreground">
        Page {page + 1} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
