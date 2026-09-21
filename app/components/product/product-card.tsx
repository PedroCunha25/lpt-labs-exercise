import { Link } from "react-router";

import type { Product } from "~/types/product";

export function ProductCard({ id, title, price, thumbnail }: Product) {
  return (
    <Link
      to={`/products/${id}`}
      viewTransition
      className="group block rounded-sm transition-opacity duration-100 ease-out focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none active:opacity-70"
    >
      <div className="aspect-square overflow-hidden bg-image-placeholder">
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>
      <p className="mt-3 text-sm text-foreground transition-colors group-hover:text-primary">
        {title}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">${price}</p>
    </Link>
  );
}
