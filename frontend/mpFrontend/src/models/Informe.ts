/**
 * Interfaz para el informe que se enviará al backend.
 */
export interface Informe {
    correoElectronico?: string;
    casoID?: number;
    TipoInforme: string;
    DescripcionBreve: string;
    Estado: string;
    Progreso: string;
  }