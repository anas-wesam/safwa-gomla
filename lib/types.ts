export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  min_order: number;
  carton_qty?: number | null;
  discount?: number | null;
  category: string;
  image_url?: string | null;
  description?: string | null;
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
