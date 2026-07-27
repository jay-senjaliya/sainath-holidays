import type { CustomerSource } from '@/types/customer';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'QUOTED' | 'WON' | 'LOST';

export const LEAD_STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'QUOTED', 'WON', 'LOST'];

export interface LeadListItem {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  source: CustomerSource;
  status: LeadStatus;
  requirement: string;
  assignedToId?: number;
  assignedToName?: string;
  active: boolean;
  createdAt: string;
}

export interface LeadDetail extends LeadListItem {
  customerEmail?: string;
  createdByName?: string;
  updatedAt: string;
}

export interface LeadRequest {
  customerId: number;
  source: CustomerSource;
  requirement: string;
  assignedToId?: number;
  active?: boolean;
}

export interface LeadListParams {
  search?: string;
  status?: LeadStatus;
  source?: CustomerSource;
  customerId?: number;
  assignedToId?: number;
  active?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export type LeadPipeline = Record<LeadStatus, LeadListItem[]>;
