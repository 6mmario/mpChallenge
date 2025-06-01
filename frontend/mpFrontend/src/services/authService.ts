// src/services/authService.ts
import type { Fiscal } from "../models/Fiscal";
import type { User } from "../models/User";
import { request } from "./api";


// Función para hacer login
export async function login(credentials: User): Promise<Fiscal> {
  console.log(`Petion para login /usuario/auth`)
  return request<Fiscal>("/usuario/auth", {
    method: "POST",
    body: credentials,
  });
}

// Función para cerrar sesión (opcional, depende de tu API)
// Puede ser tan simple como quitar el token del localStorage por el frontend