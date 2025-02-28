import { Metadata } from "next"
import { SearchResults } from "@/components/search/search-results"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    page?: string
    category?: string | string[]
  }>
}

export const metadata: Metadata = {
  title: "Search Travel Articles | TravelKaya",
  description: "Search through our collection of travel guides, tips, and stories.",
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const page = parseInt(params.page || '1')
  const categories = Array.isArray(params.category)
    ? params.category
    : params.category
      ? [params.category]
      : []

  return (
    <div className="container max-w-2xl py-20">
        <div className="">
          <SearchResults 
            query={query}
            page={page}
            categories={categories}
          />
        </div>
    </div>
  )
}