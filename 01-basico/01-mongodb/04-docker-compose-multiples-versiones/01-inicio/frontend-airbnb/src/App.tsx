import { useEffect, useState } from "react";

interface Listing {
  id: string;
  name: string;
  summary: string;
  propertyType: string;
  roomType: string;
  price: number;
  beds: number;
  bathrooms: number;
  pictureUrl: string;
}

const API_URL = "http://localhost:3001/api";

function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  useEffect(() => {
    fetchListings(selectedType);
  }, [selectedType]);

  const fetchPropertyTypes = async () => {
    try {
      const res = await fetch(`${API_URL}/property-types`);
      const data = await res.json();
      setPropertyTypes(data);
    } catch {
      // silently fail — types dropdown just won't show
    }
  };

  const fetchListings = async (propertyType: string) => {
    setLoading(true);
    setError("");
    try {
      const url = propertyType
        ? `${API_URL}/listings?propertyType=${encodeURIComponent(propertyType)}`
        : `${API_URL}/listings`;
      const res = await fetch(url);
      const data = await res.json();
      setListings(data);
    } catch {
      setError(
        "No se pudo conectar con el backend. ¿Está corriendo en el puerto 3001?",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <span className="text-xl font-bold px-4">🏠 Airbnb</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="form-control mb-8 flex justify-center">
          <select
            className="select select-bordered w-full max-w-xs mx-auto"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos los tipos de propiedad</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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

        {!loading && !error && listings.length === 0 && (
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
              <h3 className="font-bold">No hay alojamientos</h3>
              <p className="text-sm">
                Ejecuta{" "}
                <code className="badge badge-neutral badge-sm">
                  mongorestore
                </code>{" "}
                para cargar los datos de airbnb en MongoDB.
              </p>
            </div>
          </div>
        )}

        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow"
              >
                <figure className="h-52 bg-base-300">
                  {listing.pictureUrl ? (
                    <img
                      src={listing.pictureUrl}
                      alt={listing.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-base-content/30 text-4xl">
                      🏠
                    </div>
                  )}
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-sm">{listing.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-base-content/60">
                    <span className="badge badge-primary badge-sm">
                      {listing.propertyType}
                    </span>
                    <span>{listing.roomType}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg">
                      ${listing.price}
                      <span className="text-xs font-normal text-base-content/60">
                        /noche
                      </span>
                    </span>
                    <div className="flex items-center gap-2 text-xs text-base-content/60">
                      <span>🛏 {listing.beds}</span>
                      <span>🚿 {listing.bathrooms}</span>
                    </div>
                  </div>
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
