import { Hono } from "hono";
import { cors } from "hono/cors";
import { type OrderItem, createOrder, getOrders } from "./orders";

export const app = new Hono();

app.use("/*", cors());

app.get("/api/orders", async (c) => {
  const orders = await getOrders();
  return c.json(orders);
});

app.post("/api/orders", async (c) => {
  const body = await c.req.json<{ items: OrderItem[] }>();
  const order = await createOrder(body.items);
  return c.json(order, 201);
});
