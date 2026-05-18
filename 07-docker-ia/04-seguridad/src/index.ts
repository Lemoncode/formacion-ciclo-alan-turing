import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get('/status', (_req, res) => {
  res.json({
    version: '1.0.0',
    env: process.env.NODE_ENV ?? 'development',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${PORT}`);
});
