const viteEnv = (import.meta as { env?: Record<string, string | undefined> }).env;
const API_BASE_URL = viteEnv?.VITE_API_BASE_URL ?? process.env.REACT_APP_API_BASE_URL ?? "";

export const getApiUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(getApiUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const errorText = await response.text();
    const suffix = errorText ? `: ${errorText}` : "";
    throw new Error(`HTTP_${response.status}${suffix}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return (response.text() as unknown) as T;
}
