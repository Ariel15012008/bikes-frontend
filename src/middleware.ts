import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/home",
  "/about",
  "/login",
  "/register",
  "/password",
  "/resetPassword",
];

const ACCESS_COOKIE_NAME = "access_token";

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/resetPassword")) return true;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/fonts")
  ) {
    return true;
  }

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const isLogged = Boolean(accessToken);

  // Se já estiver logado e tentar acessar páginas públicas de auth, manda pra /home
  if (isLogged && ["/login", "/register", "/password", "/resetPassword"].includes(pathname)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // ResetPassword exige token na URL
  if (pathname.startsWith("/resetPassword") && !req.nextUrl.searchParams.get("token")) {
    return NextResponse.redirect(new URL("/password", req.url));
  }

  // Protege rotas privadas (tudo que não for público)
  if (!isLogged && !isPublicPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img|fonts).*)"],
};
