import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

const users = [
  { id: 1, name: 'Ana García' },
  { id: 2, name: 'Carlos López' },
];

app.get('/', (_req, res) => {
  res.json({ message: 'API funcionando', version: '1.0.0' });
});

app.get('/users', (_req, res) => {
  res.json(users);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${PORT}`);
});
