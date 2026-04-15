// api/series.api.ts
// Capa de acceso a datos — todas las llamadas HTTP de este pod.
// Las URLs son relativas: el proxy del dev server de Astro redirige
// /api/* → http://localhost:3000/api/*

import type { SeriesApiModel } from "./series.api-model";

const BASE = "/api";

export async function fetchSeries(): Promise<SeriesApiModel[]> {
  const res = await fetch(`${BASE}/series`);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar series`);
  return res.json() as Promise<SeriesApiModel[]>;
}

export async function voteSeries(id: number): Promise<SeriesApiModel> {
  const res = await fetch(`${BASE}/series/${id}/vote`, { method: "POST" });
  if (!res.ok) throw new Error(`Error ${res.status} al votar`);
  return res.json() as Promise<SeriesApiModel>;
}

export async function addSeries(
  title: string,
  genre: string | null,
  year: number | null,
): Promise<SeriesApiModel> {
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
}
