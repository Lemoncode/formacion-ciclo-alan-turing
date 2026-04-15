// series.business.ts
// Lógica de negocio pura — sin framework, sin DOM, sin fetch.
// Funciones fácilmente testeables de forma unitaria.

import type { Series } from "./series.model";

export function sortByVotes(series: Series[]): Series[] {
  return [...series].sort(
    (a, b) => b.votes - a.votes || a.title.localeCompare(b.title),
  );
}

export function rankLabel(position: number): string {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  return `#${position}`;
}

export function genreColorIndex(genre: string): number {
  // Hash determinista para asignar siempre el mismo color a un género
  let hash = 0;
  for (const ch of genre) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return hash % 5;
}
