import { api } from '@/services/api';
import type { Page } from '@/types/common';
import type { VehicleOption } from '@/types/vehicle';

// Reuses the existing public /vehicles endpoint, same pattern as packageService.ts.
export async function listVehiclesForDropdown(): Promise<VehicleOption[]> {
  const res = await api.get<{ data: Page<VehicleOption> }>('/vehicles?size=100&availableOnly=false');
  return res.data.data.content;
}
