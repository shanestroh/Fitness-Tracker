const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  if (API_KEY) {
    headers.set("X-API-KEY", API_KEY);
  }

  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  return response;
}