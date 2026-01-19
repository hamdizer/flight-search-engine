import {
  format,
  parseISO,
  differenceInMinutes,
  formatDistance,
  isValid,
} from "date-fns";
import { CURRENCY_SYMBOLS, DATE_FORMATS } from "./contants";

export function formatPrice(price: number, currency: string = "USD"): string {
  const symbol = CURRENCY_SYMBOLS[currency] || "$";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${symbol}${price.toLocaleString()}`;
  }
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export function formatDurationDetailed(minutes: number): string {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (mins > 0) parts.push(`${mins} minute${mins > 1 ? "s" : ""}`);

  return parts.join(", ");
}

export function formatTime(time: string, use24Hour: boolean = false): string {
  try {
    const [hours, minutes] = time.split(":").map(Number);

    if (use24Hour) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch {
    return time;
  }
}

export function formatDate(
  date: string | Date,
  formatStr: string = DATE_FORMATS.MEDIUM,
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return "Invalid date";
    }
    return format(dateObj, formatStr);
  } catch {
    return "Invalid date";
  }
}

export function formatDateRange(startDate: string, endDate?: string): string {
  const start = formatDate(startDate, DATE_FORMATS.SHORT);

  if (!endDate) {
    return start;
  }

  const end = formatDate(endDate, DATE_FORMATS.SHORT);
  return `${start} - ${end}`;
}

export function calculateDuration(departure: string, arrival: string): number {
  try {
    const departureDate = parseISO(departure);
    const arrivalDate = parseISO(arrival);
    return differenceInMinutes(arrivalDate, departureDate);
  } catch {
    return 0;
  }
}

export function getTimeSlot(
  hour: number,
): "morning" | "afternoon" | "evening" | "night" {
  if (hour >= 0 && hour < 6) return "night";
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
}

export function formatStops(stops: number): string {
  if (stops === 0) return "Non-stop";
  if (stops === 1) return "1 Stop";
  return `${stops} Stops`;
}

export function formatAirport(code: string, city: string): string {
  return `${code} - ${city}`;
}

export function getRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch {
    return "Unknown time";
  }
}

export function formatFileSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}
