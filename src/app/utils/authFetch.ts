export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
    const expirationStr = localStorage.getItem("access_token_expiration");
    const expirationTime = expirationStr ? parseInt(expirationStr) : 0;
    const now = Date.now();
  
    const buffer = 10 * 1000; // 10s antes do fim
    const shouldRefresh = expirationTime && (now >= (expirationTime - buffer));
  
    if (shouldRefresh) {
      console.log("[authFetch] Token quase expirando, tentando renovar...");
      const refresh = await fetch("http://localhost:8000/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });
  
      if (refresh.ok) {
        const data = await refresh.json();
        console.log("[authFetch] Token renovado com sucesso");
  
        // Atualiza nova expiração
        const newExpiration = Date.now() + 2 * 60 * 1000;
        localStorage.setItem("access_token_expiration", newExpiration.toString());
      } else {
        console.error("[authFetch] Falha ao renovar o token, pode precisar relogar");
        // Aqui você poderia redirecionar para login, etc
      }
    }
  
    // Faz a requisição original
    return fetch(input, {
      ...init,
      credentials: "include", // importante
    });
  }
  