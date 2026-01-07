export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const doFetch = () =>
    fetch(input, {
      ...init,
      credentials: "include",
    });

  let res = await doFetch();

  if (res.status !== 401) return res;

  // tenta refresh
  const refresh = await fetch("http://localhost:8000/auth/refresh-token", {
    method: "POST",
    credentials: "include",
  });

  if (!refresh.ok) return res;

  // tenta novamente 1x
  res = await doFetch();
  return res;
}
