import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date based on the provided locale, date, and options.
 * @param param0 - The locale, date, and options to use for formatting the date.
 * @returns A formatted date string.
 */
export function formatDate({ locale, date, options }: FormatDateProps) {
  if (date === undefined) return
  return new Intl.DateTimeFormat(locale, options).format(date)
}

/**
 * Returns the initials of a name.
 * @param name - The name to get the initials of.
 * @returns The initials of the name.
 */
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

/**
 * Returns the environment in which the application is running.
 * @returns The environment in which the application is running.
 */
export function getEnvironment() {
  if (
    process.env.VERCEL_ENV === 'development' ||
    process.env.NODE_ENV === 'development'
  )
    return 'dev'
  if (process.env.VERCEL_ENV === 'preview') return 'preview'
  else return 'prod'
}

export function getLocale(pathname: string) {
  return pathname.split('/').filter(a => a !== '')[0]
}
