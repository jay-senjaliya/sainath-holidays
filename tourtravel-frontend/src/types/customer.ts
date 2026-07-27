export type CustomerSource =
  | 'WALK_IN'
  | 'PHONE_CALL'
  | 'WEBSITE'
  | 'REFERRAL'
  | 'SOCIAL_MEDIA'
  | 'WHATSAPP'
  | 'OTHER';

export const CUSTOMER_SOURCES: CustomerSource[] = [
  'WALK_IN',
  'PHONE_CALL',
  'WEBSITE',
  'REFERRAL',
  'SOCIAL_MEDIA',
  'WHATSAPP',
  'OTHER',
];

export interface CustomerListItem {
  id: number;
  name: string;
  email?: string;
  phone: string;
  city?: string;
  source: CustomerSource;
  active: boolean;
  createdAt: string;
}

export interface CustomerDetail {
  id: number;
  name: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  state?: string;
  country?: string;
  source: CustomerSource;
  active: boolean;
  linkedUserId?: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRequest {
  name: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  state?: string;
  country?: string;
  source: CustomerSource;
  linkedUserId?: number;
  active?: boolean;
}

export interface TimelineEvent {
  id: number;
  eventType: string;
  description: string;
  performedByName?: string;
  createdAt: string;
}

export interface CustomerListParams {
  search?: string;
  source?: CustomerSource;
  city?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}
