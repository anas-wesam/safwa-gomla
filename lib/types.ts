export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  min_order: number;
  carton_qty?: number | null;
  pieces_per_carton?: number | null;
  discount?: number | null;
  category: string;
  image_url?: string | null;
  image?: string | null;
  description?: string | null;
  in_stock?: boolean;
  created_at?: string;
}

export const CATEGORIES = [
  "الكل",
  "أدوات مطبخ",
  "تنظيف ونظافة",
  "أدوات حمام",
  "تخزين وتنظيم",
  "أدوات منزلية متنوعة",
];
