// series.model.ts
// ViewModel — forma que necesita la UI.
// No depende de la API ni del framework.

export interface Series {
  id: number;
  title: string;
  genre: string;
  year: string;
  votes: number;
}
