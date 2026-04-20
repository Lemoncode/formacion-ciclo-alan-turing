import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27018";
const dbName = process.env.DB_NAME || "sample_airbnb";

const client = new MongoClient(uri);

const getCollection = async () => {
  await client.connect();
  return client.db(dbName).collection("listingsAndReviews");
};

interface DbListing {
  _id: unknown;
  name?: string;
  summary?: string;
  property_type?: string;
  room_type?: string;
  price?: { toString(): string };
  beds?: number;
  bathrooms?: { toString(): string };
  images?: { picture_url?: string };
}

const mapListing = (doc: DbListing) => ({
  id: String(doc._id),
  name: doc.name ?? "",
  summary: doc.summary ?? "",
  propertyType: doc.property_type ?? "",
  roomType: doc.room_type ?? "",
  price: Number(doc.price?.toString() ?? 0),
  beds: doc.beds ?? 0,
  bathrooms: Number(doc.bathrooms?.toString() ?? 0),
  pictureUrl: doc.images?.picture_url ?? "",
});

export const getListings = async (propertyType: string) => {
  const collection = await getCollection();

  const filter = propertyType ? { property_type: propertyType } : {};

  const docs = await collection
    .find(filter)
    .project<DbListing>({
      _id: 1,
      name: 1,
      summary: 1,
      property_type: 1,
      room_type: 1,
      price: 1,
      beds: 1,
      bathrooms: 1,
      "images.picture_url": 1,
    })
    .limit(50)
    .toArray();

  return docs.map(mapListing);
};

export const getPropertyTypes = async () => {
  const collection = await getCollection();
  const types = await collection.distinct("property_type");
  return types.filter(Boolean).sort();
};
