import React, { useId } from "react";
import { cn } from "../../utils/helpers";
export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, error, id, disabled, ...props }, ref) => {
    const checkboxId = id || `checkbox-${useId}`;

    return (
      <div className="w-full">
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              "w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer",
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors",
              error && "border-red-500",
              className,
            )}
            disabled={disabled}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm text-gray-700 cursor-pointer select-none",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600 ml-6">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 ml-6">{helperText}</p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
