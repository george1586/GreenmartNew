import React from "react";

type Frequency = "weekly" | "biweekly" | "monthly";

export type Product = {
  id: string;
  name: string;
  tag: string | null;
  price_ron: number;
  is_active: boolean;
  frequencies: Frequency[];
  image_url: string | null;
  created_at?: string;
};

type ProductCardProps = {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onIncrement,
  onDecrement,
}) => {
  const selected = quantity > 0;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border bg-white text-sm shadow-sm transition hover:shadow-md ${
        selected ? "border-emerald-500 ring-1 ring-emerald-200" : "border-slate-200"
      }`}
    >
      {product.image_url && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col px-3 py-3">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            {product.name}
          </h3>
          <span className="text-xs font-semibold text-emerald-700">
            {product.price_ron.toFixed(2)} RON
          </span>
        </div>

        {product.tag && (
          <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-400">
            {product.tag}
          </p>
        )}

        <div className="mt-auto pt-2">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={onIncrement}
              className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Add to box
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDecrement}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center text-xs font-semibold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
