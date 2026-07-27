// Minimal shape needed for the Quotation form's package dropdown — not a full
// mirror of the backend's PackageListResponse/PackageDetailResponse.
export interface PackageOption {
  id: number;
  title: string;
  durationDays: number;
  price: number;
}
