export interface SeriesApiModel {
  id: number;
  title: string;
  genre: string | null;
  year: number | null;
  votes: number;
  created_at: string;
}
