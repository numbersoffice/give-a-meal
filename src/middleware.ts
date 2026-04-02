import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { i18n } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import getProxyOrigin from "./utils/getProxyOrigin";

/**
 * This middleware is only responsible for the frontend and the donor portal
 * It does NOT touch the API and its authentication logic
 */

const pathsWithoutLocale = [
  "/_next/",
  "/api/",
  "/admin",
  "/.well-known/",
  "/apple-app-site-association",
  "/favicon.ico",
  "/sitemap.xml",
  "/robots.txt",
  "/assets/"
];
const protectedPaths = ["/donors/profile"];

export async function middleware(request: NextRequest) {
  const origin = getProxyOrigin(request);
  if (!origin) return NextResponse.next();

  let currentPathname = request.nextUrl.pathname;

  // Skip: paths that should not have a locale
  const shouldExclude = pathsWithoutLocale.some((path) =>
    currentPathname.startsWith(path)
  );

  if (shouldExclude) {
    return NextResponse.next();
  }

  // Locale: paths that are missing a locale
  currentPathname = getPathnameWithLocale(request);

  // Check if path requires authentication
  const pathIsProtected = protectedPaths.some((path) =>
    currentPathname.includes(path)
  );

  if (pathIsProtected) {
    // Redirect to login if no auth cookie is present.
    // Actual token verification happens in the page via payload.auth().
    const hasToken = request.cookies.has("payload-token");
    if (!hasToken) {
      const locale = currentPathname.split("/")[1] || "en";
      const url = new URL(`/${locale}/donors/login`, origin);
      return NextResponse.redirect(url);
    }
  }

  // Pass pathname to server components (used by not-found page for locale detection)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", currentPathname);

  // Prevent redirect if the current pathname is the same as the request pathname
  if (currentPathname === request.nextUrl.pathname) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  } else {
    const slug = currentPathname + request.nextUrl.search;
    const url = new URL(slug, origin);
    return NextResponse.redirect(url);
  }
}

/****************************************************/
/******************** FUNCTIONS *********************/
/****************************************************/

function getPathnameWithLocale(request: NextRequest): string {
  let pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    pathname = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
  }

  return pathname;
}

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = Array.from(i18n.locales);
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );
  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}
