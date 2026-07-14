"use client";
import { useState, useEffect, useRef } from "react";
import { Product, CATEGORIES } from "@/lib/types";

const ADMIN_TOKEN = "gomla123";

const emptyForm = {
  name: "",
  price: "",
  unit: "قطعة",
  min_order: "1",
  pieces_per_carton: "",
  discount: "",
  category: "أدوات منزلية متنوعة",
  image_url: "",
  description: "",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed]);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  }

  async function uploadImage(file: File): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", preset!);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    return data.secure_url;
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch {
      setMsg("فشل رفع الصورة");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const body = {
      ...form,
      price: parseFloat(form.price),
      min_order: parseInt(form.min_order),
      pieces_per_carton: form.pieces_per_carton ? parseInt(form.pieces_per_carton) : null,
      discount: form.discount ? parseInt(form.discount) : null,
    };
    const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-token": ADMIN_TOKEN },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMsg(editId ? "تم التحديث ✓" : "تمت الإضافة ✓");
      setForm(emptyForm);
      setEditId(null);
      fetchProducts();
    } else {
      setMsg("حدث خطأ");
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("حذف المنتج؟")) return;
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": ADMIN_TOKEN },
    });
    fetchProducts();
  }

  function handleEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      unit: p.unit,
      min_order: String(p.min_order),
      pieces_per_carton: p.pieces_per_carton ? String(p.pieces_per_carton) : "",
      discount: p.discount ? String(p.discount) : "",
      category: p.category,
      image_url: p.image_url || "",
      description: p.description || "",
    });
    window.scrollTo(0, 0);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="w-full max-w-sm p-8 rounded-2xl border border-gray-800" style={{ background: "#141414" }}>
          <div className="text-center mb-6">
            <span className="text-4xl font-black" style={{ color: "#f59e0b" }}>الص</span>
            <h2 className="text-white text-xl font-bold mt-2">لوحة الإدارة</h2>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (password === ADMIN_TOKEN) setAuthed(true); else setMsg("باسورد غلط"); }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="الباسورد"
              className="w-full rounded-xl px-4 py-3 text-white outline-none border border-gray-700 focus:border-yellow-500 mb-3"
              style={{ background: "#1a1a1a" }}
            />
            {msg && <p className="text-red-400 text-sm mb-3">{msg}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold"
              style={{ background: "#f59e0b", color: "#0a0a0a" }}
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  const inputClass = "w-full rounded-xl px-4 py-2.5 text-white outline-none border border-gray-700 focus:border-yellow-500 text-sm";
  const inputStyle = { background: "#1a1a1a" };

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <header style={{ background: "#0f0f0f", borderBottom: "1px solid #222" }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black" style={{ color: "#f59e0b" }}>الص</span>
            <span className="text-white font-bold">لوحة الإدارة</span>
          </div>
          <a href="/" className="text-xs text-gray-400 hover:text-white">← الموقع</a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">
            {editId ? "تعديل منتج" : "إضافة منتج جديد"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required className={inputClass} style={inputStyle} placeholder="اسم المنتج *" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" step="0.01" className={inputClass} style={inputStyle} placeholder="السعر *" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} />
              <input required className={inputClass} style={inputStyle} placeholder="الوحدة *" value={form.unit} onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" className={inputClass} style={inputStyle} placeholder="الحد الأدنى *" value={form.min_order} onChange={(e) => setForm(f => ({ ...f, min_order: e.target.value }))} />
              <input type="number" className={inputClass} style={inputStyle} placeholder="قطع الكرتونة" value={form.pieces_per_carton} onChange={(e) => setForm(f => ({ ...f, pieces_per_carton: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" min="0" max="100" className={inputClass} style={inputStyle} placeholder="خصم %" value={form.discount} onChange={(e) => setForm(f => ({ ...f, discount: e.target.value }))} />
              <select className={inputClass} style={inputStyle} value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.filter(c => c !== "الكل").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <textarea className={inputClass} style={inputStyle} placeholder="وصف (اختياري)" rows={2} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />

            {/* Image upload */}
            <div className="rounded-xl border border-gray-700 p-3" style={{ background: "#1a1a1a" }}>
              {form.image_url && (
                <img src={form.image_url} alt="" className="w-full h-32 object-contain mb-2 rounded-lg" style={{ background: "#111" }} />
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full py-2 text-sm rounded-lg border border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-white transition-colors"
              >
                {uploading ? "جاري الرفع..." : "رفع صورة"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {form.image_url && (
                <input className={`${inputClass} mt-2`} style={inputStyle} placeholder="أو أدخل رابط الصورة" value={form.image_url} onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))} />
              )}
              {!form.image_url && (
                <input className={`${inputClass} mt-2`} style={inputStyle} placeholder="أو أدخل رابط الصورة" value={form.image_url} onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))} />
              )}
            </div>

            {msg && <p className="text-green-400 text-sm">{msg}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 py-3 rounded-xl font-bold disabled:opacity-50"
                style={{ background: "#f59e0b", color: "#0a0a0a" }}
              >
                {saving ? "جاري الحفظ..." : editId ? "تحديث" : "إضافة"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => { setEditId(null); setForm(emptyForm); }}
                  className="px-4 py-3 rounded-xl text-gray-400 border border-gray-700"
                  style={{ background: "#1a1a1a" }}
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products list */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">المنتجات ({products.length})</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-800" style={{ background: "#141414" }}>
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="w-12 h-12 object-contain rounded-lg flex-shrink-0" style={{ background: "#111" }} />
                ) : (
                  <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: "#1a1a1a" }}>🏠</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate">{p.name}</p>
                  <p className="text-xs" style={{ color: "#f59e0b" }}>{Number(p.price).toFixed(2)} ج.م / {p.unit}</p>
                  <p className="text-xs text-gray-500">{p.category}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(p)} className="px-2 py-1 text-xs rounded-lg text-yellow-400 border border-yellow-800 hover:bg-yellow-900/20">تعديل</button>
                  <button onClick={() => handleDelete(p.id)} className="px-2 py-1 text-xs rounded-lg text-red-400 border border-red-900 hover:bg-red-900/20">حذف</button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-center py-8">لا توجد منتجات بعد</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
