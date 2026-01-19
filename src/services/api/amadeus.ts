import type { AmadeusFlightOffer, AmadeusLocation, AmadeusTokenResponse } from "../../types/api.types";
import type { Flight } from "../../types/flight.types";
import type { SearchParams, SearchResult } from "../../types/search.types";

import { apiClient, apiRequestWithRetry } from "./client";
import {
  ENDPOINTS,
  buildFlightSearchParams,
  buildLocationSearchParams,
} from "./endpoints";

interface AmadeusConfig {
  apiKey: string;
  apiSecret: string;
  baseURL: string;
}

class AmadeusService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private config: AmadeusConfig;

  constructor(config: AmadeusConfig) {
    this.config = config;
  }

  private async authenticate(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken;
    }

    try {
      console.log("🔐 Authenticating with Amadeus API...");

      const response = await apiClient.post<AmadeusTokenResponse>(
        ENDPOINTS.AUTH.TOKEN,
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.config.apiKey,
          client_secret: this.config.apiSecret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      console.log("✅ Authentication successful");
      return this.accessToken;
    } catch (error) {
      console.error("❌ Amadeus authentication failed:", error);
      throw new Error(
        "Failed to authenticate with Amadeus API. Please check your credentials.",
      );
    }
  }

  async searchFlights(params: SearchParams): Promise<SearchResult> {
    const token = await this.authenticate();

    const searchParams = buildFlightSearchParams({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.passengers,
      travelClass: params.cabinClass,
      currencyCode: "USD",
      max: 50,
    });

    try {
      console.log("🔍 Searching flights:", searchParams);

      const response = await apiRequestWithRetry<{
        data: AmadeusFlightOffer[];
      }>({
        url: ENDPOINTS.SHOPPING.FLIGHT_OFFERS,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: searchParams,
      });

      const flights = this.transformFlightOffers(response.data);

      console.log(`✅ Found ${flights.length} flights`);

      return {
        flights,
        totalResults: flights.length,
        searchId: `amadeus_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Flight search failed:", error);
      throw new Error("Failed to search flights. Please try again.");
    }
  }

  private transformFlightOffers(offers: AmadeusFlightOffer[]): Flight[] {
    return offers.map((offer) => {
      const itinerary = offer.itineraries[0];
      const firstSegment = itinerary.segments[0];
      const lastSegment = itinerary.segments[itinerary.segments.length - 1];

      const departureTime = new Date(firstSegment.departure.at);
      const arrivalTime = new Date(lastSegment.arrival.at);
      const durationMinutes = Math.floor(
        (arrivalTime.getTime() - departureTime.getTime()) / 60000,
      );

      const stopLocations = itinerary.segments
        .slice(0, -1)
        .map((segment) => segment.arrival.iataCode);

      return {
        id: offer.id,
        airline: this.getAirlineName(firstSegment.carrierCode),
        airlineCode: firstSegment.carrierCode,
        flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
        origin: firstSegment.departure.iataCode,
        destination: lastSegment.arrival.iataCode,
        departure: this.formatTime(departureTime),
        arrival: this.formatTime(arrivalTime),
        departureDate: firstSegment.departure.at,
        arrivalDate: lastSegment.arrival.at,
        duration: this.formatDuration(durationMinutes),
        durationMinutes,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        stops: itinerary.segments.length - 1,
        stopLocations,
        aircraft: this.getAircraftName(firstSegment.aircraft.code),
        availableSeats: offer.numberOfBookableSeats,
        cabinClass: this.getCabinClass(offer),
        baggage: this.getBaggageInfo(offer),
        amenities: this.getAmenities(firstSegment.carrierCode),
      } as Flight;
    });
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  private getAirlineName(code: string): string {
    const airlineMap: Record<string, string> = {
      AA: "American Airlines",
      DL: "Delta",
      UA: "United",
      BA: "British Airways",
      AF: "Air France",
      EK: "Emirates",
      LH: "Lufthansa",
      QR: "Qatar Airways",
      SQ: "Singapore Airlines",
      EY: "Etihad Airways",
      TK: "Turkish Airlines",
      KL: "KLM",
      VS: "Virgin Atlantic",
    };

    return airlineMap[code] || code;
  }

  private getAircraftName(code: string): string {
    const aircraftMap: Record<string, string> = {
      "320": "Airbus A320",
      "321": "Airbus A321",
      "330": "Airbus A330",
      "350": "Airbus A350",
      "380": "Airbus A380",
      "737": "Boeing 737",
      "777": "Boeing 777",
      "787": "Boeing 787 Dreamliner",
    };

    return aircraftMap[code] || `Aircraft ${code}`;
  }

  private getCabinClass(offer: AmadeusFlightOffer): string {
    const cabin = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin;
    return cabin?.toLowerCase() || "economy";
  }

  private getBaggageInfo(offer: AmadeusFlightOffer) {
    const baggageDetails =
      offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
        ?.includedCheckedBags;

    return {
      checkedBags: baggageDetails?.quantity || 1,
      carryOn: true,
      weight: "23kg",
    };
  }

  private getAmenities(airlineCode: string): string[] {
    const premiumAirlines = ["EK", "QR", "SQ", "EY"];

    if (premiumAirlines.includes(airlineCode)) {
      return [
        "WiFi",
        "In-flight Entertainment",
        "USB Power",
        "Meals Included",
        "Extra Legroom",
      ];
    }

    return ["In-flight Entertainment", "USB Power", "Meals Included"];
  }

  async searchAirports(
    keyword: string,
    limit: number = 10,
  ): Promise<AmadeusLocation[]> {
    const token = await this.authenticate();

    const searchParams = buildLocationSearchParams({
      keyword,
      subType: "AIRPORT",
      limit,
    });

    try {
      const response = await apiClient.get<{ data: AmadeusLocation[] }>(
        ENDPOINTS.REFERENCE_DATA.LOCATIONS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: searchParams,
        },
      );

      return response.data.data;
    } catch (error) {
      console.error("❌ Airport search failed:", error);
      return [];
    }
  }

  async getAirportDetails(
    airportCode: string,
  ): Promise<AmadeusLocation | null> {
    const token = await this.authenticate();

    try {
      const response = await apiClient.get<{ data: AmadeusLocation }>(
        ENDPOINTS.REFERENCE_DATA.LOCATION(airportCode),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to fetch airport details:", error);
      return null;
    }
  }
}

const amadeusService = new AmadeusService({
  apiKey: import.meta.env.VITE_AMADEUS_API_KEY || "",
  apiSecret: import.meta.env.VITE_AMADEUS_API_SECRET || "",
  baseURL:
    import.meta.env.VITE_AMADEUS_API_URL || "https://test.api.amadeus.com",
});

export default amadeusService;
