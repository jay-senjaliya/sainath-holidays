import { api } from '@/services/api';
import type { Page } from '@/types/common';
import type { HotelOption } from '@/types/hotel';

// Reuses the existing public /hotels endpoint, same pattern as packageService.ts.
export async function listHotelsForDropdown(): Promise<HotelOption[]> {
  const res = await api.get<{ data: Page<HotelOption> }>('/hotels?size=100');
  return res.data.data.content;
}
