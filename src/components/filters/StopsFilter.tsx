import { Plane, Circle } from "lucide-react";
import { cn } from "../../utils/helpers";
import { STOPS_OPTIONS } from "../../utils/contants";
import { Checkbox } from "../common/Checkbox";

export interface StopsFilterProps {
  selectedStops: number[];
  onToggle: (stop: number) => void;
  showIcons?: boolean;
  className?: string;
}

export const StopsFilter: React.FC<StopsFilterProps> = ({
  selectedStops,
  onToggle,
  showIcons = true,
  className,
}) => {
  const getStopIcon = (stops: number) => {
    if (stops === 0) {
      return (
        <div className="flex items-center gap-1">
          <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
          <div className="w-8 h-0.5 bg-blue-600" />
          <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
        </div>
      );
    }
    if (stops === 1) {
      return (
        <div className="flex items-center gap-1">
          <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
          <div className="w-3 h-0.5 bg-blue-600" />
          <Circle className="w-2 h-2 fill-orange-500 text-orange-500" />
          <div className="w-3 h-0.5 bg-blue-600" />
          <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
        <div className="w-2 h-0.5 bg-blue-600" />
        <Circle className="w-2 h-2 fill-orange-500 text-orange-500" />
        <div className="w-2 h-0.5 bg-blue-600" />
        <Circle className="w-2 h-2 fill-orange-500 text-orange-500" />
        <div className="w-2 h-0.5 bg-blue-600" />
        <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
      </div>
    );
  };

  return (
    <div className={cn("pb-6 border-b border-gray-200", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Plane className="w-4 h-4 text-gray-600" />
        <label className="text-sm font-medium text-gray-700">
          Number of Stops
        </label>
      </div>

      <div className="space-y-3">
        {STOPS_OPTIONS.map((option) => (
          <div
            key={option.value}
            className={cn(
              "transition-all duration-200",
              selectedStops.includes(option.value) &&
                "bg-blue-50 -mx-2 px-2 py-2 rounded-lg",
            )}
          >
            <div className="flex items-center justify-between">
              <Checkbox
                label={option.label}
                checked={selectedStops.includes(option.value)}
                onChange={() => onToggle(option.value)}
              />
              {showIcons && (
                <div className="ml-2 opacity-60">
                  {getStopIcon(option.value)}
                </div>
              )}
            </div>

            {selectedStops.includes(option.value) && (
              <p className="text-xs text-gray-500 mt-1 ml-6">
                {option.value === 0 &&
                  "Fastest option, typically more expensive"}
                {option.value === 1 && "Good balance of price and time"}
                {option.value === 2 && "Usually the cheapest option"}
              </p>
            )}
          </div>
        ))}
      </div>

      {selectedStops.length === 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Quick select:</p>
          <div className="flex gap-2">
            <button
              onClick={() => onToggle(0)}
              className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Non-stop only
            </button>
            <button
              onClick={() => {
                STOPS_OPTIONS.forEach((opt) => {
                  if (!selectedStops.includes(opt.value)) {
                    onToggle(opt.value);
                  }
                });
              }}
              className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              All options
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
