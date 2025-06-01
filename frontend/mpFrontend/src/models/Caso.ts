export interface Caso {
    CasoID: number;
    Estado: string;
    Progreso: string;
    Descripcion: string;
    FechaRegistro: string;
    FechaUltimaActualizacion: string | null;
    FiscalID: number;
  }