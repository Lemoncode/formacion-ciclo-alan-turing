// series.mapper.ts
// Convierte el DTO de la API en el ViewModel que usa la UI.
// Función pura — sin efectos secundarios, sin dependencias de framework.

import type { SeriesApiModel } from "./api/series.api-model";
import type { Series } from "./series.model";

export function mapSeries(raw: SeriesApiModel): Series {
  return {
    id: raw.id,
    title: raw.title,
    genre: raw.genre ?? "—",
    year: raw.year ? String(raw.year) : "—",
    votes: raw.votes,
  };
}
