import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import fs from 'node:fs';
import path from 'node:path';

const app = new Hono();

const STATIC_FILES_PATH = './public';

// Servimos todos los estáticos de la carpeta ./public
app.use('/*', serveStatic({ root: STATIC_FILES_PATH }));

// Redirigimos cualquier ruta directa hacia la raíz (útil por si el usuario recarga en una sub-ruta del front)
app.get('*', (c) => {
  const html = fs.readFileSync(
    path.resolve(STATIC_FILES_PATH, 'index.html'),
    'utf-8'
  );
  return c.html(html);
});

const port = process.env.PORT || 8081;

console.log(`App running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
