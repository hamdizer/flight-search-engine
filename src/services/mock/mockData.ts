export const MOCK_AIRLINES = [
  { code: "AA", name: "American Airlines" },
  { code: "DL", name: "Delta" },
  { code: "UA", name: "United" },
  { code: "EK", name: "Emirates" },
  { code: "BA", name: "British Airways" },
  { code: "AF", name: "Air France" },
  { code: "LH", name: "Lufthansa" },
  { code: "QR", name: "Qatar Airways" },
];

export const MOCK_AIRCRAFT_TYPES = [
  "Boeing 737",
  "Boeing 777",
  "Boeing 787 Dreamliner",
  "Airbus A320",
  "Airbus A330",
  "Airbus A350",
  "Airbus A380",
];

export const MOCK_AMENITIES = [
  "WiFi",
  "In-flight Entertainment",
  "USB Power",
  "Meals Included",
  "Extra Legroom",
  "Priority Boarding",
  "Lounge Access",
  "Complimentary Drinks",
];

export const MOCK_HUB_AIRPORTS = [
  "DXB",
  "LHR",
  "CDG",
  "FRA",
  "AMS",
  "DOH",
  "IST",
  "ORD",
  "DFW",
  "ATL",
];

export function calculateRouteBasePrice(
  origin: string,
  destination: string,
): number {
  const routeHash = (origin + destination).split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return 200 + (routeHash % 800);
}

export function calculateRouteDuration(
  origin: string,
  destination: string,
): number {
  const routeHash = (origin + destination).split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  const hours = 2 + (routeHash % 10);
  return hours * 60;
}

export function getRandomStopLocations(
  count: number,
  origin: string,
  destination: string,
): string[] {
  const availableHubs = MOCK_HUB_AIRPORTS.filter(
    (hub) => hub !== origin && hub !== destination,
  );

  const stops: string[] = [];
  const shuffled = [...availableHubs].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count && i < shuffled.length; i++) {
    stops.push(shuffled[i]);
  }

  return stops;
}

export function getRandomAmenities(count: number): string[] {
  const shuffled = [...MOCK_AMENITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomAircraft(): string {
  return MOCK_AIRCRAFT_TYPES[
    Math.floor(Math.random() * MOCK_AIRCRAFT_TYPES.length)
  ];
}

export function getRandomAirline() {
  return MOCK_AIRLINES[Math.floor(Math.random() * MOCK_AIRLINES.length)];
}
