import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const loggedUser = req.cookies.get("logged_user")?.value;
  const { pathname } = req.nextUrl;

  console.log(`\n[Middleware] Rota acessada: ${pathname}`);
  console.log(`[Middleware] logged_user: ${loggedUser}`);

  // Verifica apenas se existe um usuário logado
  if (loggedUser) {
    const loggedTime = parseInt(loggedUser);
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000; // 2 minutos em milissegundos
    const timeDiff = now - loggedTime;

    console.log(`[Middleware] Tempo desde login: ${timeDiff}ms (${Math.floor(timeDiff/1000)}s)`);
    console.log(`[Middleware] Limite de expiração: ${twoMinutes}ms (2 minutos)`);

    if (timeDiff > twoMinutes) {
      console.log(`[Middleware] Sessão expirada - redirecionando para refresh`);
      const refreshUrl = new URL("/auth/refresh-token", req.url);
      refreshUrl.searchParams.set("next", pathname);
      
      // Cria resposta de redirecionamento
      const response = NextResponse.redirect(refreshUrl);
      
      // Remove cookies expirados (opcional)
      response.cookies.delete("access_token");
      response.cookies.delete("logged_user");
      
      return response;
    } else {
      console.log(`[Middleware] Sessão válida - permitindo acesso`);
    }
  }

  // Continue com a requisição normalmente se não precisar renovar
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Suas rotas protegidas aqui
    "/dashboard",
    "/profile",
    // Exclui rotas de API e refresh-token
    "/((?!api/refresh-token|_next/static|_next/image|favicon.ico).*)",
  ],
};