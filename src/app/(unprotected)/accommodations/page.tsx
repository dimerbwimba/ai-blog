// import { Metadata } from "next"
import { Metadata } from "next"
import { PaginatedAccommodations } from "@/components/accommodations/paginated-accommodations"

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const {page } = await searchParams
  const p = parseInt(page || '1')
  
  return {
    title: p === 1 
      ? "All Accommodations" 
      : `Accommodations - Page ${p}`,
    description: "Browse through our curated list of accommodations across various destinations.",
    openGraph: {
      title: p === 1 
        ? "All Accommodations" 
        : `Accommodations - Page ${p}`,
      description: "Browse through our curated list of accommodations across various destinations.",
    }
  }
}

export default async function AccommodationsPage() {
  return (
    <div className="container max-w-2xl py-20">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Find Your Perfect Stay
        </h1>
        <p className="text-muted-foreground">
          Browse through our curated list of accommodations across various destinations.
        </p>
      </div>
      
      <PaginatedAccommodations />
    </div>
  )
} 