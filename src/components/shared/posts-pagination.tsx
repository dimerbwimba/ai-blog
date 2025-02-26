'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PostsPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export const PostsPagination = ({
  currentPage,
  totalPages,
  baseUrl,
}: PostsPaginationProps) => {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        asChild
      >
        <Link
          href={createPageURL(currentPage - 1)}
          aria-label="Previous page"
        >
          Previous
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className="w-10"
              asChild
            >
              <Link
                href={createPageURL(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Link>
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        disabled={currentPage >= totalPages}
        asChild
      >
        <Link
          href={createPageURL(currentPage + 1)}
          aria-label="Next page"
        >
          Next
        </Link>
      </Button>
    </div>
  );
}; 