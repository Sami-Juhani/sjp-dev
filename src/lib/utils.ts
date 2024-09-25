import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(locale: string, date?: Date, options?: Intl.DateTimeFormatOptions) {
  if (date === undefined) return
  return new Intl.DateTimeFormat(locale, options).format(date);
}