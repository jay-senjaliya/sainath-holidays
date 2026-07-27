export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export const QUOTATION_STATUSES: QuotationStatus[] = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'];

export type ApprovalStatus = 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type QuotationItemType = 'PACKAGE' | 'HOTEL' | 'VEHICLE' | 'ACTIVITY';

export const QUOTATION_ITEM_TYPES: QuotationItemType[] = ['PACKAGE', 'HOTEL', 'VEHICLE', 'ACTIVITY'];

export interface QuotationItem {
  id: number;
  itemType: QuotationItemType;
  referenceId?: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

// referenceId required for PACKAGE/HOTEL/VEHICLE (validated against the catalog
// server-side); itemName only used for ACTIVITY, which has no catalog to name it from.
export interface QuotationItemRequest {
  itemType: QuotationItemType;
  referenceId?: number;
  itemName?: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface QuotationListItem {
  id: number;
  quotationNumber: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  packageId?: number;
  packageTitle?: string;
  travelDate: string;
  finalAmount: number;
  status: QuotationStatus;
  validUntil: string;
  active: boolean;
  createdAt: string;
  itemCount: number;
  approvalStatus: ApprovalStatus;
}

export interface QuotationDetail extends QuotationListItem {
  customerEmail?: string;
  numberOfAdults: number;
  numberOfChildren: number;
  totalAmount: number;
  discount: number;
  notes?: string;
  termsAndConditions?: string;
  createdByName?: string;
  updatedAt: string;
  /** True when totalAmount/finalAmount were computed by the pricing engine
   *  from items, rather than manually entered (Phase 1 legacy mode). */
  computedPricing: boolean;
  approvedByName?: string;
  approvedAt?: string;
  items: QuotationItem[];
}

export interface QuotationRequest {
  customerId: number;
  packageId?: number;
  travelDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  /** Required only when items is empty — ignored by the pricing engine otherwise. */
  totalAmount?: number;
  discount: number;
  /** Required only when items is empty — ignored by the pricing engine otherwise. */
  finalAmount?: number;
  notes?: string;
  validUntil: string;
  /** Optional — overrides CompanySettings.defaultTermsAndConditions on the PDF when set. */
  termsAndConditions?: string;
  active?: boolean;
  items: QuotationItemRequest[];
}

export interface WhatsAppLinkResult {
  waLink: string;
  shareUrl: string;
}

export interface QuotationListParams {
  search?: string;
  status?: QuotationStatus;
  customerId?: number;
  packageId?: number;
  active?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}
