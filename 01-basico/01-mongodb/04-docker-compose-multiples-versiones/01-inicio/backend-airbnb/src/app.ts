import { Hono } from "hono";
import { cors } from "hono/cors";
import { getListings, getPropertyTypes } from "./listings";

export const app = new Hono();

app.use("/*", cors());

app.get("/api/listings", async (c) => {
  const propertyType = c.req.query("propertyType") || "";
  const listings = await getListings(propertyType);
  return c.json(listings);
});

app.get("/api/property-types", async (c) => {
  const types = await getPropertyTypes();
  return c.json(types);
});
