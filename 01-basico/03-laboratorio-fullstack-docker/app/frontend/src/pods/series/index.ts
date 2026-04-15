// index.ts
// Superficie pública del pod series.
// Sólo se exporta lo que otras partes de la app (páginas, layouts)
// necesitan conocer. Nada interno sale de aquí sin pasar por este fichero.

export { default as SeriesPod } from "./series.pod.astro";
