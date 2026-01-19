import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { StopsFilter } from "./StopsFilter";
import { AirlineFilter } from "./AirlineFilter";
import { TimeFilter } from "./TimeFilter";
import { cn } from "../../utils/helpers";
import { Button } from "../common/Button";
import type { FilterOptions, PriceRange } from "../../types/flight.types";

export interface FilterSidebarProps {
  filters: FilterOptions;
  priceRange: PriceRange;
  airlines: string[];
  activeFilterCount: number;
  onUpdateFilter: <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K],
  ) => void;
  onToggleArrayFilter: <
    K extends keyof Pick<
      FilterOptions,
      "stops" | "airlines" | "departureTime" | "arrivalTime"
    >,
  >(
    key: K,
    value: FilterOptions[K] extends (infer U)[] ? U : never,
  ) => void;
  onClearFilters: () => void;
  className?: string;
  sticky?: boolean;
  collapsible?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  priceRange,
  airlines,
  activeFilterCount,
  onUpdateFilter,
  onToggleArrayFilter,
  onClearFilters,
  className,
  sticky = true,
  collapsible = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg border border-gray-200",
        sticky && "sticky top-24",
        className,
      )}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {(!collapsible || !isCollapsed) && (
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
          <PriceRangeFilter
            value={filters.maxPrice}
            min={priceRange.min}
            max={priceRange.max}
            onChange={(value) => onUpdateFilter("maxPrice", value)}
          />

          <StopsFilter
            selectedStops={filters.stops}
            onToggle={(stop) => onToggleArrayFilter("stops", stop)}
          />

          {airlines.length > 0 && (
            <AirlineFilter
              airlines={airlines}
              selectedAirlines={filters.airlines}
              onToggle={(airline) => onToggleArrayFilter("airlines", airline)}
            />
          )}

          <TimeFilter
            type="departure"
            label="Departure Time"
            selectedTimes={filters.departureTime}
            onToggle={(time) => onToggleArrayFilter("departureTime", time)}
          />

          <TimeFilter
            type="arrival"
            label="Arrival Time"
            selectedTimes={filters.arrivalTime || []}
            onToggle={(time) => onToggleArrayFilter("arrivalTime", time)}
            collapsible={true}
          />
        </div>
      )}

      <div className="p-4 border-t border-gray-200 lg:hidden">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setIsCollapsed(true)}
        >
          Apply Filters
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </Button>
      </div>
    </div>
  );
};

export const MobileFilterModal: React.FC<
  FilterSidebarProps & {
    isOpen: boolean;
    onClose: () => void;
  }
> = ({ isOpen, onClose, ...props }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {props.activeFilterCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                {props.activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <PriceRangeFilter
            value={props.filters.maxPrice}
            min={props.priceRange.min}
            max={props.priceRange.max}
            onChange={(value) => props.onUpdateFilter("maxPrice", value)}
          />

          <StopsFilter
            selectedStops={props.filters.stops}
            onToggle={(stop) => props.onToggleArrayFilter("stops", stop)}
          />

          {props.airlines.length > 0 && (
            <AirlineFilter
              airlines={props.airlines}
              selectedAirlines={props.filters.airlines}
              onToggle={(airline) =>
                props.onToggleArrayFilter("airlines", airline)
              }
            />
          )}

          <TimeFilter
            type="departure"
            label="Departure Time"
            selectedTimes={props.filters.departureTime}
            onToggle={(time) =>
              props.onToggleArrayFilter("departureTime", time)
            }
          />
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          {props.activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={props.onClearFilters}
            >
              Clear All Filters
            </Button>
          )}
          <Button variant="primary" size="lg" fullWidth onClick={onClose}>
            Show Results
          </Button>
        </div>
      </div>
    </div>
  );
};
