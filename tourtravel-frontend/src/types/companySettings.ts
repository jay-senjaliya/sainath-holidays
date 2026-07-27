export interface CompanySettings {
  id: number;
  companyName: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
  website?: string;
  defaultTermsAndConditions?: string;
  approvalDiscountThreshold?: number;
  updatedAt: string;
}

export interface CompanySettingsRequest {
  companyName: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
  website?: string;
  defaultTermsAndConditions?: string;
  approvalDiscountThreshold?: number;
}
