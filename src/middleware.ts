import { NextRequest, NextResponse } from "next/server"

// Supported locales
const locales = ["en", "fi"]

// Function to get the preferred locale from the request headers
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language")

  if (!acceptLanguage) return "en" // Default locale if none is provided

  // Extract and sort languages by quality value
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const parts = lang.split(";q=")
      return { locale: parts[0], quality: parseFloat(parts[1] || "1") }
    })
    .sort((a, b) => b.quality - a.quality)

  // Find the first supported locale
  for (const lang of languages) {
    if (locales.includes(lang.locale)) {
      return lang.locale
    }
  }

  return "en"
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|robots.txt|sitemap.xml).*)',
    // Optional: only run on root (/) URL
    "/",
  ],
}