import React, { useState, useMemo } from "react";
import { Plane, Search, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../utils/helpers";
import { Checkbox } from "../common/Checkbox";

export interface AirlineFilterProps {
  airlines: string[];
  selectedAirlines: string[];
  onToggle: (airline: string) => void;
  className?: string;
  collapsible?: boolean;
  searchable?: boolean;
  showCount?: boolean;
}

export const AirlineFilter: React.FC<AirlineFilterProps> = ({
  airlines,
  selectedAirlines,
  onToggle,
  className,
  collapsible = false,
  searchable = true,
  showCount = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAirlines = useMemo(() => {
    if (!searchQuery.trim()) {
      return airlines;
    }

    const query = searchQuery.toLowerCase();
    return airlines.filter((airline) => airline.toLowerCase().includes(query));
  }, [airlines, searchQuery]);

  const sortedAirlines = useMemo(() => {
    return [...filteredAirlines].sort((a, b) => {
      const aSelected = selectedAirlines.includes(a);
      const bSelected = selectedAirlines.includes(b);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      return a.localeCompare(b);
    });
  }, [filteredAirlines, selectedAirlines]);

  if (airlines.length === 0) {
    return null;
  }

  const handleToggleAll = () => {
    if (selectedAirlines.length === airlines.length) {
      selectedAirlines.forEach((airline) => onToggle(airline));
    } else {
      airlines.forEach((airline) => {
        if (!selectedAirlines.includes(airline)) {
          onToggle(airline);
        }
      });
    }
  };

  const allSelected = selectedAirlines.length === airlines.length;

  return (
    <div className={cn("pb-6 border-b border-gray-200", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Airlines</label>
          {showCount && selectedAirlines.length > 0 && (
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
              {selectedAirlines.length}
            </span>
          )}
        </div>

        {collapsible && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {(!collapsible || isExpanded) && (
        <div className="space-y-3">
          {searchable && airlines.length > 5 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search airlines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {airlines.length > 3 && !searchQuery && (
            <div className="pb-2 border-b border-gray-100">
              <button
                onClick={handleToggleAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
          )}

          <div
            className={cn(
              "space-y-2",
              airlines.length > 6 &&
                "max-h-64 overflow-y-auto scrollbar-thin pr-2",
            )}
          >
            {sortedAirlines.length === 0 ? (
              <p className="text-sm text-gray-500 py-2 text-center">
                No airlines found
              </p>
            ) : (
              sortedAirlines.map((airline) => (
                <div
                  key={airline}
                  className={cn(
                    "transition-all duration-200",
                    selectedAirlines.includes(airline) &&
                      "bg-blue-50 -mx-2 px-2 py-1 rounded-lg",
                  )}
                >
                  <Checkbox
                    label={airline}
                    checked={selectedAirlines.includes(airline)}
                    onChange={() => onToggle(airline)}
                  />
                </div>
              ))
            )}
          </div>

          {selectedAirlines.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {selectedAirlines.length} of {airlines.length} selected
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CompactAirlineFilter: React.FC<AirlineFilterProps> = ({
  airlines,
  selectedAirlines,
  onToggle,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Airlines</span>
          {selectedAirlines.length > 0 && (
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
              {selectedAirlines.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <AirlineFilter
            airlines={airlines}
            selectedAirlines={selectedAirlines}
            onToggle={onToggle}
            collapsible={false}
            searchable={true}
            showCount={false}
          />
        </div>
      )}
    </div>
  );
};
