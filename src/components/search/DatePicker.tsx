import { Calendar } from "lucide-react";
import { cn } from "../../utils/helpers";
import { formatDate } from "../../utils/formatters";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  min?: string;
  max?: string;
  className?: string;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
  className,
  disabled = false,
}) => {
  return (
    <div className={cn("relative", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          disabled={disabled}
          className={cn(
            "w-full pl-10 pr-4 py-3 border rounded-lg transition-colors",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            error ? "border-red-500" : "border-gray-300",
            "bg-white",
          )}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {value && (
        <p className="mt-1 text-xs text-gray-500">
          {formatDate(value, "EEEE, MMMM dd, yyyy")}
        </p>
      )}
    </div>
  );
};
