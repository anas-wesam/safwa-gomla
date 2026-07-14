import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function checkAuth(req: NextRequest) {
  return req.headers.get("x-admin-token") === "gomla123";
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const sql = getDb();
    const body = await req.json();
    const { name, price, unit, min_order, pieces_per_carton, discount, category, image_url, description } = body;
    const result = await sql`
      INSERT INTO products (name, price, unit, min_order, pieces_per_carton, discount, category, image, description)
      VALUES (${name}, ${price}, ${unit}, ${min_order}, ${pieces_per_carton || null}, ${discount || null}, ${category}, ${image_url || null}, ${description || null})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
