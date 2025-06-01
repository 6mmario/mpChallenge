import type { Caso } from "../models/Caso";
import type { NuevoCaso } from "../models/NuevoCaso";
import { request } from "./api";

/**
 * Obtiene la lista de casos para un fiscal.
 * @param correoElectronico Correo del fiscal (se envía en el header)
 * @returns Promise<Caso[]> Arreglo de casos
 */
export async function listarCasos(correoElectronico: string): Promise<Caso[]> {
    console.log({'CorreoListar':correoElectronico})
    return request<Caso[]>("/casos", {
      method: "GET",
      headers: {
        correoElectronico,
      },
    });
  }

/**
 * Crea un nuevo caso usando el modelo NuevoCaso.
 * @param nuevoCaso Objeto con correoElectronico y descripcion
 * @returns Promise<{ nuevoCasoId: number }> Respuesta con el ID del caso creado
 */
export async function crearCaso(
  nuevoCaso: NuevoCaso
): Promise<{ nuevoCasoId: number }> {
  return request<{ nuevoCasoId: number }>("/casos/nuevo", {
    method: "POST",
    body: nuevoCaso,
  });
}