import { NextResponse } from "next/server";

const PRIVATE_PATHS = [
  "/admin",
  "/farmer",
  "/login",
  "/register",
  "/search",
];

const FILTER_PARAMETERS = new Set([
  "q",
  "category",
  "tag",
  "season",
  "water",
  "region",
  "type",
  "sort",
  "featured",
  "view",
  "page",
]);

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const isPrivate = PRIVATE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const hasFilterParameters = [...searchParams.keys()].some((key) =>
    FILTER_PARAMETERS.has(key.toLowerCase()),
  );

  if (!isPrivate && !hasFilterParameters) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
