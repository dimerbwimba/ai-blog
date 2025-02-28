import { NextRequest, NextResponse } from "next/server"
import { ViewService } from "@/services/view.service"
import { headers } from "next/headers"

async function getIpAddress() {
  try {
    const ipResponse = await fetch('https://api.ipify.org/?format=json')
    if (!ipResponse.ok) throw new Error('Failed to get IP')
    const { ip } = await ipResponse.json()
    return ip
  } catch (error) {
    console.error('[GET_IP_ERROR]', error)
    return '0.0.0.0'
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const {postId} = await params
    const headersList = await headers()
    const ip = await getIpAddress()
    const userAgent = headersList.get('user-agent')
    const referer = headersList.get('referer')

    const result = await ViewService.trackView({
      postId,
      ip,
      userAgent,
      referer
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[VIEW_API_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    )
  }
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const {postId} = await params
    const views = await ViewService.getPostViews(postId)
    return NextResponse.json(views)
  } catch (error) {
    console.error('[GET_VIEWS_API_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to get views' },
      { status: 500 }
    )
  }
} 