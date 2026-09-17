import { useHref, useLinkClickHandler, useSearchParams } from "react-router";

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
        {page > 1 && (
          <PaginationItem>
            <PageLink
              to={toFor(page - 1)}
              component={PaginationPrevious}
              text=""
              className="px-2"
            />
          </PaginationItem>
        )}
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
        {page < totalPages && (
          <PaginationItem>
            <PageLink
              to={toFor(page + 1)}
              component={PaginationNext}
              text=""
              className="px-2"
            />
          </PaginationItem>
        )}
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
  children?: React.ReactNode;
}) {
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to);

  return <Component href={href} onClick={handleClick} {...props} />;
}
