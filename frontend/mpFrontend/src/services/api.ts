// src/services/api.ts
import { getApiBaseUrl } from "../utils/getEnv.ts";

const API_BASE = getApiBaseUrl();

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  token?: string;
  headers?: Record<string, string>;
}

// Función genérica que hace fetch y regresa JSON o lanza error
async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const { method = "GET", body, token, headers: customHeaders } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders, // merge custom headers (e.g., correoElectronico)
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    // Si el API retorna un error HTTP (4xx o 5xx), leer mensaje y lanzar
    const errorData = await res.json().catch(() => ({}));
    const msg = (errorData.message as string) || res.statusText;
    throw new Error(`Error ${res.status}: ${msg}`);
  }

  // Asumimos que siempre regresará JSON válido
  return (await res.json()) as T;
}

export { request };