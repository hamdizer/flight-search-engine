import type { Airport, CabinClass } from "../types/flight.types";

export const AIRPORTS: Airport[] = [
  {
    code: "JFK",
    name: "John F. Kennedy International",
    city: "New York",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    code: "LAX",
    name: "Los Angeles International",
    city: "Los Angeles",
    country: "USA",
    timezone: "America/Los_Angeles",
  },
  {
    code: "ORD",
    name: "O'Hare International",
    city: "Chicago",
    country: "USA",
    timezone: "America/Chicago",
  },
  {
    code: "MIA",
    name: "Miami International",
    city: "Miami",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    code: "SFO",
    name: "San Francisco International",
    city: "San Francisco",
    country: "USA",
    timezone: "America/Los_Angeles",
  },
  {
    code: "DFW",
    name: "Dallas/Fort Worth International",
    city: "Dallas",
    country: "USA",
    timezone: "America/Chicago",
  },
  {
    code: "ATL",
    name: "Hartsfield-Jackson Atlanta International",
    city: "Atlanta",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    code: "BOS",
    name: "Boston Logan International",
    city: "Boston",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    code: "SEA",
    name: "Seattle-Tacoma International",
    city: "Seattle",
    country: "USA",
    timezone: "America/Los_Angeles",
  },
  {
    code: "LAS",
    name: "McCarran International",
    city: "Las Vegas",
    country: "USA",
    timezone: "America/Los_Angeles",
  },

  {
    code: "LHR",
    name: "Heathrow",
    city: "London",
    country: "UK",
    timezone: "Europe/London",
  },
  {
    code: "CDG",
    name: "Charles de Gaulle",
    city: "Paris",
    country: "France",
    timezone: "Europe/Paris",
  },
  {
    code: "FRA",
    name: "Frankfurt Airport",
    city: "Frankfurt",
    country: "Germunknown",
    timezone: "Europe/Berlin",
  },
  {
    code: "AMS",
    name: "Amsterdam Schiphol",
    city: "Amsterdam",
    country: "Netherlands",
    timezone: "Europe/Amsterdam",
  },
  {
    code: "MAD",
    name: "Adolfo Suárez Madrid–Barajas",
    city: "Madrid",
    country: "Spain",
    timezone: "Europe/Madrid",
  },
  {
    code: "FCO",
    name: "Leonardo da Vinci–Fiumicino",
    city: "Rome",
    country: "Italy",
    timezone: "Europe/Rome",
  },
  {
    code: "MUC",
    name: "Munich Airport",
    city: "Munich",
    country: "Germunknown",
    timezone: "Europe/Berlin",
  },
  {
    code: "ZRH",
    name: "Zürich Airport",
    city: "Zürich",
    country: "Switzerland",
    timezone: "Europe/Zurich",
  },

  {
    code: "DXB",
    name: "Dubai International",
    city: "Dubai",
    country: "UAE",
    timezone: "Asia/Dubai",
  },
  {
    code: "DOH",
    name: "Hamad International",
    city: "Doha",
    country: "Qatar",
    timezone: "Asia/Qatar",
  },
  {
    code: "IST",
    name: "Istanbul Airport",
    city: "Istanbul",
    country: "Turkey",
    timezone: "Europe/Istanbul",
  },
  {
    code: "NRT",
    name: "Narita International",
    city: "Tokyo",
    country: "Japan",
    timezone: "Asia/Tokyo",
  },
  {
    code: "SIN",
    name: "Singapore Changi",
    city: "Singapore",
    country: "Singapore",
    timezone: "Asia/Singapore",
  },
  {
    code: "HKG",
    name: "Hong Kong International",
    city: "Hong Kong",
    country: "China",
    timezone: "Asia/Hong_Kong",
  },
  {
    code: "ICN",
    name: "Incheon International",
    city: "Seoul",
    country: "South Korea",
    timezone: "Asia/Seoul",
  },

  {
    code: "SYD",
    name: "Sydney Kingsford Smith",
    city: "Sydney",
    country: "Australia",
    timezone: "Australia/Sydney",
  },
  {
    code: "MEL",
    name: "Melbourne Airport",
    city: "Melbourne",
    country: "Australia",
    timezone: "Australia/Melbourne",
  },
  {
    code: "AKL",
    name: "Auckland Airport",
    city: "Auckland",
    country: "New Zealand",
    timezone: "Pacific/Auckland",
  },
];

export const AIRLINES = [
  { code: "AA", name: "American Airlines", alliance: "Oneworld" as const },
  { code: "DL", name: "Delta", alliance: "SkyTeam" as const },
  { code: "UA", name: "United", alliance: "Star Alliance" as const },
  { code: "EK", name: "Emirates", alliance: "None" as const },
  { code: "BA", name: "British Airways", alliance: "Oneworld" as const },
  { code: "AF", name: "Air France", alliance: "SkyTeam" as const },
  { code: "LH", name: "Lufthansa", alliance: "Star Alliance" as const },
  { code: "QR", name: "Qatar Airways", alliance: "Oneworld" as const },
  {
    code: "SQ",
    name: "Singapore Airlines",
    alliance: "Star Alliance" as const,
  },
  { code: "EY", name: "Etihad Airways", alliance: "None" as const },
  { code: "TK", name: "Turkish Airlines", alliance: "Star Alliance" as const },
  { code: "CX", name: "Cathay Pacific", alliance: "Oneworld" as const },
];

export const CABIN_CLASSES: {
  value: keyof typeof CabinClass;
  label: string;
  description?: string;
}[] = [
  {
    value: "economy" as keyof typeof CabinClass,
    label: "Economy",
    description: "Standard seating",
  },
  {
    value: "premium_economy" as keyof typeof CabinClass,
    label: "Premium Economy",
    description: "Extra legroom and amenities",
  },
  {
    value: "business" as keyof typeof CabinClass,
    label: "Business",
    description: "Premium service and comfort",
  },
  {
    value: "first" as keyof typeof CabinClass,
    label: "First Class",
    description: "Luxury experience",
  },
];

export const PASSENGER_OPTIONS = [
  { value: 1, label: "1 Passenger" },
  { value: 2, label: "2 Passengers" },
  { value: 3, label: "3 Passengers" },
  { value: 4, label: "4 Passengers" },
  { value: 5, label: "5 Passengers" },
  { value: 6, label: "6 Passengers" },
  { value: 7, label: "7 Passengers" },
  { value: 8, label: "8 Passengers" },
  { value: 9, label: "9+ Passengers" },
];

export const STOPS_OPTIONS = [
  { value: 0, label: "Non-stop", description: "Direct flight" },
  { value: 1, label: "1 Stop", description: "One connection" },
  { value: 2, label: "2+ Stops", description: "Multiple connections" },
];

export const TRIP_TYPES = [
  { value: "one-way", label: "One-way" },
  { value: "round-trip", label: "Round-trip" },
  { value: "multi-city", label: "Multi-city" },
];

export const API_CONFIG = {
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),
  BASE_URL:
    import.meta.env.VITE_AMADEUS_API_URL || "https://test.api.amadeus.com",
  ENABLE_MOCK: import.meta.env.VITE_ENABLE_MOCK_DATA === "true",
  MAX_RESULTS: 50,
  CACHE_DURATION: 5 * 60 * 1000,
};

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || "FlightFinder",
  VERSION: "1.0.0",
  RESULTS_PER_PAGE: 20,
  MAX_SEARCH_RESULTS: 50,
  MAX_RECENT_SEARCHES: 10,
  MAX_SAVED_SEARCHES: 20,
  DEBOUNCE_DELAY: 300,
  AUTO_SEARCH_DELAY: 1000,
};

export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#a855f7",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  grid: "#e5e7eb",
  background: "#f9fafb",
};

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  CNY: "¥",
  INR: "₹",
};

export const DATE_FORMATS = {
  SHORT: "MMM dd",
  MEDIUM: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy",
  FULL: "EEEE, MMMM dd, yyyy",
  TIME: "h:mm a",
  DATETIME: "MMM dd, yyyy • h:mm a",
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
};
