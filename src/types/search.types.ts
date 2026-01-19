import type { CabinClass, Flight } from "./flight.types";

export interface SearchFormData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: keyof typeof CabinClass;
  tripType: TripType;
}

export type TripType = "one-way" | "round-trip" | "multi-city";

export interface SearchParams extends SearchFormData {
  currency?: string;
  maxResults?: number;
  nonStop?: boolean;
  flexibleDates?: boolean;
  includedAirlines?: string[];
  excludedAirlines?: string[];
}

export interface SearchResult {
  flights: Flight[];
  totalResults: number;
  searchId: string;
  timestamp: string;
  metadata?: SearchMetadata;
}

export interface SearchMetadata {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  currency: string;
  searchDuration?: number;
}

export interface SearchState {
  isSearching: boolean;
  hasSearched: boolean;
  error: string | null;
  lastSearch: SearchParams | null;
  results: SearchResult | null;
}

export interface SearchValidation {
  isValid: boolean;
  errors: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: string;
    general?: string;
  };
}

export interface RecentSearch {
  id: string;
  params: SearchParams;
  timestamp: string;
  resultCount: number;
}

export interface SavedSearch extends SearchParams {
  id: string;
  name: string;
  createdAt: string;
  notifications?: boolean;
}

export interface SearchSuggestion {
  type: "airport" | "city" | "route";
  value: string;
  label: string;
  subtitle?: string;
}
