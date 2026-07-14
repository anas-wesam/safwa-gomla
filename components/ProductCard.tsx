"use client";
import { Product } from "@/lib/types";

interface Props {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: Props) {
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/10"
      style={{ background: "#141414" }}
    >
      <div className="relative w-full bg-gray-900" style={{ height: "200px" }}>
        {(product.image_url || product.image) ? (
          <img
            src={product.image_url || product.image || ""}
            alt={product.name}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-5xl">
            🏠
          </div>
        )}
        {product.discount && (
          <span
            className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full"
            style={{ background: "#f59e0b", color: "#0a0a0a" }}
          >
            -{product.discount}%
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm text-white leading-tight mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {discountedPrice ? (
            <>
              <span className="font-black text-lg" style={{ color: "#f59e0b" }}>
                {discountedPrice.toFixed(2)} ج.م
              </span>
              <span className="text-xs line-through text-gray-500">
                {Number(product.price).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-black text-lg" style={{ color: "#f59e0b" }}>
              {Number(product.price).toFixed(2)} ج.م
            </span>
          )}
          <span className="text-xs text-gray-400">/ {product.unit}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
          <span>أدنى: {product.min_order} {product.unit}</span>
          {product.pieces_per_carton && <span>• كرتونة: {product.pieces_per_carton}</span>}
        </div>
      </div>
    </div>
  );
}
