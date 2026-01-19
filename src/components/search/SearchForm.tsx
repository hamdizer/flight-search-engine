import React, { useState } from "react";
import { Search, X, Users, Plane, Repeat } from "lucide-react";
import type { SearchFormData } from "../../types/search.types";
import { validateSearchForm } from "../../utils/validators";
import { cn } from "../../utils/helpers";
import { CABIN_CLASSES, PASSENGER_OPTIONS } from "../../utils/contants";
import { Button } from "../common/Button";
import { SearchInput } from "./SearchInput";
import { DatePicker } from "./DatePicker";
import { Select } from "../common/Select";
import type { CabinClass } from "../../types/flight.types";

export interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isLoading?: boolean;
  initialValues?: Partial<SearchFormData>;
  showAdvanced?: boolean;
  compact?: boolean;
  className?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading = false,
  initialValues,
  showAdvanced = false,
  compact = false,
  className,
}) => {
  const [formData, setFormData] = useState<SearchFormData>({
    origin: initialValues?.origin || "",
    destination: initialValues?.destination || "",
    departureDate: initialValues?.departureDate || "",
    returnDate: initialValues?.returnDate || "",
    passengers: initialValues?.passengers || 1,
    cabinClass:
      initialValues?.cabinClass || ("economy" as keyof typeof CabinClass),
    tripType: initialValues?.tripType || "one-way",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(showAdvanced);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSearchForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSearch(formData);
  };

  const updateField = <K extends keyof SearchFormData>(
    field: K,
    value: SearchFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const swapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const clearForm = () => {
    setFormData({
      origin: "",
      destination: "",
      departureDate: "",
      returnDate: "",
      passengers: 1,
      cabinClass: "economy" as keyof typeof CabinClass,
      tripType: "one-way",
    });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "bg-white rounded-2xl shadow-xl border border-gray-200",
        compact ? "p-4" : "p-6 sm:p-8",
        className,
      )}
    >
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => {
            updateField("tripType", "one-way");
            updateField("returnDate", "");
          }}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            formData.tripType === "one-way"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          One-way
        </button>
        <button
          type="button"
          onClick={() => updateField("tripType", "round-trip")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            formData.tripType === "round-trip"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          Round-trip
        </button>
        <button
          type="button"
          onClick={() => updateField("tripType", "multi-city")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            formData.tripType === "multi-city"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          Multi-city
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <SearchInput
            type="origin"
            value={formData.origin}
            onChange={(value) => updateField("origin", value)}
            error={errors.origin}
          />

          {formData.origin && formData.destination && (
            <button
              type="button"
              onClick={swapLocations}
              className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border-2 border-gray-300 rounded-full hover:border-blue-500 hover:text-blue-600 transition-all"
              title="Swap locations"
            >
              <Repeat className="w-3 h-3 mx-auto" />
            </button>
          )}
        </div>

        <SearchInput
          type="destination"
          value={formData.destination}
          onChange={(value) => updateField("destination", value)}
          error={errors.destination}
        />

        <DatePicker
          label="Departure"
          value={formData.departureDate}
          onChange={(value) => updateField("departureDate", value)}
          error={errors.departureDate}
          min={new Date().toISOString().split("T")[0]}
        />

        {formData.tripType === "round-trip" ? (
          <DatePicker
            label="Return"
            value={formData.returnDate || ""}
            onChange={(value) => updateField("returnDate", value)}
            error={errors.returnDate}
            min={
              formData.departureDate || new Date().toISOString().split("T")[0]
            }
          />
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <Select
                value={formData.passengers}
                onChange={(e) =>
                  updateField("passengers", parseInt(e.target.value))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
                options={PASSENGER_OPTIONS}
              />
            </div>
          </div>
        )}
      </div>

      {formData.tripType === "round-trip" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <Select
                value={formData.passengers}
                onChange={(e) =>
                  updateField("passengers", parseInt(e.target.value))
                }
                options={PASSENGER_OPTIONS}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cabin Class
            </label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <Select
                value={formData.cabinClass}
                onChange={(e) =>
                  updateField(
                    "cabinClass",
                    e.target.value as keyof typeof CabinClass,
                  )
                }
                options={CABIN_CLASSES}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {!compact && (
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
        >
          {showAdvancedOptions ? "Hide" : "Show"} advanced options
        </button>
      )}

      {showAdvancedOptions && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.tripType === "one-way" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cabin Class
                </label>
                <Select
                  value={formData.cabinClass}
                  onChange={(e) =>
                    updateField(
                      "cabinClass",
                      e.target.value as keyof typeof CabinClass,
                    )
                  }
                  options={CABIN_CLASSES}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          leftIcon={<Search className="w-5 h-5" />}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Searching..." : "Search Flights"}
        </Button>

        {(formData.origin ||
          formData.destination ||
          formData.departureDate) && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={clearForm}
            leftIcon={<X className="w-5 h-5" />}
            disabled={isLoading}
          >
            Clear
          </Button>
        )}
      </div>

      {formData.origin && formData.destination && (
        <button
          type="button"
          onClick={swapLocations}
          className="md:hidden mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <Repeat className="w-4 h-4" />
          Swap locations
        </button>
      )}
    </form>
  );
};
