// src/utils/getEnv.ts
export function getApiBaseUrl(): string {
    const url = import.meta.env.VITE_API_BASE_URL;
    if (!url) {
      throw new Error("La variable VITE_API_BASE_URL no está definida");
    }
    return url as string;
  }