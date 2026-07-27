import { api } from '@/services/api';
import type { ApiResponse, Page } from '@/types/common';
import type { LeadDetail, LeadListItem, LeadListParams, LeadPipeline, LeadRequest, LeadStatus } from '@/types/lead';

export async function listLeads(params: LeadListParams): Promise<Page<LeadListItem>> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.source) query.set('source', params.source);
  if (params.customerId !== undefined) query.set('customerId', String(params.customerId));
  if (params.assignedToId !== undefined) query.set('assignedToId', String(params.assignedToId));
  if (params.active !== undefined) query.set('active', String(params.active));
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 20));
  query.set('sortBy', params.sortBy ?? 'createdAt');
  query.set('direction', params.direction ?? 'desc');

  const res = await api.get<ApiResponse<Page<LeadListItem>>>(`/admin/leads?${query.toString()}`);
  return res.data.data;
}

export async function getLeadPipeline(): Promise<LeadPipeline> {
  const res = await api.get<ApiResponse<LeadPipeline>>('/admin/leads/pipeline');
  return res.data.data;
}

export async function getLead(id: number): Promise<LeadDetail> {
  const res = await api.get<ApiResponse<LeadDetail>>(`/admin/leads/${id}`);
  return res.data.data;
}

export async function createLead(payload: LeadRequest): Promise<LeadDetail> {
  const res = await api.post<ApiResponse<LeadDetail>>('/admin/leads', payload);
  return res.data.data;
}

export async function updateLead(id: number, payload: LeadRequest): Promise<LeadDetail> {
  const res = await api.put<ApiResponse<LeadDetail>>(`/admin/leads/${id}`, payload);
  return res.data.data;
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<LeadDetail> {
  const res = await api.patch<ApiResponse<LeadDetail>>(`/admin/leads/${id}/status`, { status });
  return res.data.data;
}

export async function assignLead(id: number, assignedToId: number | null): Promise<LeadDetail> {
  const res = await api.patch<ApiResponse<LeadDetail>>(`/admin/leads/${id}/assign`, { assignedToId });
  return res.data.data;
}

export async function deactivateLead(id: number): Promise<void> {
  await api.delete(`/admin/leads/${id}`);
}
