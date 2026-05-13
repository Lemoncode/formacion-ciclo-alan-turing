import type { APIRoute } from "astro";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export const GET: APIRoute = async ({ url }) => {
  const params = url.searchParams.toString();
  const response = await fetch(`${API_URL}/api/manga?${params}`);
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const response = await fetch(`${API_URL}/api/manga`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
};
