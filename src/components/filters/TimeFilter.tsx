import {
  Clock,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { cn } from "../../utils/helpers";
import React from "react";
import { TIME_SLOT_OPTIONS } from "../../types/filter.types";
import { Checkbox } from "../common/Checkbox";
import type { TimeSlot } from "../../types/flight.types";

export interface TimeFilterProps {
  type: "departure" | "arrival";
  label?: string;
  selectedTimes: TimeSlot[];
  onToggle: (time: TimeSlot) => void;
  collapsible?: boolean;
  className?: string;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({
  type,
  label,
  selectedTimes,
  onToggle,
  collapsible = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(!collapsible);

  const displayLabel =
    label || (type === "departure" ? "Departure Time" : "Arrival Time");

  const getTimeIcon = (slot: TimeSlot) => {
    switch (slot) {
      case "morning":
        return <Sunrise className="w-4 h-4 text-orange-500" />;
      case "afternoon":
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case "evening":
        return <Sunset className="w-4 h-4 text-orange-600" />;
      case "night":
        return <Moon className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className={cn("pb-6 border-b border-gray-200", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">
            {displayLabel}
          </label>
          {selectedTimes.length > 0 && (
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
              {selectedTimes.length}
            </span>
          )}
        </div>

        {collapsible && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {TIME_SLOT_OPTIONS.map((option) => (
            <div
              key={option.value}
              className={cn(
                "transition-all duration-200",
                selectedTimes.includes(option.value) &&
                  "bg-blue-50 -mx-2 px-2 py-2 rounded-lg",
              )}
            >
              <div className="flex items-center gap-2">
                {getTimeIcon(option.value)}
                <div className="flex-1">
                  <Checkbox
                    label={option.label}
                    checked={selectedTimes.includes(option.value)}
                    onChange={() => onToggle(option.value)}
                  />
                  <p className="text-xs text-gray-500 ml-6">{option.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
