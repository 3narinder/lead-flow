import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  count: number;
  pageSize?: number;
  currentPage?: number;
}

const Pagination = ({
  count,
  pageSize = 10,
  currentPage: currentPageProp,
}: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentPage = currentPageProp ?? pageFromUrl;

  const pageCount = count === 0 ? 0 : Math.ceil(count / pageSize);
  const safePage =
    pageCount === 0 ? 1 : Math.min(currentPage, Math.max(1, pageCount));

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), Math.max(1, pageCount));
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(nextPage));
    setSearchParams(newParams);
  };

  if (count === 0) {
    return null;
  }

  const firstItem = (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, count);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="secondary-text">
        Showing{" "}
        <span className="font-medium text-text-primary">{firstItem}</span>
        {" – "}
        <span className="font-medium text-text-primary">{lastItem}</span> of{" "}
        <span className="font-medium text-text-primary">{count}</span> leads
      </p>

      {pageCount > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => goToPage(safePage - 1)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text-primary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HiChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, index) => {
              const page = index + 1;
              const isActive = page === safePage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-[0_4px_12px_rgba(91,110,174,0.35)]"
                      : "border border-border bg-surface text-text-secondary hover:bg-background hover:text-text-primary"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={safePage >= pageCount}
            onClick={() => goToPage(safePage + 1)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text-primary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <HiChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
