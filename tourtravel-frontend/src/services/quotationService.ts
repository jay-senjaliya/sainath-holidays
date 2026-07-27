import { api } from '@/services/api';
import type { ApiResponse, Page } from '@/types/common';
import type {
  ApprovalStatus,
  QuotationDetail,
  QuotationListItem,
  QuotationListParams,
  QuotationRequest,
  QuotationStatus,
  WhatsAppLinkResult,
} from '@/types/quotation';

export async function listQuotations(params: QuotationListParams): Promise<Page<QuotationListItem>> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.customerId !== undefined) query.set('customerId', String(params.customerId));
  if (params.packageId !== undefined) query.set('packageId', String(params.packageId));
  if (params.active !== undefined) query.set('active', String(params.active));
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 20));
  query.set('sortBy', params.sortBy ?? 'createdAt');
  query.set('direction', params.direction ?? 'desc');

  const res = await api.get<ApiResponse<Page<QuotationListItem>>>(`/admin/quotations?${query.toString()}`);
  return res.data.data;
}

export async function getQuotation(id: number): Promise<QuotationDetail> {
  const res = await api.get<ApiResponse<QuotationDetail>>(`/admin/quotations/${id}`);
  return res.data.data;
}

export async function createQuotation(payload: QuotationRequest): Promise<QuotationDetail> {
  const res = await api.post<ApiResponse<QuotationDetail>>('/admin/quotations', payload);
  return res.data.data;
}

export async function updateQuotation(id: number, payload: QuotationRequest): Promise<QuotationDetail> {
  const res = await api.put<ApiResponse<QuotationDetail>>(`/admin/quotations/${id}`, payload);
  return res.data.data;
}

export async function updateQuotationStatus(id: number, status: QuotationStatus): Promise<QuotationDetail> {
  const res = await api.patch<ApiResponse<QuotationDetail>>(`/admin/quotations/${id}/status`, { status });
  return res.data.data;
}

export async function deactivateQuotation(id: number): Promise<void> {
  await api.delete(`/admin/quotations/${id}`);
}

export async function downloadQuotationPdf(id: number, quotationNumber: string): Promise<void> {
  const res = await api.get(`/admin/quotations/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${quotationNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function sendQuotationEmail(id: number): Promise<void> {
  await api.post(`/admin/quotations/${id}/send-email`);
}

export async function getQuotationWhatsAppLink(id: number): Promise<WhatsAppLinkResult> {
  const res = await api.post<ApiResponse<WhatsAppLinkResult>>(`/admin/quotations/${id}/whatsapp-link`);
  return res.data.data;
}

export async function updateQuotationApproval(id: number, approvalStatus: ApprovalStatus): Promise<QuotationDetail> {
  const res = await api.patch<ApiResponse<QuotationDetail>>(`/admin/quotations/${id}/approval`, { approvalStatus });
  return res.data.data;
}
