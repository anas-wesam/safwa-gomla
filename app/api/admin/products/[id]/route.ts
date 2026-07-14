import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function checkAuth(req: NextRequest) {
  return req.headers.get("x-admin-token") === "gomla123";
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const sql = getDb();
    const body = await req.json();
    const { name, price, unit, min_order, pieces_per_carton, discount, category, image_url, description } = body;
    const result = await sql`
      UPDATE products SET
        name=${name}, price=${price}, unit=${unit}, min_order=${min_order},
        pieces_per_carton=${pieces_per_carton || null}, discount=${discount || null},
        category=${category}, image=${image_url || null}, description=${description || null}
      WHERE id=${id} RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const sql = getDb();
    await sql`DELETE FROM products WHERE id=${id}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
