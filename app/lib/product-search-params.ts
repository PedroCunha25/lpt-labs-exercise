import type { Category } from "~/types/product";
import type { ProductSort } from "~/lib/api.server";

export const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value);

export function parseSort(value: string | null): ProductSort | undefined {
  if (!value || !SORT_VALUES.includes(value as SortValue)) {
    return undefined;
  }

  const [sortBy, order] = value.split("-") as [
    "price" | "title",
    "asc" | "desc",
  ];

  return { sortBy, order };
}

export function parseCategories(
  searchParams: URLSearchParams,
  categories: Category[],
): string[] {
  const validSlugs = new Set(categories.map((category) => category.slug));

  return searchParams.getAll("category").filter((slug) => validSlugs.has(slug));
}

export function parsePage(value: string | null, totalPages: number): number {
  const parsed = Number.parseInt(value ?? "1", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.min(parsed, Math.max(totalPages, 1));
}

export function buildSearchParams(
  searchParams: URLSearchParams,
  overrides: { sort?: string; category?: string[]; page?: number },
): URLSearchParams {
  const next = new URLSearchParams(searchParams);

  if (overrides.sort !== undefined) {
    if (overrides.sort) {
      next.set("sort", overrides.sort);
    } else {
      next.delete("sort");
    }
  }

  if (overrides.category !== undefined) {
    next.delete("category");
    for (const slug of overrides.category) {
      next.append("category", slug);
    }
  }

  if (overrides.page !== undefined) {
    next.set("page", String(overrides.page));
  } else {
    next.delete("page");
  }

  return next;
}
