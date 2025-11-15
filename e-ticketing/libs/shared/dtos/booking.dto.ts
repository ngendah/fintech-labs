import { UserId } from './user.dto';

export interface BookingDto {
  eventId: string;
  seats: string[];
}

export interface UserBookingDto extends UserId, BookingDto {}

export interface BookingId {
  bookingNo: string;
  invoiceNo: string;
}

export interface BookingDetailsDto extends BookingId, BookingDto {}
