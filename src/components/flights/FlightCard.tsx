import {
  Plane,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingDown,
  Clock,
} from "lucide-react";
import { FlightDetails } from "./FlightDetails";

import { cn } from "../../utils/helpers";
import { useState } from "react";
import { formatPrice, formatStops } from "../../utils/formatters";
import { Button } from "../common/Button";
import type { Flight } from "../../types/flight.types";

export interface FlightCardProps {
  flight: Flight;
  onSelect: () => void;
  compareMode?: boolean;
  isSelectedForCompare?: boolean;
  onSelectForCompare?: () => void;
  index?: number;
  showBadges?: boolean;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  onSelect,
  compareMode = false,
  isSelectedForCompare = false,
  onSelectForCompare,
  index = 0,
  showBadges = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const isGoodDeal = index < 3;
  const isFastest = flight.stops === 0;
  const isCheapest = index === 0;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden",
        isSelectedForCompare && "ring-2 ring-blue-500 border-blue-500",
        compareMode && "cursor-pointer",
      )}
      onClick={compareMode ? onSelectForCompare : undefined}
    >
      {showBadges && (
        <div className="flex gap-2 px-6 pt-4">
          {isCheapest && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              <TrendingDown className="w-3 h-3" />
              Best Price
            </span>
          )}
          {isFastest && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              Fastest
            </span>
          )}
          {isGoodDeal && !isCheapest && !isFastest && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
              <Star className="w-3 h-3" />
              Recommended
            </span>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plane className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {flight.airline}
                </h4>
                <p className="text-sm text-gray-500 truncate">
                  {flight.flightNumber} • {flight.aircraft}
                </p>
              </div>
              {compareMode && (
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isSelectedForCompare}
                    onChange={onSelectForCompare}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {flight.departure}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {flight.origin}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">{flight.duration}</p>
                <div className="relative">
                  <div className="h-0.5 bg-gray-300 w-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                    <Plane className="w-4 h-4 text-gray-400 rotate-90" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {formatStops(flight.stops)}
                </p>
                {flight.stopLocations && flight.stopLocations.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    via {flight.stopLocations.join(", ")}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {flight.arrival}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {flight.destination}
                </p>
              </div>
            </div>

            {flight.amenities && flight.amenities.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {flight.amenities.slice(0, 3).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                  >
                    {amenity}
                  </span>
                ))}
                {flight.amenities.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{flight.amenities.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-3 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
            <div className="text-left lg:text-right flex-1 lg:flex-initial">
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(flight.price, flight.currency)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {flight.availableSeats} seats left
              </p>
              {flight.baggage?.checkedBags && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  {flight.baggage.checkedBags} bag
                  {flight.baggage.checkedBags > 1 ? "s" : ""} included
                </p>
              )}
            </div>

            {!compareMode && (
              <Button
                variant="primary"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="whitespace-nowrap flex-shrink-0"
              >
                Select Flight
              </Button>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className="w-full mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {showDetails ? (
            <>
              Hide details
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show details
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {showDetails && (
        <div className="border-t border-gray-200 bg-gray-50 animate-slide-down">
          <FlightDetails flight={flight} />
        </div>
      )}
    </div>
  );
};
