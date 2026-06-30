import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      unit TEXT NOT NULL DEFAULT 'قطعة',
      min_order INTEGER NOT NULL DEFAULT 1,
      carton_qty INTEGER,
      discount INTEGER,
      category TEXT NOT NULL DEFAULT 'أدوات منزلية متنوعة',
      image_url TEXT,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
