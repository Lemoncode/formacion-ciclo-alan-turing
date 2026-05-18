import express from 'express';

const PORT = process.env.PORT ?? 3000;
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('ERROR: La variable de entorno API_KEY no está definida.');
  process.exit(1);
}

const app = express();

app.get('/status', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${PORT}`);
});
