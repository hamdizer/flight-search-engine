import React, { useState, useRef } from "react";
import { MapPin, Plane, Search as SearchIcon, X } from "lucide-react";
import { AIRPORTS } from "../../utils/contants";
import { cn } from "../../utils/helpers";
import useClickOutside from "../../hooks/useClickOutside";

interface SearchInputProps {
  type: "origin" | "destination";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onBlur?: () => void;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  type,
  value,
  onChange,
  error,
  onBlur,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const label = type === "origin" ? "From" : "To";
  const placeholder = type === "origin" ? "Origin" : "Destination";

  const filteredAirports = AIRPORTS.filter((airport) => {
    const query = searchQuery.toLowerCase();
    return (
      airport.code.toLowerCase().includes(query) ||
      airport.name.toLowerCase().includes(query) ||
      airport.city.toLowerCase().includes(query)
    );
  }).slice(0, 8);

  const selectedAirport = AIRPORTS.find((a) => a.code === value);
  const displayText = selectedAirport
    ? `${selectedAirport.code} - ${selectedAirport.city}`
    : "";

  const handleSelect = (airportCode: string) => {
    onChange(airportCode);
    setIsOpen(false);
    setSearchQuery("");
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange("");
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredAirports.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredAirports[highlightedIndex]) {
          handleSelect(filteredAirports[highlightedIndex].code);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : displayText}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-3 border rounded-lg transition-colors",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            error ? "border-red-500" : "border-gray-300",
            "bg-white",
          )}
        />

        {value && !isOpen && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isOpen && (
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}

        {isOpen && filteredAirports.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
          >
            {filteredAirports.map((airport, index) => (
              <button
                key={airport.code}
                type="button"
                onClick={() => handleSelect(airport.code)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-start gap-3",
                  index === highlightedIndex && "bg-blue-50",
                  index !== filteredAirports.length - 1 &&
                    "border-b border-gray-100",
                )}
              >
                <Plane className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {airport.code}
                    </span>
                    <span className="text-sm text-gray-500">
                      {airport.city}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {airport.name}
                  </p>
                  <p className="text-xs text-gray-400">{airport.country}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {isOpen && searchQuery && filteredAirports.length === 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center">
            <p className="text-sm text-gray-500">No airports found</p>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
