import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

export function ping(): string {
  return 'pong';
}

app.get('/ping', (_req, res) => {
  res.json({ status: ping(), timestamp: Date.now() });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor arrancado en http://localhost:${PORT}`);
  });
}
