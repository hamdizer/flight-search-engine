import { useState, useMemo, useCallback, useEffect } from "react";

import { getTimeSlot } from "../utils/formatters";
import type { FilterOptions, Flight } from "../types/flight.types";
import type { SortOption } from "../types/filter.types";

interface UseFiltersReturn {
  filters: FilterOptions;
  filteredFlights: Flight[];
  sortOption: SortOption;
  updateFilter: <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K],
  ) => void;
  toggleArrayFilter: <
    K extends keyof Pick<
      FilterOptions,
      "stops" | "airlines" | "departureTime" | "arrivalTime"
    >,
  >(
    key: K,
    value: FilterOptions[K] extends (infer U)[] ? U : never,
  ) => void;
  clearFilters: () => void;
  setSortOption: (option: SortOption) => void;
  activeFilterCount: number;
  priceRange: { min: number; max: number };
}

const getDefaultFilters = (flights: Flight[]): FilterOptions => {
  const maxPrice =
    flights.length > 0 ? Math.max(...flights.map((f) => f.price)) : 2000;

  return {
    maxPrice,
    stops: [],
    airlines: [],
    departureTime: [],
    arrivalTime: [],
  };
};

export const useFilters = (flights: Flight[]): UseFiltersReturn => {
  const [filters, setFilters] = useState<FilterOptions>(() =>
    getDefaultFilters(flights),
  );
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "price",
    order: "asc",
    label: "Lowest Price",
  });

  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 2000 };
    return {
      min: Math.min(...flights.map((f) => f.price)),
      max: Math.max(...flights.map((f) => f.price)),
    };
  }, [flights]);

  useEffect(() => {
    if (flights.length > 0 && filters.maxPrice === 2000) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters(getDefaultFilters(flights));
    }
  }, [flights, filters.maxPrice]);

  const updateFilter = useCallback(
    <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleArrayFilter = useCallback(
    <
      K extends keyof Pick<
        FilterOptions,
        "stops" | "airlines" | "departureTime" | "arrivalTime"
      >,
    >(
      key: K,
      value: FilterOptions[K] extends (infer U)[] ? U : never,
    ) => {
      setFilters((prev) => {
        const currentArray = prev[key] as (FilterOptions[K] extends (infer U)[]
          ? U
          : never)[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter((v) => v !== value)
          : [...currentArray, value];
        return { ...prev, [key]: newArray };
      });
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(getDefaultFilters(flights));
  }, [flights]);

  const filteredFlights = useMemo(() => {
    let result = [...flights];

    result = result.filter((flight) => {
      if (flight.price > filters.maxPrice) return false;

      if (filters.stops.length > 0 && !filters.stops.includes(flight.stops))
        return false;

      if (
        filters.airlines.length > 0 &&
        !filters.airlines.includes(flight.airline)
      )
        return false;

      if (filters.departureTime.length > 0) {
        const hour = parseInt(flight.departure.split(":")[0]);
        const timeSlot = getTimeSlot(hour);
        if (!filters.departureTime.includes(timeSlot)) return false;
      }

      if (filters.arrivalTime && filters.arrivalTime.length > 0) {
        const hour = parseInt(flight.arrival.split(":")[0]);
        const timeSlot = getTimeSlot(hour);
        if (!filters.arrivalTime.includes(timeSlot)) return false;
      }

      if (filters.duration) {
        const withinRange =
          flight.durationMinutes >= (filters.duration.min || 0) &&
          flight.durationMinutes <= (filters.duration.max || Infinity);
        if (!withinRange) return false;
      }

      return true;
    });

    result.sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOption.order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOption.order === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return result;
  }, [flights, filters, sortOption]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.maxPrice < priceRange.max) count++;
    if (filters.stops.length > 0) count++;
    if (filters.airlines.length > 0) count++;
    if (filters.departureTime.length > 0) count++;
    if (filters.arrivalTime && filters.arrivalTime.length > 0) count++;
    if (filters.duration) count++;

    return count;
  }, [filters, priceRange.max]);

  return {
    filters,
    filteredFlights,
    sortOption,
    updateFilter,
    toggleArrayFilter,
    clearFilters,
    setSortOption,
    activeFilterCount,
    priceRange,
  };
};
