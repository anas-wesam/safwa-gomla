"use client";
import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { Product, CATEGORIES } from "@/lib/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== "الكل") params.set("category", selectedCategory);
    if (search) params.set("search", search);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [selectedCategory, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <main className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <header style={{ background: "#0f0f0f", borderBottom: "1px solid #222" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black" style={{ color: "#f59e0b" }}>الص</span>
            <div>
              <h1 className="text-xl font-black text-white leading-none">الصفوه</h1>
              <p className="text-xs" style={{ color: "#f59e0b" }}>لجملة الجملة</p>
            </div>
          </div>
          <a href="/admin" className="text-xs text-gray-600 hover:text-gray-300 transition-colors">إدارة</a>
        </div>
      </header>

      <div className="py-3 text-center text-sm font-bold" style={{ background: "#f59e0b", color: "#0a0a0a" }}>
        🏆 الصفوه — لجملة الجملة — أفضل أسعار الأدوات المنزلية بالجملة 🏆
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="flex-1 rounded-xl px-4 py-3 text-white outline-none border border-gray-700 focus:border-yellow-500 transition-colors"
            style={{ background: "#141414" }}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold transition-opacity hover:opacity-80"
            style={{ background: "#f59e0b", color: "#0a0a0a" }}
          >
            بحث
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setSearchInput(""); }}
              className="px-4 py-3 rounded-xl text-gray-400 border border-gray-700"
              style={{ background: "#141414" }}
            >
              ✕
            </button>
          )}
        </form>

        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={
                selectedCategory === cat
                  ? { background: "#f59e0b", color: "#0a0a0a" }
                  : { background: "#1a1a1a", color: "#888", border: "1px solid #333" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-xl h-64 animate-pulse" style={{ background: "#141414" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
}
