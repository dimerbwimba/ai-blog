// import { Metadata } from "next"
import { AccommodationService } from "@/services/accommodation.service"
import { PaginatedAccommodations } from "@/components/accommodations/paginated-accommodations"

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

// // Generate metadata for SEO
// export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
//   const page = parseInt(searchParams.page || '1')
  
//   return {
//     title: page === 1 
//       ? "All Accommodations" 
//       : `Accommodations - Page ${page}`,
//     description: "Browse through our curated list of accommodations across various destinations.",
//     openGraph: {
//       title: page === 1 
//         ? "All Accommodations" 
//         : `Accommodations - Page ${page}`,
//       description: "Browse through our curated list of accommodations across various destinations.",
//     }
//   }
// }

export default async function AccommodationsPage() {
  // Pre-fetch first page data
//   const { page } = await searchParams
//   const pageNumber = parseInt(page || '1')
//   const result = await AccommodationService.getPaginated(pageNumber)
  
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