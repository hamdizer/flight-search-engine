import React from "react";
import { cn } from "../../utils/helpers";

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  paddingY?: boolean;
  paddingX?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = "xl",
  paddingY = true,
  paddingX = true,
}) => {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto",
        sizes[size],
        paddingX && "px-4 sm:px-6 lg:px-8",
        paddingY && "py-6 sm:py-8",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const Section: React.FC<{
  children: React.ReactNode;
  className?: string;
  background?: "white" | "gray" | "gradient" | "none";
  paddingY?: "sm" | "md" | "lg" | "xl";
}> = ({ children, className, background = "none", paddingY = "md" }) => {
  const backgrounds = {
    white: "bg-white",
    gray: "bg-gray-50",
    gradient: "bg-gradient-to-br from-blue-50 via-white to-purple-50",
    none: "",
  };

  const paddings = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-24",
  };

  return (
    <section
      className={cn(backgrounds[background], paddings[paddingY], className)}
    >
      {children}
    </section>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  shadow?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}> = ({
  children,
  className,
  padding = "md",
  shadow = "lg",
  hover = false,
}) => {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const shadows = {
    sm: "shadow",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200",
        paddings[padding],
        shadows[shadow],
        hover && "hover:shadow-xl transition-shadow duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
};
