import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/helpers";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "primary" | "secondary" | "white" | "gray";
  label?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className,
  color = "primary",
  label,
  fullScreen = false,
}) => {
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colors = {
    primary: "text-blue-600",
    secondary: "text-purple-600",
    white: "text-white",
    gray: "text-gray-600",
  };

  const spinner = (
    <Loader2
      className={cn("animate-spin", sizes[size], colors[color], className)}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        <Loader2 className={cn("animate-spin", "w-12 h-12", colors[color])} />
        {label && <p className="mt-4 text-gray-600 font-medium">{label}</p>}
      </div>
    );
  }

  if (label) {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        {spinner}
        <p className="text-sm text-gray-600 font-medium">{label}</p>
      </div>
    );
  }

  return spinner;
};

export const LoadingOverlay: React.FC<{
  children?: React.ReactNode;
  isLoading: boolean;
  label?: string;
}> = ({ children, isLoading, label }) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <Spinner size="lg" label={label} />
      </div>
    </div>
  );
};

export const InlineLoader: React.FC<{
  text?: string;
  size?: SpinnerProps["size"];
}> = ({ text = "Loading...", size = "sm" }) => {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={size} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

export const PageLoader: React.FC<{
  message?: string;
}> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <Spinner size="xl" color="primary" />
      <p className="mt-4 text-lg text-gray-600 font-medium">{message}</p>
    </div>
  );
};
