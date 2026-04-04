export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'FULL' | 'REFUNDED';

export interface Booking {
  id: number;
  userId?: number;
  userName?: string;
  packageId?: number;
  packageTitle?: string;
  vehicleId?: number;
  vehicleName?: string;
  hotelId?: number;
  hotelName?: string;

  customerName: string;
  customerEmail?: string;
  customerPhone: string;

  startDate: string;
  endDate: string;
  totalAmount: number;
  advancePaid: number;
  balanceAmount: number;
  
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface BookingRequest {
  userId?: number;
  packageId?: number;
  vehicleId?: number;
  hotelId?: number;

  customerName: string;
  customerEmail?: string;
  customerPhone: string;

  startDate: string;
  endDate: string;
  totalAmount: number;
  advancePaid: number;
  
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
}
