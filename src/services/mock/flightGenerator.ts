import type { CabinClass, Flight } from "../../types/flight.types";
import {
  MOCK_AIRLINES,
  MOCK_AIRCRAFT_TYPES,
  calculateRouteBasePrice,
  calculateRouteDuration,
  getRandomStopLocations,
  getRandomAmenities,
} from "./mockData";

export function generateMockFlights(
  origin: string,
  destination: string,
): Flight[] {
  if (!origin || !destination || origin === destination) {
    return [];
  }

  const flights: Flight[] = [];
  const basePrice = calculateRouteBasePrice(origin, destination);
  const baseDuration = calculateRouteDuration(origin, destination);
  const currentDate = new Date().toISOString().split("T")[0];

  MOCK_AIRLINES.forEach((airline) => {
    [0, 1, 2].forEach((stops) => {
      const numFlightsPerConfig = stops === 0 ? 3 : 2;

      for (let i = 0; i < numFlightsPerConfig; i++) {
        const priceVariation = 0.8 + Math.random() * 0.4;
        const stopsMultiplier = stops === 0 ? 1.4 : stops === 1 ? 1.0 : 0.7;
        const timeMultiplier = 1 + i * 0.1;
        const price = Math.round(
          basePrice * priceVariation * stopsMultiplier * timeMultiplier,
        );

        const departureHour = 6 + Math.floor(Math.random() * 16);
        const departureMinutes = Math.floor(Math.random() * 60);
        const durationMinutes =
          baseDuration + stops * 90 + Math.floor(Math.random() * 60);

        const totalMinutes =
          departureHour * 60 + departureMinutes + durationMinutes;
        const arrivalHour = Math.floor(totalMinutes / 60) % 24;
        const arrivalMinutes = totalMinutes % 60;

        const departure = `${departureHour.toString().padStart(2, "0")}:${departureMinutes.toString().padStart(2, "0")}`;
        const arrival = `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinutes.toString().padStart(2, "0")}`;

        const stopLocations =
          stops > 0 ? getRandomStopLocations(stops, origin, destination) : [];

        const isPremiumAirline = ["EK", "QR", "BA", "AF"].includes(
          airline.code,
        );
        const checkedBags = isPremiumAirline ? 2 : stops === 0 ? 1 : 1;

        const amenityCount = isPremiumAirline ? 5 : stops === 0 ? 4 : 3;
        const amenities = getRandomAmenities(amenityCount);

        const availableSeats = Math.floor(Math.random() * 50 + 10);

        const aircraft =
          MOCK_AIRCRAFT_TYPES[
            Math.floor(Math.random() * MOCK_AIRCRAFT_TYPES.length)
          ];

        flights.push({
          id: `${airline.code}-${stops}-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          airline: airline.name,
          airlineCode: airline.code,
          flightNumber: `${airline.code}${Math.floor(Math.random() * 9000 + 1000)}`,
          origin,
          destination,
          departure,
          arrival,
          departureDate: `${currentDate}T${departure}:00`,
          arrivalDate: `${currentDate}T${arrival}:00`,
          duration: formatDuration(durationMinutes),
          durationMinutes,
          price,
          currency: "USD",
          stops,
          stopLocations,
          aircraft,
          availableSeats,
          cabinClass: "economy" as keyof typeof CabinClass,
          baggage: {
            checkedBags,
            carryOn: true,
            weight: "23kg",
          },
          amenities,
        });
      }
    });
  });

  return flights.sort((a, b) => a.price - b.price);
}

export function generateRandomFlight(
  origin: string,
  destination: string,
): Flight {
  const flights = generateMockFlights(origin, destination);
  return flights[Math.floor(Math.random() * flights.length)];
}

export function generateFilteredFlights(params: {
  origin: string;
  destination: string;
  maxPrice?: number;
  stops?: number[];
  airlines?: string[];
}): Flight[] {
  let flights = generateMockFlights(params.origin, params.destination);

  if (params.maxPrice) {
    flights = flights.filter((f) => f.price <= params.maxPrice!);
  }

  if (params.stops && params.stops.length > 0) {
    flights = flights.filter((f) => params.stops!.includes(f.stops));
  }

  if (params.airlines && params.airlines.length > 0) {
    flights = flights.filter((f) => params.airlines!.includes(f.airline));
  }

  return flights;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export function generatePriceHistory(
  origin: string,
  destination: string,
  days: number = 30,
): Array<{ date: string; price: number }> {
  const basePrice = calculateRouteBasePrice(origin, destination);
  const history: Array<{ date: string; price: number }> = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 1.2 : 1.0;
    const randomVariation = 0.9 + Math.random() * 0.2;

    const price = Math.round(basePrice * weekendMultiplier * randomVariation);

    history.push({
      date: date.toISOString().split("T")[0],
      price,
    });
  }

  return history;
}

export function generateRecommendations(
  origin: string,
  destination: string,
  count: number = 3,
): Flight[] {
  const allFlights = generateMockFlights(origin, destination);

  const cheapest = allFlights[0];

  const fastest = allFlights.find((f) => f.stops === 0) || allFlights[0];

  const bestValue = allFlights.find((f) => f.stops === 1) || allFlights[1];

  return [cheapest, fastest, bestValue].slice(0, count);
}

export async function checkFlightAvailability(): Promise<{
  available: boolean;
  seatsLeft: number;
  priceChange?: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const available = Math.random() > 0.1;
  const seatsLeft = available ? Math.floor(Math.random() * 50 + 5) : 0;
  const priceChange =
    Math.random() > 0.7 ? Math.floor(Math.random() * 50 - 25) : 0;

  return {
    available,
    seatsLeft,
    priceChange: priceChange !== 0 ? priceChange : undefined,
  };
}

export function generateSearchResults(params: {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
}) {
  const flights = generateMockFlights(params.origin, params.destination);

  return {
    flights,
    metadata: {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      passengers: params.passengers,
      currency: "USD",
      totalResults: flights.length,
      searchTime: Math.floor(Math.random() * 500 + 300),
      cheapestPrice: Math.min(...flights.map((f) => f.price)),
      averagePrice: Math.round(
        flights.reduce((sum, f) => sum + f.price, 0) / flights.length,
      ),
      airlines: [...new Set(flights.map((f) => f.airline))],
    },
  };
}

export default {
  generateMockFlights,
  generateRandomFlight,
  generateFilteredFlights,
  generatePriceHistory,
  generateRecommendations,
  checkFlightAvailability,
  generateSearchResults,
};
