import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const loggedUser = req.cookies.get("logged_user")?.value;
  const { pathname } = req.nextUrl;

  if ((pathname === "/login" || pathname === "/register") && loggedUser === "true") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/teste" && loggedUser !== "true") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/teste"],
};