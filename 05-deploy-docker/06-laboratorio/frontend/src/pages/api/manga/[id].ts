import type { APIRoute } from "astro";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export const GET: APIRoute = async ({ params }) => {
  const response = await fetch(`${API_URL}/api/manga/${params.id}`);
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const response = await fetch(`${API_URL}/api/manga/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const response = await fetch(`${API_URL}/api/manga/${params.id}`, {
    method: "DELETE",
  });
  return new Response(null, { status: response.status });
};
