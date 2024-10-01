import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  locale: string,
  date?: Date,
  options?: Intl.DateTimeFormatOptions
) {
  if (date === undefined) return
  return new Intl.DateTimeFormat(locale, options).format(date)
}

export function getInitials(name: string | undefined) {
  if (name == undefined) return '?'
  const nameParts = name.split(' ')
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase()
  }
  const firstNameInitial = nameParts[0].charAt(0).toUpperCase()
  const lastNameInitial = nameParts[nameParts.length - 1]
    .charAt(0)
    .toUpperCase()
  return `${firstNameInitial}${lastNameInitial}`
}
