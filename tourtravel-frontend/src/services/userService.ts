import { api } from '@/services/api';
import type { ApiResponse } from '@/types/common';
import type { StaffMember } from '@/types/staff';

export async function listAssignableStaff(): Promise<StaffMember[]> {
  const res = await api.get<ApiResponse<StaffMember[]>>('/admin/users/assignable');
  return res.data.data;
}
