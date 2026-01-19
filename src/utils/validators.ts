import {
  parseISO,
  isBefore,
  isAfter,
  addDays,
  startOfDay,
  isValid,
} from "date-fns";
import type { SearchFormData } from "../types/search.types";
import type {
  ContactInfo,
  Passenger,
  PaymentInfo,
} from "../types/booking.types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateSearchForm(data: SearchFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.origin || data.origin.trim() === "") {
    errors.origin = "Please select an origin airport";
  } else if (!isValidAirportCode(data.origin)) {
    errors.origin = "Invalid airport code";
  }

  if (!data.destination || data.destination.trim() === "") {
    errors.destination = "Please select a destination airport";
  } else if (!isValidAirportCode(data.destination)) {
    errors.destination = "Invalid airport code";
  }

  if (data.origin && data.destination && data.origin === data.destination) {
    errors.destination = "Origin and destination must be different";
  }

  if (!data.departureDate) {
    errors.departureDate = "Please select a departure date";
  } else {
    const today = startOfDay(new Date());
    const departureDate = parseISO(data.departureDate);

    if (!isValid(departureDate)) {
      errors.departureDate = "Invalid date format";
    } else if (isBefore(departureDate, today)) {
      errors.departureDate = "Departure date must be today or in the future";
    } else {
      const maxFutureDate = addDays(today, 365);
      if (isAfter(departureDate, maxFutureDate)) {
        errors.departureDate =
          "Departure date cannot be more than 1 year in the future";
      }
    }
  }

  if (data.tripType === "round-trip") {
    if (!data.returnDate) {
      errors.returnDate = "Please select a return date for round-trip";
    } else if (data.departureDate) {
      const departureDate = parseISO(data.departureDate);
      const returnDate = parseISO(data.returnDate);

      if (!isValid(returnDate)) {
        errors.returnDate = "Invalid date format";
      } else if (isBefore(returnDate, departureDate)) {
        errors.returnDate = "Return date must be after departure date";
      } else if (returnDate.getTime() === departureDate.getTime()) {
        errors.returnDate = "Return date must be different from departure date";
      }
    }
  }

  if (!data.passengers || data.passengers < 1) {
    errors.passengers = "Please select at least 1 passenger";
  } else if (data.passengers > 9) {
    errors.passengers = "Maximum 9 passengers allowed";
  } else if (!Number.isInteger(data.passengers)) {
    errors.passengers = "Number of passengers must be a whole number";
  }

  if (!data.cabinClass) {
    errors.cabinClass = "Please select a cabin class";
  } else {
    const validClasses = ["economy", "premium_economy", "business", "first"];
    if (!validClasses.includes(data.cabinClass)) {
      errors.cabinClass = "Invalid cabin class";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isValidAirportCode(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  return /^[A-Z]{3}$/.test(code.toUpperCase());
}

export function isValidFlightNumber(flightNumber: string): boolean {
  if (!flightNumber || typeof flightNumber !== "string") return false;
  return /^[A-Z]{2}\d{1,4}[A-Z]?$/.test(flightNumber.toUpperCase());
}

export function isValidAirlineCode(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  return /^[A-Z]{2}$/.test(code.toUpperCase());
}

export function isValidDateString(date: string): boolean {
  if (!date || typeof date !== "string") return false;

  try {
    const parsed = parseISO(date);
    return isValid(parsed);
  } catch {
    return false;
  }
}

export function isValidTimeString(time: string): boolean {
  if (!time || typeof time !== "string") return false;
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

export function isDateInPast(date: string): boolean {
  try {
    const dateObj = parseISO(date);
    const today = startOfDay(new Date());
    return isBefore(dateObj, today);
  } catch {
    return false;
  }
}

export function isDateInFuture(date: string): boolean {
  try {
    const dateObj = parseISO(date);
    const today = startOfDay(new Date());
    return isAfter(dateObj, today);
  } catch {
    return false;
  }
}

export function isValidPriceRange(min: number, max: number): boolean {
  return (
    typeof min === "number" &&
    typeof max === "number" &&
    min >= 0 &&
    max > min &&
    max <= 100000 &&
    !isNaN(min) &&
    !isNaN(max)
  );
}

export function isValidPrice(price: number): boolean {
  return (
    typeof price === "number" && price >= 0 && price <= 1000000 && !isNaN(price)
  );
}

export function isValidPassengerCount(count: number): boolean {
  return (
    typeof count === "number" &&
    Number.isInteger(count) &&
    count >= 1 &&
    count <= 9
  );
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (local.length === 0 || domain.length === 0) return false;
  if (local.length > 64 || email.length > 254) return false;

  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;

  const cleaned = phone.replace(/[\s\-()]/g, "");

  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(cleaned);
}

export function isValidPostalCode(code: string, country?: string): boolean {
  if (!code || typeof code !== "string") return false;

  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    FR: /^\d{5}$/,
    DE: /^\d{5}$/,
    JP: /^\d{3}-?\d{4}$/,
  };

  if (country && patterns[country]) {
    return patterns[country].test(code);
  }

  return /^[A-Z0-9]{3,10}$/i.test(code.replace(/[\s-]/g, ""));
}

export function validateContactInfo(info: ContactInfo): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isValidEmail(info.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!isValidPhone(info.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!info.countryCode || info.countryCode.length < 2) {
    errors.countryCode = "Please select a country code";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isValidCardNumber(cardNumber: string): boolean {
  if (!cardNumber || typeof cardNumber !== "string") return false;

  const cleaned = cardNumber.replace(/\s/g, "");

  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function getCardType(cardNumber: string): string | null {
  const cleaned = cardNumber.replace(/\s/g, "");

  const patterns: Record<string, RegExp> = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    dinersclub: /^3(?:0[0-5]|[68])/,
    jcb: /^35/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleaned)) {
      return type;
    }
  }

  return null;
}

export function isValidCVV(cvv: string, cardType?: string): boolean {
  if (!cvv || typeof cvv !== "string") return false;

  if (cardType === "amex") {
    return /^\d{4}$/.test(cvv);
  }

  return /^\d{3,4}$/.test(cvv);
}

export function isValidCardExpiry(month: string, year: string): boolean {
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (isNaN(monthNum) || isNaN(yearNum)) return false;
  if (monthNum < 1 || monthNum > 12) return false;

  const fullYear = yearNum < 100 ? 2000 + yearNum : yearNum;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (fullYear < currentYear) return false;
  if (fullYear === currentYear && monthNum < currentMonth) return false;

  if (fullYear > currentYear + 20) return false;

  return true;
}

export function validatePaymentInfo(info: PaymentInfo): ValidationResult {
  const errors: Record<string, string> = {};

  if (info.method === "credit_card" || info.method === "debit_card") {
    if (!info.cardNumber || !isValidCardNumber(info.cardNumber)) {
      errors.cardNumber = "Please enter a valid card number";
    }

    if (!info.cardHolder || info.cardHolder.trim().length < 3) {
      errors.cardHolder = "Please enter the cardholder name";
    }

    if (!info.expiryMonth || !info.expiryYear) {
      errors.expiry = "Please enter the card expiry date";
    } else if (!isValidCardExpiry(info.expiryMonth, info.expiryYear)) {
      errors.expiry = "Card has expired or invalid expiry date";
    }

    if (
      !info.cvv ||
      !isValidCVV(info.cvv, getCardType(info.cardNumber || "") || undefined)
    ) {
      errors.cvv = "Please enter a valid CVV";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePassenger(passenger: Passenger): ValidationResult {
  const errors: Record<string, string> = {};

  if (!passenger.firstName || passenger.firstName.trim().length < 2) {
    errors.firstName = "Please enter first name (minimum 2 characters)";
  }

  if (!passenger.lastName || passenger.lastName.trim().length < 2) {
    errors.lastName = "Please enter last name (minimum 2 characters)";
  }

  if (!passenger.dateOfBirth) {
    errors.dateOfBirth = "Please enter date of birth";
  } else {
    const dob = parseISO(passenger.dateOfBirth);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();

    if (!isValid(dob)) {
      errors.dateOfBirth = "Invalid date format";
    } else if (isAfter(dob, now)) {
      errors.dateOfBirth = "Date of birth cannot be in the future";
    } else {
      if (passenger.type === "adult" && age < 18) {
        errors.dateOfBirth = "Adult passengers must be 18 or older";
      } else if (passenger.type === "child" && (age < 2 || age >= 18)) {
        errors.dateOfBirth = "Children must be between 2 and 17 years old";
      } else if (passenger.type === "infant" && age >= 2) {
        errors.dateOfBirth = "Infants must be under 2 years old";
      }
    }
  }

  if (passenger.passportNumber) {
    if (!isValidPassport(passenger.passportNumber)) {
      errors.passportNumber = "Invalid passport number format";
    }

    if (passenger.passportExpiry && isDateInPast(passenger.passportExpiry)) {
      errors.passportExpiry = "Passport has expired";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isValidPassport(passport: string): boolean {
  if (!passport || typeof passport !== "string") return false;

  return /^[A-Z0-9]{6,9}$/i.test(passport.replace(/\s/g, ""));
}

export function isValidFrequentFlyerNumber(number: string): boolean {
  if (!number || typeof number !== "string") return false;

  return /^[A-Z0-9]{6,12}$/i.test(number.replace(/\s/g, ""));
}

export function isValidName(name: string): boolean {
  if (!name || typeof name !== "string") return false;

  const trimmed = name.trim();

  return /^[a-zA-Z\s\-']{2,50}$/.test(trimmed);
}

export function isValidUsername(username: string): boolean {
  if (!username || typeof username !== "string") return false;

  return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}

export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeString(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "");
}

export function isValidPassword(password: string): {
  isValid: boolean;
  strength: "weak" | "medium" | "strong";
  errors: string[];
} {
  const errors: string[] = [];
  let strength: "weak" | "medium" | "strong" = "weak";

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = "strong";
    } else {
      strength = "medium";
    }
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

export function validateFields(
  fields: Record<string, unknown>,
  rules: Record<string, (value: unknown) => boolean | string>,
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [field, value] of Object.entries(fields)) {
    const rule = rules[field];
    if (rule) {
      const result = rule(value);
      if (typeof result === "string") {
        errors[field] = result;
      } else if (result === false) {
        errors[field] = `Invalid ${field}`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
