import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const sql = getDb();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products;
    if (category && category !== "الكل" && search) {
      products = await sql`
        SELECT *, COALESCE(image_url, image) as image_url FROM products
        WHERE category = ${category} AND name ILIKE ${"%" + search + "%"}
        ORDER BY created_at DESC
      `;
    } else if (category && category !== "الكل") {
      products = await sql`
        SELECT *, COALESCE(image_url, image) as image_url FROM products WHERE category = ${category} ORDER BY created_at DESC
      `;
    } else if (search) {
      products = await sql`
        SELECT *, COALESCE(image_url, image) as image_url FROM products WHERE name ILIKE ${"%" + search + "%"} ORDER BY created_at DESC
      `;
    } else {
      products = await sql`SELECT *, COALESCE(image_url, image) as image_url FROM products ORDER BY created_at DESC`;
    }

    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
