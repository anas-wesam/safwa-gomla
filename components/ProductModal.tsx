"use client";
import { Product } from "@/lib/types";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  if (!product) return null;

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden border border-gray-700"
        style={{ background: "#141414" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-10 text-gray-400 hover:text-white text-2xl leading-none"
        >
          ×
        </button>

        <div className="w-full bg-gray-900" style={{ height: "260px" }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🏠</div>
          )}
        </div>

        <div className="p-5">
          <span
            className="text-xs px-2 py-1 rounded-full mb-2 inline-block"
            style={{ background: "#f59e0b22", color: "#f59e0b" }}
          >
            {product.category}
          </span>
          <h2 className="text-xl font-bold text-white mt-2 mb-3">{product.name}</h2>

          {product.description && (
            <p className="text-gray-400 text-sm mb-4">{product.description}</p>
          )}

          <div className="flex items-end gap-3 mb-4">
            {discountedPrice ? (
              <>
                <span className="text-3xl font-black" style={{ color: "#f59e0b" }}>
                  {discountedPrice.toFixed(2)} ج.م
                </span>
                <span className="text-lg line-through text-gray-500">
                  {Number(product.price).toFixed(2)}
                </span>
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#f59e0b", color: "#0a0a0a" }}
                >
                  -{product.discount}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-black" style={{ color: "#f59e0b" }}>
                {Number(product.price).toFixed(2)} ج.م / {product.unit}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3 text-center" style={{ background: "#1e1e1e" }}>
              <div className="text-xs text-gray-400 mb-1">الحد الأدنى للطلب</div>
              <div className="font-bold text-white">{product.min_order} {product.unit}</div>
            </div>
            {product.carton_qty && (
              <div className="rounded-lg p-3 text-center" style={{ background: "#1e1e1e" }}>
                <div className="text-xs text-gray-400 mb-1">القطع في الكرتونة</div>
                <div className="font-bold text-white">{product.carton_qty} قطعة</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
