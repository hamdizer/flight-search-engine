import React from "react";
import { cn } from "../../utils/helpers";
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  size = "md",
}) => {
  const sizes = {
    sm: {
      container: "py-8 px-4",
      iconContainer: "w-12 h-12 mb-3",
      title: "text-base",
      description: "text-sm",
    },
    md: {
      container: "py-12 px-4",
      iconContainer: "w-16 h-16 mb-4",
      title: "text-lg",
      description: "text-base",
    },
    lg: {
      container: "py-16 px-4",
      iconContainer: "w-20 h-20 mb-5",
      title: "text-xl",
      description: "text-lg",
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizes[size].container,
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "bg-gray-100 rounded-full flex items-center justify-center",
            sizes[size].iconContainer,
          )}
        >
          {icon}
        </div>
      )}

      <h3 className={cn("font-semibold text-gray-900 mb-2", sizes[size].title)}>
        {title}
      </h3>

      {description && (
        <p
          className={cn("text-gray-500 max-w-md mb-4", sizes[size].description)}
        >
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
