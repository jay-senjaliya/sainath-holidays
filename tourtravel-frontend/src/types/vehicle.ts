// Minimal shape needed for the Quotation form's vehicle dropdown. The public
// VehicleResponse doesn't expose Vehicle.name (a pre-existing gap in that
// module, not touched here) — vehicleType is what's actually available to label with.
export interface VehicleOption {
  id: number;
  vehicleType: string;
  description?: string;
  pricePerDay: number;
  seatingCapacity: number;
}
