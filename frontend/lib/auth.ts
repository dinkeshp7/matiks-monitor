const TOKEN_KEY = "matiks_token";
const TOKEN_COOKIE = "matiks_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${8 * 60 * 60}`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
