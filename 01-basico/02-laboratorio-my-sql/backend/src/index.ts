import express, { Request, Response } from "express";
import mysql, { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

const app = express();
app.use(express.json());

interface SeriesRow extends RowDataPacket {
  id: number;
  title: string;
  genre: string | null;
  year: number | null;
  votes: number;
  created_at: Date;
}

const dbConfig = {
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "seriesrank123",
  database: process.env.DB_NAME ?? "seriesrank",
  waitForConnections: true,
  connectionLimit: 10,
};

async function createPool(retries = 15): Promise<Pool> {
  for (let i = 0; i < retries; i++) {
    try {
      const pool = mysql.createPool(dbConfig);
      await pool.query("SELECT 1");
      console.log("✅ Conexión a base de datos establecida");
      return pool;
    } catch {
      console.log(`⏳ Esperando a la base de datos... (${i + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw new Error("No se pudo conectar a la base de datos");
}

(async () => {
  const pool = await createPool();

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.get("/api/series", async (_req: Request, res: Response) => {
    try {
      const [rows] = await pool.query<SeriesRow[]>(
        "SELECT * FROM series ORDER BY votes DESC, title ASC",
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post("/api/series", async (req: Request, res: Response) => {
    const { title, genre, year } = req.body as {
      title?: string;
      genre?: string | null;
      year?: number | null;
    };

    if (!title?.trim()) {
      res.status(400).json({ error: 'El campo "title" es obligatorio' });
      return;
    }

    try {
      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO series (title, genre, year) VALUES (?, ?, ?)",
        [title.trim(), genre?.trim() ?? null, year ?? null],
      );
      const [rows] = await pool.query<SeriesRow[]>(
        "SELECT * FROM series WHERE id = ?",
        [result.insertId],
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post("/api/series/:id/vote", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "ID no válido" });
      return;
    }

    try {
      const [info] = await pool.query<ResultSetHeader>(
        "UPDATE series SET votes = votes + 1 WHERE id = ?",
        [id],
      );
      if (info.affectedRows === 0) {
        res.status(404).json({ error: "Serie no encontrada" });
        return;
      }
      const [rows] = await pool.query<SeriesRow[]>(
        "SELECT * FROM series WHERE id = ?",
        [id],
      );
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.listen(3000, () => {
    console.log("Servidor arrancado en http://localhost:3000");
  });
})();
