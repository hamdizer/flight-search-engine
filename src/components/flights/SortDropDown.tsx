import { ArrowUpDown, DollarSign, Clock as ClockIcon2 } from "lucide-react";
import { cn } from "../../utils/helpers";
import { Select } from "../common/Select";
import { SORT_OPTIONS, type SortOption } from "../../types/filter.types";

export interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
  className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  className,
}) => {
  const getSortIcon = (field: SortOption["field"]) => {
    switch (field) {
      case "price":
        return <DollarSign className="w-4 h-4" />;
      case "duration":
        return <ClockIcon2 className="w-4 h-4" />;
      default:
        return <ArrowUpDown className="w-4 h-4" />;
    }
  };

  const options = SORT_OPTIONS.map((option) => ({
    value: `${option.field}-${option.order}`,
    label: option.label,
  }));

  const currentValue = `${value.field}-${value.order}`;

  const handleChange = (newValue: string) => {
    const [field, order] = newValue.split("-") as [
      SortOption["field"],
      SortOption["order"],
    ];
    const option = SORT_OPTIONS.find(
      (opt) => opt.field === field && opt.order === order,
    );
    if (option) {
      onChange(option);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Select
        options={options}
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        leftIcon={getSortIcon(value.field)}
        className="min-w-[200px]"
      />
    </div>
  );
};

export const QuickSortButtons: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  className,
}) => {
  const quickSorts: SortOption[] = [
    { field: "price", order: "asc", label: "Cheapest" },
    { field: "duration", order: "asc", label: "Fastest" },
    { field: "departure", order: "asc", label: "Earliest" },
  ];

  return (
    <div className={cn("flex gap-2", className)}>
      {quickSorts.map((sort) => (
        <button
          key={`${sort.field}-${sort.order}`}
          onClick={() => onChange(sort)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            value.field === sort.field && value.order === sort.order
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          {sort.label}
        </button>
      ))}
    </div>
  );
};
