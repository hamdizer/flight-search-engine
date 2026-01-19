export const ENDPOINTS = {
  AUTH: {
    TOKEN: "/v1/security/oauth2/token",
  },

  SHOPPING: {
    FLIGHT_OFFERS: "/v2/shopping/flight-offers",
    FLIGHT_OFFERS_PRICE: "/v1/shopping/flight-offers/pricing",
    FLIGHT_DATES: "/v1/shopping/flight-dates",
    FLIGHT_DESTINATIONS: "/v1/shopping/flight-destinations",
    SEATMAPS: "/v1/shopping/seatmaps",
  },

  REFERENCE_DATA: {
    LOCATIONS: "/v1/reference-data/locations",
    LOCATION: (locationId: string) =>
      `/v1/reference-data/locations/${locationId}`,
    AIRLINES: "/v1/reference-data/airlines",
    AIRCRAFT: "/v1/reference-data/aircraft",
  },

  BOOKING: {
    FLIGHT_ORDERS: "/v1/booking/flight-orders",
    FLIGHT_ORDER: (orderId: string) => `/v1/booking/flight-orders/${orderId}`,
  },

  INSIGHTS: {
    FLIGHT_PRICE_ANALYSIS: "/v1/analytics/itinerary-price-metrics",
    FLIGHT_CHOICE_PREDICTION: "/v2/shopping/flight-offers/prediction",
  },
} as const;

export function buildFlightSearchParams(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: string;
  nonStop?: boolean;
  currencyCode?: string;
  max?: number;
}): Record<string, string | number | boolean> {
  const queryParams: Record<string, string | number | boolean> = {
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: params.adults,
  };

  if (params.returnDate) queryParams.returnDate = params.returnDate;
  if (params.children) queryParams.children = params.children;
  if (params.infants) queryParams.infants = params.infants;
  if (params.travelClass)
    queryParams.travelClass = params.travelClass.toUpperCase();
  if (params.nonStop !== undefined) queryParams.nonStop = params.nonStop;
  if (params.currencyCode) queryParams.currencyCode = params.currencyCode;
  if (params.max) queryParams.max = params.max;

  return queryParams;
}

export function buildLocationSearchParams(params: {
  keyword: string;
  subType?: "AIRPORT" | "CITY";
  limit?: number;
}): Record<string, string | number> {
  const queryParams: Record<string, string | number> = {
    keyword: params.keyword,
  };

  if (params.subType) {
    queryParams.subType = params.subType;
  }

  if (params.limit) {
    queryParams["page[limit]"] = params.limit;
  }

  return queryParams;
}

export function buildAirlineSearchParams(params: {
  airlineCodes?: string;
}): Record<string, string> {
  const queryParams: Record<string, string> = {};

  if (params.airlineCodes) {
    queryParams.airlineCodes = params.airlineCodes;
  }

  return queryParams;
}
