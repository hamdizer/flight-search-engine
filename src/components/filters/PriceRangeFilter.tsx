import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../utils/helpers";

export interface PriceRangeFilterProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  currency?: string;
  showStats?: boolean;
  className?: string;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  value,
  min,
  max,
  onChange,
  showStats = true,
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const savings = max - value;

  return (
    <div className={cn("pb-6 border-b border-gray-200", className)}>
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-gray-600" />
        <label className="text-sm font-medium text-gray-700">Price Range</label>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-600">
            ${value.toLocaleString()}
          </span>
          {showStats && savings > 0 && (
            <span className="text-sm text-green-600 font-medium">
              Save ${savings.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Maximum price per ticket</p>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <div className="flex flex-col items-start">
            <span className="font-medium">${min.toLocaleString()}</span>
            <span className="text-gray-400">Min</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium">${max.toLocaleString()}</span>
            <span className="text-gray-400">Max</span>
          </div>
        </div>
      </div>

      {showStats && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-1 text-green-600 mb-1">
              <TrendingDown className="w-3 h-3" />
              <span className="text-xs font-medium">Cheapest</span>
            </div>
            <p className="text-lg font-bold text-gray-900">${min}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center gap-1 text-orange-600 mb-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-medium">Most Expensive</span>
            </div>
            <p className="text-lg font-bold text-gray-900">${max}</p>
          </div>
        </div>
      )}
    </div>
  );
};
