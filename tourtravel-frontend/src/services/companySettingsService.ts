import { api } from '@/services/api';
import type { ApiResponse } from '@/types/common';
import type { CompanySettings, CompanySettingsRequest } from '@/types/companySettings';

export async function getCompanySettings(): Promise<CompanySettings> {
  const res = await api.get<ApiResponse<CompanySettings>>('/admin/settings/company');
  return res.data.data;
}

export async function updateCompanySettings(payload: CompanySettingsRequest): Promise<CompanySettings> {
  const res = await api.put<ApiResponse<CompanySettings>>('/admin/settings/company', payload);
  return res.data.data;
}
