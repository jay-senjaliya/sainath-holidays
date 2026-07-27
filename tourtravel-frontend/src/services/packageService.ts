import { api } from '@/services/api';
import type { Page } from '@/types/common';
import type { PackageOption } from '@/types/package';

// Reuses the existing public /packages endpoint — the same call AdminPackages.tsx
// already makes for its own table — rather than adding a new listing endpoint.
export async function listPackagesForDropdown(): Promise<PackageOption[]> {
  const res = await api.get<{ data: Page<PackageOption> }>('/packages?size=100');
  return res.data.data.content;
}
