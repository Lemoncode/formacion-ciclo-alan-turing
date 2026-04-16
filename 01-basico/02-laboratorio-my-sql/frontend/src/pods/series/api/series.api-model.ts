// api/series.api-model.ts
// DTO — refleja exactamente la forma que devuelve la API REST.
// No se comparte con otros pods.

export interface SeriesApiModel {
  id: number;
  title: string;
  genre: string | null;
  year: number | null;
  votes: number;
  created_at: string;
}
