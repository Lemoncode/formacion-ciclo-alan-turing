import { serve } from "@hono/node-server";
import { app } from "./app";

const port = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port }, () => {
  console.log(`🎬 Backend m-flix corriendo en http://localhost:${port}`);
});
