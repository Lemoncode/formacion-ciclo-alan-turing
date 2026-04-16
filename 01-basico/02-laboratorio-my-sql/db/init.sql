-- Base de datos SeriesRank

CREATE DATABASE IF NOT EXISTS seriesrank CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE seriesrank;

CREATE TABLE IF NOT EXISTS series (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  genre      VARCHAR(100) DEFAULT NULL,
  year       INT          DEFAULT NULL,
  votes      INT          NOT NULL DEFAULT 0,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo — el alumno añadirá los suyos
INSERT INTO series (title, genre, year, votes) VALUES
  ('Breaking Bad',           'Drama / Thriller',  2008, 42),
  ('Attack on Titan',        'Anime / Acción',     2013, 38),
  ('Squid Game',             'Thriller / Drama',   2021, 35),
  ('The Last of Us',         'Drama / Terror',     2023, 31),
  ('Arcane',                 'Anime / Fantasía',   2021, 29),
  ('Stranger Things',        'Sci-Fi / Terror',    2016, 25),
  ('Cyberpunk: Edgerunners', 'Anime / Sci-Fi',     2022, 24),
  ('House of the Dragon',    'Fantasía / Drama',   2022, 18),
  ('Demon Slayer',           'Anime / Acción',     2019, 17),
  ('The Bear',               'Drama / Comedia',    2022, 15);

