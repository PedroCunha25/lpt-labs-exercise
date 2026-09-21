import { useHref, useLinkClickHandler, useSearchParams } from "react-router";
import { cn } from "cn";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { buildSearchParams } from "~/lib/product-search-params";

const WINDOW_SIZE = 5;

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const [searchParams] = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const start = Math.max(
    1,
    Math.min(page - Math.floor(WINDOW_SIZE / 2), totalPages - WINDOW_SIZE + 1),
  );
  const pages = Array.from(
    { length: Math.min(WINDOW_SIZE, totalPages) },
    (_, index) => start + index,
  );

  function toFor(targetPage: number) {
    return `?${buildSearchParams(searchParams, { page: targetPage })}`;
  }

  return (
    <PaginationRoot className="mx-0 mt-10 justify-end">
      <PaginationContent>
        <PaginationItem>
          <PageLink
            to={toFor(Math.max(1, page - 1))}
            component={PaginationPrevious}
            text=""
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
            className={cn(
              "px-2 transition-opacity duration-150 ease-out",
              page === 1 && "pointer-events-none opacity-30",
            )}
          />
        </PaginationItem>
        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PageLink
              to={toFor(pageNumber)}
              component={PaginationLink}
              isActive={pageNumber === page}
              className={
                pageNumber === page
                  ? "border-primary bg-primary text-white hover:bg-primary hover:text-white"
                  : undefined
              }
            >
              {pageNumber}
            </PageLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PageLink
            to={toFor(Math.min(totalPages, page + 1))}
            component={PaginationNext}
            text=""
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : undefined}
            className={cn(
              "px-2 transition-opacity duration-150 ease-out",
              page === totalPages && "pointer-events-none opacity-30",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}

function PageLink({
  to,
  component: Component,
  ...props
}: {
  to: string;
  component:
    typeof PaginationLink | typeof PaginationPrevious | typeof PaginationNext;
  isActive?: boolean;
  text?: string;
  className?: string;
  "aria-disabled"?: boolean;
  tabIndex?: number;
  children?: React.ReactNode;
}) {
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to);

  return <Component href={href} onClick={handleClick} {...props} />;
}
