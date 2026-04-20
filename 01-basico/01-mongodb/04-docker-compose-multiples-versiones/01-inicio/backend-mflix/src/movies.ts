import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "sample_mflix";

const client = new MongoClient(uri);

const getCollection = async () => {
  await client.connect();
  return client.db(dbName).collection("movies");
};

interface DbMovie {
  _id: unknown;
  title?: string;
  year?: number;
  poster?: string;
  plot?: string;
  genres?: string[];
  imdb?: { rating?: number };
}

const mapMovie = (doc: DbMovie) => ({
  id: String(doc._id),
  title: doc.title ?? "",
  year: doc.year ?? 0,
  poster: doc.poster ?? "",
  plot: doc.plot ?? "",
  genres: doc.genres ?? [],
  imdbRating: doc.imdb?.rating ?? 0,
});

export const getMovies = async (search: string) => {
  const collection = await getCollection();

  const filter = search ? { title: { $regex: search, $options: "i" } } : {};

  const docs = await collection
    .find(filter)
    .project<DbMovie>({
      _id: 1,
      title: 1,
      year: 1,
      poster: 1,
      plot: 1,
      genres: 1,
      "imdb.rating": 1,
    })
    .limit(50)
    .toArray();

  return docs.map(mapMovie);
};
