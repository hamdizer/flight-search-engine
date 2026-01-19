import type { TimeSlot } from "./flight.types";

export interface FilterOptions {
  maxPrice: number;
  stops: number[];
  airlines: string[];
  departureTime: TimeSlot[];
  arrivalTime: TimeSlot[];
  duration?: DurationRange;
}

export interface DurationRange {
  min: number;
  max: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState extends FilterOptions {
  priceRange: PriceRange;
  isActive: boolean;
}

export interface SortOption {
  field: "price" | "duration" | "departure" | "arrival" | "stops";
  order: "asc" | "desc";
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { field: "price", order: "asc", label: "Lowest Price" },
  { field: "price", order: "desc", label: "Highest Price" },
  { field: "duration", order: "asc", label: "Shortest Duration" },
  { field: "duration", order: "desc", label: "Longest Duration" },
  { field: "departure", order: "asc", label: "Earliest Departure" },
  { field: "departure", order: "desc", label: "Latest Departure" },
  { field: "arrival", order: "asc", label: "Earliest Arrival" },
  { field: "arrival", order: "desc", label: "Latest Arrival" },
  { field: "stops", order: "asc", label: "Fewest Stops" },
];

export interface TimeSlotOption {
  value: TimeSlot;
  label: string;
  hours: string;
  icon?: string;
}

export const TIME_SLOT_OPTIONS: TimeSlotOption[] = [
  { value: "morning", label: "Morning", hours: "6AM - 12PM", icon: "🌅" },
  { value: "afternoon", label: "Afternoon", hours: "12PM - 6PM", icon: "☀️" },
  { value: "evening", label: "Evening", hours: "6PM - 12AM", icon: "🌆" },
  { value: "night", label: "Night", hours: "12AM - 6AM", icon: "🌙" },
];

export interface StopsOption {
  value: number;
  label: string;
  description?: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<FilterOptions>;
  icon?: string;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: "cheapest",
    name: "Cheapest",
    filters: { stops: [1, 2] },
    icon: "💰",
  },
  {
    id: "fastest",
    name: "Fastest",
    filters: { stops: [0] },
    icon: "⚡",
  },
  {
    id: "best-value",
    name: "Best Value",
    filters: { stops: [0, 1] },
    icon: "⭐",
  },
];
