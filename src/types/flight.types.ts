export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  terminals?: number;
  isHub?: boolean;
}

export interface Airline {
  code: string;
  name: string;
  logo?: string;
  alliance?: "Star Alliance" | "SkyTeam" | "Oneworld" | "None";
  country?: string;
  isLowCost?: boolean;
}

export interface Flight {
  id: string;

  airline: string;
  airlineCode: string;
  flightNumber: string;
  operatingAirline?: string;
  operatingAirlineCode?: string;

  origin: string;
  destination: string;

  departure: string;
  arrival: string;
  departureDate: string;
  arrivalDate: string;
  duration: string;
  durationMinutes: number;

  price: number;
  currency: string;
  baseFare?: number;
  taxes?: number;
  pricePerPassenger?: number;

  stops: number;
  stopLocations?: string[];
  layoverDurations?: number[];
  aircraft: string;
  aircraftCode?: string;
  availableSeats: number;
  cabinClass: keyof typeof CabinClass;

  baggage?: BaggageInfo;
  amenities?: string[];

  refundable?: boolean;
  changeable?: boolean;
  bookingClass?: string;
  fareBrand?: string;

  departureTerminal?: string;
  arrivalTerminal?: string;

  isCodeshare?: boolean;
  isRedEye?: boolean;
  isInternational?: boolean;
  segments?: FlightSegment[];
  carbonScore?: number;
  co2Emissions?: number;
}

export interface BaggageInfo {
  checkedBags: number;
  carryOn: boolean;
  weight?: string;
  weightKg?: number;
  dimensions?: string;
  additionalBagFee?: number;
  overweightFee?: number;
  specialItems?: string[];
}

export const CabinClass = {
  ECONOMY: "economy",
  PREMIUM_ECONOMY: "premium_economy",
  BUSINESS: "business",
  FIRST: "first",
} as const;

export interface FlightSegment {
  id: string;

  origin: string;
  destination: string;

  departure: string;
  arrival: string;
  departureDate: string;
  arrivalDate: string;
  duration: string;
  durationMinutes?: number;

  airline: string;
  airlineCode: string;
  flightNumber: string;
  aircraft: string;
  operatingAirline?: string;

  terminal?: {
    departure?: string;
    arrival?: string;
  };

  cabinClass?: keyof typeof CabinClass;
  bookingClass?: string;
  availableSeats?: number;

  mealService?: boolean;
  mealType?: string;
  entertainment?: boolean;
  wifi?: boolean;
}

export interface FilterOptions {
  maxPrice: number;
  stops: number[];
  airlines: string[];
  departureTime: TimeSlot[];
  arrivalTime: TimeSlot[];
  duration?: DurationRange;
  refundableOnly?: boolean;
  nonStopOnly?: boolean;
  alliances?: string[];
}

export interface DurationRange {
  min: number;
  max: number;
}

export interface PriceRange {
  min: number;
  max: number;
  avg?: number;
  median?: number;
}

export type TimeSlot = "morning" | "afternoon" | "evening" | "night";

export interface ChartDataPoint {
  stops: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  count: number;
  metadata?: {
    date?: string;
    airline?: string;
    [key: string]: unknown;
  };
}

export interface PriceHistory {
  date: string;
  price: number;
  stops: number;
  airline?: string;
  cabinClass?: keyof typeof CabinClass;
}

export interface FlightComparison {
  flights: Flight[];
  comparison: {
    cheapest: Flight;
    fastest: Flight;
    recommended: Flight;
    metrics?: {
      priceDifference: number;
      timeDifference: number;
      averagePrice: number;
      averageDuration: number;
    };
  };
}

export interface FlightRoute {
  id: string;
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  distanceMiles: number;
  averageDuration: number;
  airlinesCount: number;
  airlines?: string[];
  isPopular?: boolean;
  averagePrice?: number;
}

export interface FlightDeal {
  id: string;
  flight: Flight;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  dealType:
    | "flash_sale"
    | "early_bird"
    | "last_minute"
    | "seasonal"
    | "promotional";
  expiresAt: string;
  seatsAvailable?: number;
  description?: string;
  termsAndConditions?: string;
}

export interface FlightAlert {
  id: string;
  userId: string;
  route: {
    origin: string;
    destination: string;
  };
  targetPrice?: number;
  priceDropAlert: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  isActive: boolean;
  createdAt: string;
  lastNotificationAt?: string;
}

export interface Seat {
  number: string;
  type: "window" | "middle" | "aisle";
  row: number;
  letter: string;
  isExitRow?: boolean;
  isExtraLegroom?: boolean;
  isAvailable: boolean;
  additionalFee?: number;
  features?: string[];
}

export interface Aircraft {
  code: string;
  name: string;
  manufacturer: "Boeing" | "Airbus" | "Embraer" | "Bombardier" | "Other";
  model: string;
  totalSeats?: number;
  seatsByClass?: {
    first?: number;
    business?: number;
    premiumEconomy?: number;
    economy?: number;
  };
  amenities?: string[];
  yearManufactured?: number;
}

export interface FlightStatistics {
  totalFlights: number;
  byAirline: Record<string, number>;
  byStops: Record<number, number>;
  priceStats: {
    min: number;
    max: number;
    avg: number;
    median: number;
  };
  durationStats: {
    min: number;
    max: number;
    avg: number;
  };
  popularAirlines: Array<{ airline: string; count: number }>;
  bestTimeToFly?: TimeSlot;
}

export function isFlight(obj): obj is Flight {
  return (
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.airline === "string" &&
    typeof obj.price === "number"
  );
}

export function isFlightSegment(obj): obj is FlightSegment {
  return (
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.origin === "string" &&
    typeof obj.destination === "string"
  );
}
