import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const loggedUser = req.cookies.get("logged_user")?.value;
  const { pathname } = req.nextUrl;

  if (
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/password" ||
      pathname === "/resetPassword") &&
    loggedUser === "true"
  ) {
    return NextResponse.redirect(new URL("/teste", req.url));
  }

  if (pathname === "/teste" && loggedUser !== "true") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    pathname.startsWith("/resetPassword") &&
    !req.nextUrl.searchParams.get("token")
  ) {
    return NextResponse.redirect(new URL("/password", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/teste",
    "/password",
    "/resetPassword",
    "/resetPassword/:path*",
  ],
};
