import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ar"] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.match(/\.[^/]+$/)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (!firstSegment || !locales.includes(firstSegment as (typeof locales)[number])) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set("melbet-locale", "en");
    return response;
  }

  const response = NextResponse.next();
  response.cookies.set("melbet-locale", firstSegment);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
