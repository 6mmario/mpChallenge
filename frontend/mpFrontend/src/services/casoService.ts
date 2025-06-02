import type { Caso } from "../models/Caso";
import type { Fiscal } from "../models/Fiscal";
import type { Informe } from "../models/Informe";
import type { NuevoCaso } from "../models/NuevoCaso";
import type { Reasignar } from "../models/Reasignar";
import { request } from "./api";

/**
 * Obtiene la lista de casos para un fiscal.
 * @param correoElectronico Correo del fiscal (se envía en el header)
 * @returns Promise<Caso[]> Arreglo de casos
 */
export async function listarCasos(correoElectronico: string): Promise<Caso[]> {
  console.log({ CorreoListar: correoElectronico });
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

/**
 * Envía un nuevo informe asociado a un caso.
 * @param informe Datos del informe excepto correoElectronico y casoID.
 * @param correoElectronico Correo del fiscal logueado.
 * @param casoID ID del caso al que se le agrega el informe.
 * @returns Promise<{ nuevoInformeID: number }> ID del informe creado.
 */
export async function agregarInforme(
  informe: Omit<Informe, "correoElectronico" | "casoID">,
  correoElectronico: string,
  casoID: number
): Promise<{ nuevoInformeID: number }> {
  return request<{ nuevoInformeID: number }>("/casos/informe", {
    method: "POST",
    headers: {
      correoElectronico,
      idCaso: casoID.toString(),
    },
    body: informe,
  });
}

/**
 * Obtener lista de fiscales.
 */
export async function listarFiscales(): Promise<Fiscal[]> {
  return request<Fiscal[]>("/fiscales", {
    method: "GET",
  });
}

/**
 * Reasignar un caso a otro fiscal.
 */
export async function reasignarCaso(
  casoID: number,
  nuevoFiscalID: number
): Promise<{ mensaje: string }> {
  const reas: Reasignar = { casoID, nuevoFiscalID };
  console.table(reas);
  return request<{ mensaje: string }>("/casos/reasignar", {
    method: "POST",
    body: reas,
  });
}
