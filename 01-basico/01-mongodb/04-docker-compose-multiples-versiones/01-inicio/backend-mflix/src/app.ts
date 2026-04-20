import { Hono } from "hono";
import { cors } from "hono/cors";
import { getMovies } from "./movies";

export const app = new Hono();

app.use("/*", cors());

app.get("/api/movies", async (c) => {
  const search = c.req.query("search") || "";
  const movies = await getMovies(search);
  return c.json(movies);
});
