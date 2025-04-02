import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const loggedUser = req.cookies.get("logged_user")?.value;
  const { pathname } = req.nextUrl;

  // Redireciona para refresh_token se tempo de sessão passou de 10 minutos
  if (loggedUser) {
    const loggedTime = parseInt(loggedUser); // timestamp em ms
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (now - loggedTime > tenMinutes) {
      const refreshUrl = new URL("/api/refresh-token", req.url);
      refreshUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(refreshUrl);
    }
  }

  // Rotas públicas não acessíveis se já estiver logado
  if (
    ["/login", "/register", "/password", "/resetPassword"].includes(pathname) &&
    loggedUser
  ) {
    return NextResponse.redirect(new URL("/teste", req.url));
  }

  // Rota privada sem login
  if (pathname === "/teste" && !loggedUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Bloqueia reset sem token
  if (pathname.startsWith("/resetPassword") && !req.nextUrl.searchParams.get("token")) {
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
    "/((?!_next|api|favicon.ico).*)",
  ],
};
