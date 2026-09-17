import { Link } from "react-router";

import type { Product } from "~/types/product";

export function ProductCard({ id, title, price, thumbnail }: Product) {
  return (
    <Link
      to={`/products/${id}`}
      className="group block rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="aspect-square overflow-hidden bg-image-placeholder">
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-3 text-sm text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">${price}</p>
    </Link>
  );
}
