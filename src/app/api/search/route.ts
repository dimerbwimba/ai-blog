import { NextRequest, NextResponse } from "next/server"
import { SearchService } from "@/services/search.service"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const categories = searchParams.getAll('category')

    if (!query) {
      return NextResponse.json({ 
        results: [], 
        pagination: { total: 0, pages: 0, page: 1, limit: 10 } 
      })
    }

    const results = await SearchService.searchPosts({
      query,
      page,
      categories
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('[SEARCH_API_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
} 