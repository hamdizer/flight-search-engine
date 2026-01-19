import React, { useState } from "react";
import { Search, AlertCircle, Filter as FilterIcon } from "lucide-react";
import { FlightCard } from "./FlightCard";

import { EmptyState } from "../common/EmptyState";
import { cn } from "../../utils/helpers";
import { SortDropdown } from "./SortDropDown";
import { Button } from "../common/Button";
import type { Flight } from "../../types/flight.types";
import type { SortOption } from "../../types/filter.types";

export interface FlightListProps {
  flights: Flight[];
  totalFlights: number;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onSelectFlight?: (flight: Flight) => void;
  isLoading?: boolean;
  className?: string;
  showCompareMode?: boolean;
}

export const FlightList: React.FC<FlightListProps> = ({
  flights,
  totalFlights,
  sortOption,
  onSortChange,
  onSelectFlight,
  isLoading = false,
  className,
  showCompareMode = false,
}) => {
  const [selectedFlights, setSelectedFlights] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  const handleSelectForCompare = (flightId: string) => {
    if (selectedFlights.includes(flightId)) {
      setSelectedFlights(selectedFlights.filter((id) => id !== flightId));
    } else if (selectedFlights.length < 3) {
      setSelectedFlights([...selectedFlights, flightId]);
    }
  };

  if (!isLoading && flights.length === 0) {
    return (
      <EmptyState
        icon={<Search className="w-8 h-8 text-gray-400" />}
        title="No flights found"
        description="Try adjusting your filters to see more results"
        action={
          totalFlights > 0 ? (
            <Button variant="outline" onClick={() => window.location.reload()}>
              <FilterIcon className="w-4 h-4" />
              Reset Filters
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {flights.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{totalFlights}</span>{" "}
            flights
          </p>

          {flights.length < totalFlights && (
            <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <AlertCircle className="w-3 h-3" />
              Filters active
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showCompareMode && (
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedFlights([]);
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                compareMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              Compare{" "}
              {selectedFlights.length > 0 && `(${selectedFlights.length})`}
            </button>
          )}

          <SortDropdown value={sortOption} onChange={onSortChange} />
        </div>
      </div>

      {compareMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Select up to 3 flights to compare.{" "}
            {selectedFlights.length > 0 && (
              <span className="font-medium">
                {selectedFlights.length} selected
              </span>
            )}
          </p>
          {selectedFlights.length >= 2 && (
            <Button
              variant="primary"
              size="sm"
              className="mt-2"
              onClick={() => {
                console.log("Compare flights:", selectedFlights);
              }}
            >
              Compare Selected Flights
            </Button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {flights.map((flight, index) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={() => onSelectFlight?.(flight)}
            compareMode={compareMode}
            isSelectedForCompare={selectedFlights.includes(flight.id)}
            onSelectForCompare={() => handleSelectForCompare(flight.id)}
            index={index}
          />
        ))}
      </div>

      {flights.length >= 20 && (
        <div className="flex justify-center pt-6">
          <Button variant="outline" size="lg">
            Load More Flights
          </Button>
        </div>
      )}
    </div>
  );
};
