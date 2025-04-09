import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const loggedUser = req.cookies.get("logged_user")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Se estiver logado, verifica expiração
  if (loggedUser) {
    const loggedTime = parseInt(loggedUser);
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000;
    const timeDiff = now - loggedTime;

    console.log(
      `[Middleware] Tempo desde login: ${Math.floor(timeDiff / 1000)}s`
    );

    if (timeDiff > twoMinutes) {
      console.log(`[Middleware] Sessão expirada - redirecionando para refresh`);

      const refreshUrl = new URL("/auth/refresh-token", req.url);
      refreshUrl.searchParams.set("next", pathname);

      const response = NextResponse.redirect(refreshUrl);
      response.cookies.delete("access_token");
      response.cookies.delete("logged_user");

      return response;
    } else {
      console.log(`[Middleware] Sessão válida`);
    }
  }

  // Se já estiver logado, redireciona de volta se tentar acessar rotas públicas
  if (
    ["/login", "/register", "/password", "/resetPassword"].includes(pathname) &&
    loggedUser
  ) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Proteção de token em resetPassword
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
    "/home",
    "/password",
    "/resetPassword",
    "/resetPassword/:path*",
  ],
};
