import type { SeriesApiModel } from "./series.api-model";

const BASE = "/api";

export const fetchSeries = async (): Promise<SeriesApiModel[]> => {
  const res = await fetch(`${BASE}/series`);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar series`);
  return res.json() as Promise<SeriesApiModel[]>;
};

export const voteSeries = async (id: number): Promise<SeriesApiModel> => {
  const res = await fetch(`${BASE}/series/${id}/vote`, { method: "POST" });
  if (!res.ok) throw new Error(`Error ${res.status} al votar`);
  return res.json() as Promise<SeriesApiModel>;
};

export const addSeries = async (
  title: string,
  genre: string | null,
  year: number | null,
): Promise<SeriesApiModel> => {
  const res = await fetch(`${BASE}/series`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, genre, year }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? `Error ${res.status}`);
  }
  return res.json() as Promise<SeriesApiModel>;
};
