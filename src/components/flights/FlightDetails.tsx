import {
  Wifi,
  Tv,
  Zap,
  UtensilsCrossed,
  Armchair,
  CheckCircle,
  Luggage,
  Clock as ClockIcon,
  Info,
} from "lucide-react";
import { cn } from "../../utils/helpers";
import { formatDate } from "../../utils/formatters";
import type { Flight } from "../../types/flight.types";

export interface FlightDetailsProps {
  flight: Flight;
  className?: string;
}

export const FlightDetails: React.FC<FlightDetailsProps> = ({
  flight,
  className,
}) => {
  const amenityIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi className="w-4 h-4" />,
    "In-flight Entertainment": <Tv className="w-4 h-4" />,
    "USB Power": <Zap className="w-4 h-4" />,
    "Meals Included": <UtensilsCrossed className="w-4 h-4" />,
    "Extra Legroom": <Armchair className="w-4 h-4" />,
    "Priority Boarding": <CheckCircle className="w-4 h-4" />,
  };

  return (
    <div className={cn("p-6 space-y-6", className)}>
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          Flight Timeline
        </h4>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-20 text-right">
              <p className="font-bold text-gray-900">{flight.departure}</p>
              <p className="text-xs text-gray-500">
                {formatDate(flight.departureDate, "EEE")}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-blue-600 rounded-full mt-1 ring-4 ring-blue-100"></div>
              {flight.stops > 0 && (
                <div className="w-0.5 h-16 bg-gray-300 ml-1.5 mt-1"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{flight.origin}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(flight.departureDate, "MMM dd, yyyy • h:mm a")}
                  </p>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Departure
                </span>
              </div>
              {flight.baggage?.carryOn && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Luggage className="w-3 h-3" />
                  Carry-on bag included
                </p>
              )}
            </div>
          </div>

          {flight.stopLocations &&
            flight.stopLocations.map((stop, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-20 text-right">
                  <p className="text-sm font-medium text-gray-600">Layover</p>
                  <p className="text-xs text-gray-500">
                    {index + 1} of {flight.stops}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 ring-4 ring-orange-100"></div>
                  <div className="w-0.5 h-16 bg-gray-300 ml-1.5 mt-1"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{stop}</p>
                      <p className="text-sm text-gray-500">
                        Connection time: ~2h 30m
                      </p>
                    </div>
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      Stop {index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Remain in terminal for connecting flight
                  </p>
                </div>
              </div>
            ))}

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-20 text-right">
              <p className="font-bold text-gray-900">{flight.arrival}</p>
              <p className="text-xs text-gray-500">
                {formatDate(flight.arrivalDate, "EEE")}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-green-600 rounded-full mt-1 ring-4 ring-green-100"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {flight.destination}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(flight.arrivalDate, "MMM dd, yyyy • h:mm a")}
                  </p>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  Arrival
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total travel time: {flight.duration}
              </p>
            </div>
          </div>
        </div>
      </div>

      {flight.baggage && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Luggage className="w-4 h-4" />
            Baggage Allowance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {flight.baggage.carryOn && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Carry-on</span>
                </div>
                <p className="text-xs text-gray-600">1 bag included</p>
              </div>
            )}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Checked Bags</span>
              </div>
              <p className="text-xs text-gray-600">
                {flight.baggage.checkedBags} bag
                {flight.baggage.checkedBags > 1 ? "s" : ""} included
              </p>
            </div>
            {flight.baggage.weight && (
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-purple-700 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Weight Limit</span>
                </div>
                <p className="text-xs text-gray-600">
                  Up to {flight.baggage.weight}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {flight.amenities && flight.amenities.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Amenities & Services
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {flight.amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3"
              >
                <div className="text-blue-600">
                  {amenityIcons[amenity] || <CheckCircle className="w-4 h-4" />}
                </div>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          Important Information
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>
              Arrive at the airport at least 2 hours before departure for
              domestic flights, 3 hours for international flights.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>
              Flight times are in local time zones. Check your boarding pass for
              gate information.
            </span>
          </p>
          {flight.stops > 0 && (
            <p className="flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>
                This flight includes {flight.stops} stop
                {flight.stops > 1 ? "s" : ""}. Make sure to check connection
                times.
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
