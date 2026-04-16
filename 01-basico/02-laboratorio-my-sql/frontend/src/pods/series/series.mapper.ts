import type { SeriesApiModel } from "./api/series.api-model";
import type { Series } from "./series.model";

export const mapSeries = (raw: SeriesApiModel): Series => ({
  id: raw.id,
  title: raw.title,
  genre: raw.genre ?? "—",
  year: raw.year ? String(raw.year) : "—",
  votes: raw.votes,
});
