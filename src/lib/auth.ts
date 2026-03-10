const TOKEN_COOKIE_NAME = "ecofirst_token";
const TOKEN_STORAGE_KEY = "ecofirst_token";

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  const parts = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  if (!parts) return null;
  return decodeURIComponent(parts.slice(name.length + 1));
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const localToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (localToken) return localToken;

  return getCookieValue(TOKEN_COOKIE_NAME);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; SameSite=Lax${secure}`;
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  document.cookie = `${TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export { TOKEN_COOKIE_NAME };
