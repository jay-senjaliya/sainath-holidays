import { api } from '@/services/api';
import type { ApiResponse, Page } from '@/types/common';
import type {
  CustomerDetail,
  CustomerListItem,
  CustomerListParams,
  CustomerRequest,
  TimelineEvent,
} from '@/types/customer';

// Thin typed wrapper around the Customer admin endpoints. Extracted as its own
// service (unlike the other admin screens' inline api.get calls) because this
// module's query-param building (search + filter + sort + pagination) is reused
// across the list view and will be reused again by every future CRM list.

export async function listCustomers(params: CustomerListParams): Promise<Page<CustomerListItem>> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.source) query.set('source', params.source);
  if (params.city) query.set('city', params.city);
  if (params.active !== undefined) query.set('active', String(params.active));
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 20));
  query.set('sortBy', params.sortBy ?? 'createdAt');
  query.set('direction', params.direction ?? 'desc');

  const res = await api.get<ApiResponse<Page<CustomerListItem>>>(`/admin/customers?${query.toString()}`);
  return res.data.data;
}

export async function getCustomer(id: number): Promise<CustomerDetail> {
  const res = await api.get<ApiResponse<CustomerDetail>>(`/admin/customers/${id}`);
  return res.data.data;
}

export async function createCustomer(payload: CustomerRequest): Promise<CustomerDetail> {
  const res = await api.post<ApiResponse<CustomerDetail>>('/admin/customers', payload);
  return res.data.data;
}

export async function updateCustomer(id: number, payload: CustomerRequest): Promise<CustomerDetail> {
  const res = await api.put<ApiResponse<CustomerDetail>>(`/admin/customers/${id}`, payload);
  return res.data.data;
}

export async function deactivateCustomer(id: number): Promise<void> {
  await api.delete(`/admin/customers/${id}`);
}

export async function getCustomerTimeline(id: number, page = 0, size = 20): Promise<Page<TimelineEvent>> {
  const res = await api.get<ApiResponse<Page<TimelineEvent>>>(
    `/admin/customers/${id}/timeline?page=${page}&size=${size}`
  );
  return res.data.data;
}
