import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get("/ping", (_req, res) => {
  res.json({ status: "pong 2", timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${PORT}`);
});
