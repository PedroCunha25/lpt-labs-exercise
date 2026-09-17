import type {
  Category,
  ProductDetail,
  ProductListResponse,
} from "~/types/product";

const API_URL = "https://dummyjson.com";
const PRODUCT_SELECT = "id,title,price,thumbnail,category";

export type ProductSort = {
  sortBy: "price" | "title";
  order: "asc" | "desc";
};

type GetProductsOptions = {
  limit: number;
  skip: number;
  categories: string[];
  sort?: ProductSort;
};

export async function getProducts({
  limit,
  skip,
  categories,
  sort,
}: GetProductsOptions): Promise<ProductListResponse> {
  if (categories.length >= 2) {
    return getProductsForMultipleCategories({ limit, skip, categories, sort });
  }

  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: PRODUCT_SELECT,
  });

  if (sort) {
    params.set("sortBy", sort.sortBy);
    params.set("order", sort.order);
  }

  const endpoint =
    categories.length === 1
      ? `${API_URL}/products/category/${categories[0]}`
      : `${API_URL}/products`;

  const response = await fetch(`${endpoint}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json();
}

async function getProductsForMultipleCategories({
  limit,
  skip,
  categories,
  sort,
}: Omit<GetProductsOptions, "categories"> & {
  categories: string[];
}): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    limit: "0",
    select: PRODUCT_SELECT,
  });

  const response = await fetch(`${API_URL}/products?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const { products } = (await response.json()) as ProductListResponse;

  const filtered = products.filter((product) =>
    categories.includes(product.category),
  );

  const sorted = sort ? sortProducts(filtered, sort) : filtered;

  return {
    products: sorted.slice(skip, skip + limit),
    total: sorted.length,
    skip,
    limit,
  };
}

function sortProducts(
  products: ProductListResponse["products"],
  sort: ProductSort,
) {
  const direction = sort.order === "asc" ? 1 : -1;

  return [...products].sort((a, b) => {
    if (sort.sortBy === "price") {
      return (a.price - b.price) * direction;
    }

    return a.title.localeCompare(b.title) * direction;
  });
}

export async function getProduct(id: string): Promise<ProductDetail> {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (response.status === 404) {
    throw new Response("Not Found", { status: 404 });
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
  }

  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/products/categories`);

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }

  return response.json();
}
