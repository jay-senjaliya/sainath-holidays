// Minimal shape needed for the Quotation form's hotel dropdown.
export interface HotelOption {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
  starRating?: number;
}
