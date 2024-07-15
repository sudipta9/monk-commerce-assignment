export const dynamic = "force-dynamic"; // defaults to auto

import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // get url query params
  const searchQuery = request.nextUrl.searchParams;

  const search = searchQuery.get("search") ?? "";
  const page = searchQuery.get("page") ?? "1";
  const limit = searchQuery.get("limit") ?? "10";

  const res = await fetch(
    `${process.env.MONKCOMMERCE_API_HOST}?search=${search}&page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "x-api-key": process.env.MONKCOMMERCE_API_KEY!,
      },
    }
  );

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
