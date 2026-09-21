import type { Product } from "~/types/product";
import { ProductCard } from "~/components/product/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="animate-in py-16 text-center text-sm text-muted-foreground duration-200 ease-out fade-in slide-in-from-bottom-1">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-in duration-300 ease-out fill-mode-backwards fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        >
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
}
