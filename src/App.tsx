import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Users,
  Plane,
  Filter,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFilters } from "./hooks/useFilters";
import { PASSENGER_OPTIONS } from "./utils/contants";
import { formatPrice, formatStops } from "./utils/formatters";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { useFlightSearch } from "./hooks/useFlightSearch";
import type { SearchFormData } from "./types/search.types";
import type {
  CabinClass,
  ChartDataPoint,
  Flight,
  TimeSlot,
} from "./types/flight.types";
import "./styles/tailwind.css";
import { DatePicker } from "./components/search/DatePicker";
import { SearchInput } from "./components/search/SearchInput";
import { Select } from "./components/common/Select";
const App: React.FC = () => {
  const [searchForm, setSearchForm] = useState<SearchFormData>({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    cabinClass: "economy" as keyof typeof CabinClass,
    tripType: "one-way",
  });

  const { flights, isLoading, searchFlights } = useFlightSearch();
  const {
    filters,
    filteredFlights,
    updateFilter,
    toggleArrayFilter,
    clearFilters,
    activeFilterCount,
  } = useFilters(flights);

  const handleSearch = async () => {
    if (
      !searchForm.origin ||
      !searchForm.destination ||
      !searchForm.departureDate
    ) {
      return;
    }
    await searchFlights(searchForm);
  };

  const priceChartData: ChartDataPoint[] = useMemo(() => {
    if (filteredFlights.length === 0) return [];

    const priceByStops = filteredFlights.reduce(
      (acc, flight) => {
        const key =
          flight.stops === 0
            ? "Non-stop"
            : flight.stops === 1
              ? "1 Stop"
              : "2+ Stops";
        if (!acc[key]) acc[key] = [];
        acc[key].push(flight.price);
        return acc;
      },
      {} as Record<string, number[]>,
    );

    return Object.entries(priceByStops).map(([stops, prices]) => ({
      stops,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      count: prices.length,
    }));
  }, [filteredFlights]);

  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 2000 };
    return {
      min: Math.min(...flights.map((f) => f.price)),
      max: Math.max(...flights.map((f) => f.price)),
    };
  }, [flights]);

  const uniqueAirlines = useMemo(() => {
    return [...new Set(flights.map((f: Flight) => f.airline))];
  }, [flights]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <SearchInput
                type="origin"
                value={searchForm.origin}
                onChange={(value) =>
                  setSearchForm((prev) => ({
                    ...prev,
                    origin: value,
                  }))
                }
                className="w-full"
              />

              <div>
                <SearchInput
                  type="destination"
                  value={searchForm.destination}
                  onChange={(value) =>
                    setSearchForm((prev) => ({
                      ...prev,
                      destination: value,
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <DatePicker
                  label="Departure"
                  value={searchForm.departureDate}
                  onChange={(value) =>
                    setSearchForm((prev) => ({
                      ...prev,
                      departureDate: value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passengers
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Select
                    value={searchForm.passengers}
                    onChange={(e) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        passengers: parseInt(e.target.value),
                      }))
                    }
                    options={PASSENGER_OPTIONS}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={
                !searchForm.origin ||
                !searchForm.destination ||
                !searchForm.departureDate ||
                isLoading
              }
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching flights...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search Flights
                </>
              )}
            </button>
          </div>

          {flights.length > 0 && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">Filters</h3>
                      {activeFilterCount > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                          {activeFilterCount}
                        </span>
                      )}
                    </div>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Max Price: ${filters.maxPrice}
                    </label>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={filters.maxPrice}
                      onChange={(e) =>
                        updateFilter("maxPrice", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>${priceRange.min}</span>
                      <span>${priceRange.max}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Stops
                    </label>
                    <div className="space-y-2">
                      {[0, 1, 2].map((stop) => (
                        <label
                          key={stop}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={filters.stops.includes(stop)}
                            onChange={() => toggleArrayFilter("stops", stop)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {formatStops(stop)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Airlines
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uniqueAirlines.map((airline) => (
                        <label
                          key={airline}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={filters.airlines.includes(airline)}
                            onChange={() =>
                              toggleArrayFilter("airlines", airline)
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {airline}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Departure Time
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "morning", label: "Morning (6AM - 12PM)" },
                        { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
                        { value: "evening", label: "Evening (6PM - 12AM)" },
                      ].map((time) => (
                        <label
                          key={time.value}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={filters.departureTime.includes(
                              time.value as TimeSlot,
                            )}
                            onChange={() =>
                              toggleArrayFilter(
                                "departureTime",
                                time.value as TimeSlot,
                              )
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {time.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                {priceChartData.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingDown className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">
                        Price Trends
                      </h3>
                      <span className="text-sm text-gray-500">
                        ({filteredFlights.length} flights)
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={priceChartData}>
                        <defs>
                          <linearGradient
                            id="colorPrice"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="stops" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                          formatter={(value) => `$${value}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="avgPrice"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fill="url(#colorPrice)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="space-y-4">
                  {filteredFlights.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No flights found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your filters to see more results
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-600">
                          Showing {filteredFlights.length} of {flights.length}{" "}
                          flights
                        </p>
                      </div>

                      {filteredFlights.map((flight) => (
                        <div
                          key={flight.id}
                          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                  <Plane className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {flight.airline}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {flight.flightNumber} • {flight.aircraft}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 items-center">
                                <div>
                                  <p className="text-2xl font-bold text-gray-900">
                                    {flight.departure}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {flight.origin}
                                  </p>
                                </div>

                                <div className="text-center">
                                  <p className="text-sm text-gray-500 mb-1">
                                    {flight.duration}
                                  </p>
                                  <div className="relative">
                                    <div className="h-0.5 bg-gray-300 w-full"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                      <Plane className="w-4 h-4 text-gray-400 rotate-90" />
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatStops(flight.stops)}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-2xl font-bold text-gray-900">
                                    {flight.arrival}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {flight.destination}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4">
                              <div className="text-left sm:text-right">
                                <p className="text-3xl font-bold text-gray-900">
                                  {formatPrice(flight.price)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {flight.availableSeats} seats left
                                </p>
                              </div>
                              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg whitespace-nowrap">
                                Select Flight
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
