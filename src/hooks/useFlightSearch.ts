import { useState, useCallback } from "react";

import { generateMockFlights } from "../services/mock/flightGenerator";
import amadeusService from "../services/api/amadeus";
import { API_CONFIG } from "../utils/contants";
import type { Flight } from "../types/flight.types";
import type { SearchParams, SearchResult } from "../types/search.types";

interface UseFlightSearchReturn {
  flights: Flight[];
  isLoading: boolean;
  error: string | null;
  searchFlights: (params: SearchParams) => Promise<void>;
  clearResults: () => void;
  lastSearch: SearchParams | null;
}

export const useFlightSearch = (): UseFlightSearchReturn => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState<SearchParams | null>(null);

  const searchFlights = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setLastSearch(params);

    try {
      const useMockData = API_CONFIG.ENABLE_MOCK;

      let result: SearchResult;

      if (useMockData) {
        console.log("🔧 Using mock data mode");
        const mockFlights = generateMockFlights(
          params.origin,
          params.destination,
        );
        result = {
          flights: mockFlights,
          totalResults: mockFlights.length,
          searchId: `mock_${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        console.log("🌐 Using Amadeus API");
        result = await amadeusService.searchFlights(params);
      }

      setFlights(result.flights);
      console.log(`✅ Found ${result.flights.length} flights`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search flights";
      setError(errorMessage);
      console.error("❌ Search error:", err);

      if (!API_CONFIG.ENABLE_MOCK) {
        console.log("⚠️ API failed, falling back to mock data");
        const mockFlights = generateMockFlights(
          params.origin,
          params.destination,
        );
        setFlights(mockFlights);
        setError("Using demo data. API connection failed.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setFlights([]);
    setError(null);
    setLastSearch(null);
  }, []);

  return {
    flights,
    isLoading,
    error,
    searchFlights,
    clearResults,
    lastSearch,
  };
};
