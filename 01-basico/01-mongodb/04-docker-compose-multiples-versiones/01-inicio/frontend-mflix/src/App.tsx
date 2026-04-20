import { useEffect, useState } from "react";

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  plot: string;
  genres: string[];
  imdbRating: number;
}

const API_URL = "http://localhost:3000/api/movies";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchMovies = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const url = query
        ? `${API_URL}?search=${encodeURIComponent(query)}`
        : API_URL;
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data);
    } catch {
      setError(
        "No se pudo conectar con el backend. ¿Está corriendo en el puerto 3000?",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <span className="text-xl font-bold px-4">🎬 M-Flix</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="form-control mb-8">
          <input
            type="text"
            placeholder="Buscar películas por título..."
            className="input input-bordered w-full max-w-md mx-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && (
          <div className="alert alert-error max-w-md mx-auto mb-8">
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="alert alert-info max-w-lg mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 className="font-bold">No hay películas</h3>
              <p className="text-sm">
                Ejecuta{" "}
                <code className="badge badge-neutral badge-sm">
                  mongorestore
                </code>{" "}
                para cargar los datos de m-flix en MongoDB.
              </p>
            </div>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow"
              >
                <figure className="h-80 bg-base-300">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-base-content/30 text-4xl">
                      🎬
                    </div>
                  )}
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-sm">{movie.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-base-content/60">
                    <span>{movie.year}</span>
                    {movie.imdbRating > 0 && (
                      <span className="badge badge-warning badge-sm gap-1">
                        ⭐ {movie.imdbRating}
                      </span>
                    )}
                  </div>
                  {movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.genres.slice(0, 3).map((genre) => (
                        <span
                          key={genre}
                          className="badge badge-outline badge-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
