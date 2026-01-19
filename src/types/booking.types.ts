import type { Flight } from "./flight.types";

export interface BookingRequest {
  flightId: string;
  passengers: Passenger[];
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo;
  preferences?: BookingPreferences;
}

export interface Passenger {
  id: string;
  type: "adult" | "child" | "infant";
  title: "Mr" | "Mrs" | "Ms" | "Dr";
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "M" | "F" | "U";
  nationality: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  frequentFlyerNumber?: string;
  seatPreference?: "window" | "aisle" | "middle";
  mealPreference?: string;
  specialRequests?: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  countryCode: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  method: "credit_card" | "debit_card" | "paypal" | "bank_transfer";
  cardNumber?: string;
  cardHolder?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  billingAddress?: Address;
}

export interface BookingPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  seatSelection: boolean;
  insurance: boolean;
  priorityBoarding: boolean;
  extraBaggage: number;
}

export interface Booking {
  id: string;
  confirmationCode: string;
  status: BookingStatus;
  flight: Flight;
  passengers: Passenger[];
  contactInfo: ContactInfo;
  totalPrice: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: PaymentStatus;
  tickets?: Ticket[];
}

export const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export const PaymentStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface Ticket {
  id: string;
  ticketNumber: string;
  passengerId: string;
  seatNumber?: string;
  boardingPass?: string;
  qrCode?: string;
}
