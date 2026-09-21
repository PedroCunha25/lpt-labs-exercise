import { useLocation, useNavigation } from "react-router";
import { SlidersHorizontal } from "lucide-react";

import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Spinner } from "~/components/ui/spinner";
import { getCategories, getProducts } from "~/lib/api.server";
import {
  parseCategories,
  parsePage,
  parseSort,
} from "~/lib/product-search-params";
import { ProductGrid } from "~/components/product/product-grid";
import { SortSelect } from "~/components/product/sort-select";
import { CategoryFilter } from "~/components/product/category-filter";
import { Pagination } from "~/components/product/pagination";

const PAGE_SIZE = 9;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Online Store" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const categories = await getCategories();
  const selectedCategories = parseCategories(url.searchParams, categories);
  const sort = parseSort(url.searchParams.get("sort"));

  const firstPass = await getProducts({
    limit: PAGE_SIZE,
    skip: 0,
    categories: selectedCategories,
    sort,
  });

  const totalPages = Math.max(1, Math.ceil(firstPass.total / PAGE_SIZE));
  const page = parsePage(url.searchParams.get("page"), totalPages);

  const { products, total } =
    page === 1
      ? firstPass
      : await getProducts({
          limit: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
          categories: selectedCategories,
          sort,
        });

  return {
    products,
    total,
    page,
    totalPages,
    categories,
    selectedCategories,
    sortValue: url.searchParams.get("sort") ?? "",
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const {
    products,
    total,
    page,
    totalPages,
    categories,
    selectedCategories,
    sortValue,
  } = loaderData;
  const navigation = useNavigation();
  const location = useLocation();
  const isFiltering =
    navigation.state === "loading" &&
    navigation.location.pathname === location.pathname &&
    navigation.location.search !== location.search;

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="page py-8 sm:py-12">
      <h1 className="sr-only">Products</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_240px]">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <SortSelect sort={sortValue} categories={selectedCategories} />
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="sm" className="lg:hidden" />
                  }
                >
                  <SlidersHorizontal />
                  Filters
                  {selectedCategories.length > 0 &&
                    ` (${selectedCategories.length})`}
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="overflow-y-auto overscroll-contain px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    <CategoryFilter
                      categories={categories}
                      selected={selectedCategories}
                      sort={sortValue}
                      idPrefix="mobile"
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <p className="text-sm whitespace-nowrap text-muted-foreground">
              Showing {rangeStart}-{rangeEnd} of {total}
            </p>
          </div>

          <div className="relative mt-6">
            <div
              className={
                isFiltering
                  ? "pointer-events-none opacity-50 transition-opacity"
                  : "transition-opacity"
              }
            >
              <ProductGrid products={products} />
            </div>
            {isFiltering && (
              <div className="absolute inset-0 flex justify-center">
                <Spinner className="sticky top-1/2 size-8 text-primary" />
              </div>
            )}
          </div>

          <Pagination page={page} totalPages={totalPages} />
        </div>

        <div className="hidden lg:block">
          <CategoryFilter
            categories={categories}
            selected={selectedCategories}
            sort={sortValue}
          />
        </div>
      </div>
    </div>
  );
}
